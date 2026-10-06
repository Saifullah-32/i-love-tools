import React, { useState, useEffect } from 'react';

export default function PdfExtract({ showToast }) {
  const [pdfExtFile, setPdfExtFile] = useState(null);
  const [pdfExtRange, setPdfExtRange] = useState('1, 3');
  const [pdfExtUrl, setPdfExtUrl] = useState(null);

  useEffect(() => {
    return () => { if (pdfExtUrl) URL.revokeObjectURL(pdfExtUrl); };
  }, [pdfExtUrl]);

  const handlePdfExtract = async () => {
    if (!pdfExtFile) return;
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await pdfExtFile.arrayBuffer());
      const newDoc = await PDFDocument.create();
      const pages = pdfExtRange.split(',').map(s => Number(s.trim()) - 1).filter(n => n >= 0 && n < doc.getPageCount());
      
      if (pages.length === 0) throw new Error('No valid pages');
      
      const copied = await newDoc.copyPages(doc, pages);
      copied.forEach(p => newDoc.addPage(p));
      setPdfExtUrl(URL.createObjectURL(new Blob([await newDoc.save()], { type: 'application/pdf' })));
      showToast('Pages Extracted');
    } catch {
      showToast('Invalid Range or Document', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>PDF Document</label>
        <input type="file" accept="application/pdf" onChange={(e) => setPdfExtFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Pages to Extract (Comma separated, e.g. 1, 3, 5)</label>
        <input type="text" className="form-control" value={pdfExtRange} onChange={(e) => setPdfExtRange(e.target.value)} />
      </div>
      <button onClick={handlePdfExtract} disabled={!pdfExtFile} className="btn btn-primary">
        Extract Pages
      </button>
      {pdfExtUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={pdfExtUrl} download="extracted.pdf" className="btn btn-secondary">Download PDF</a>
        </div>
      )}
    </div>
  );
}