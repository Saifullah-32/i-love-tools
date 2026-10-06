import React, { useState } from 'react';

export default function Ocr({ showToast }) {
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  const validateFile = (file, maxSizeMB) => { 
    if (!file) return false; 
    if (file.size > maxSizeMB * 1024 * 1024) { 
      showToast(`File too large. Max is ${maxSizeMB}MB.`, 'error'); 
      return false; 
    } 
    return true; 
  };

  const handleOcrProcess = async () => {
    if (!validateFile(ocrFile, 25)) return;
    setOcrLoading(true);
    showToast('Loading OCR Engine (May take a moment)...');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1);
      const ret = await worker.recognize(ocrFile);
      setOcrText(ret.data.text || 'No text recognized.');
      await worker.terminate();
      showToast('Text Extracted');
    } catch {
      showToast('OCR failed', 'error');
    }
    setOcrLoading(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setOcrFile(e.target.files[0])} className="file-input" />
      </div>
      <button onClick={handleOcrProcess} disabled={!ocrFile || ocrLoading} className="btn btn-primary">
        {ocrLoading ? 'Extracting Text...' : 'Extract Text'}
      </button>
      {ocrText && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Extracted Content</label>
          <textarea rows="8" readOnly className="form-control" value={ocrText} />
        </div>
      )}
    </div>
  );
}