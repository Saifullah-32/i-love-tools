import React, { useState, useEffect } from 'react';

export default function PdfMerge({ showToast }) {
  const [pdfMergeFiles, setPdfMergeFiles] = useState([]);
  const [pdfResultUrl, setPdfResultUrl] = useState(null);
  const [pdfProcessing, setPdfProcessing] = useState(false);

  useEffect(() => {
    return () => { if (pdfResultUrl) URL.revokeObjectURL(pdfResultUrl); };
  }, [pdfResultUrl]);

  const handlePdfMergeProcess = async () => {
    setPdfProcessing(true);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();
      for (const file of pdfMergeFiles) {
        const doc = await PDFDocument.load(await file.arrayBuffer());
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const blob = new Blob([await mergedPdf.save()], { type: 'application/pdf' });
      setPdfResultUrl(URL.createObjectURL(blob));
      showToast('Merged Successfully');
    } catch (e) {
      showToast('Failed to merge documents', 'error');
    }
    setPdfProcessing(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Select Multiple PDFs</label>
        <input type="file" accept="application/pdf" multiple onChange={(e) => setPdfMergeFiles(Array.from(e.target.files))} className="file-input" />
      </div>
      <button onClick={handlePdfMergeProcess} disabled={pdfProcessing || pdfMergeFiles.length === 0} className="btn btn-primary">
        {pdfProcessing ? 'Processing...' : 'Merge PDFs'}
      </button>
      {pdfResultUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={pdfResultUrl} download="merged.pdf" className="btn btn-secondary">Download PDF</a>
        </div>
      )}
    </div>
  );
}