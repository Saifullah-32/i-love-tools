import React, { useState, useEffect } from 'react';

export default function ImgConverter({ showToast }) {
  const [convFile, setConvFile] = useState(null);
  const [convFormat, setConvFormat] = useState('image/webp');
  const [convQuality, setConvQuality] = useState(0.9);
  const [convUrl, setConvUrl] = useState('');

  useEffect(() => {
    return () => { if (convUrl) URL.revokeObjectURL(convUrl); };
  }, [convUrl]);

  const handleConvertImage = () => {
    if (!convFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        setConvUrl(URL.createObjectURL(blob));
        showToast('Converted');
      }, convFormat, Number(convQuality));
    };
    img.src = URL.createObjectURL(convFile);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setConvFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="responsive-grid">
        <div className="form-group">
          <label>Target Format</label>
          <select className="form-control" value={convFormat} onChange={(e) => setConvFormat(e.target.value)}>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quality (0.1 to 1.0)</label>
          <input type="number" step="0.1" min="0.1" max="1.0" className="form-control" value={convQuality} onChange={(e) => setConvQuality(e.target.value)} />
        </div>
      </div>
      <button onClick={handleConvertImage} disabled={!convFile} className="btn btn-primary">Convert Format</button>
      {convUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={convUrl} download={`converted.${convFormat.split('/')[1]}`} className="btn btn-secondary">Download New Image</a>
        </div>
      )}
    </div>
  );
}