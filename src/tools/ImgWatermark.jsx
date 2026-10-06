import React, { useState, useEffect } from 'react';

export default function ImgWatermark({ showToast }) {
  const [imgWmFile, setImgWmFile] = useState(null);
  const [imgWmText, setImgWmText] = useState('CONFIDENTIAL');
  const [imgWmUrl, setImgWmUrl] = useState(null);

  useEffect(() => {
    return () => { if (imgWmUrl) URL.revokeObjectURL(imgWmUrl); };
  }, [imgWmUrl]);

  const handleImgWatermark = () => {
    if (!imgWmFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${Math.floor(img.width / 15)}px Arial`;
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-45 * Math.PI / 180);
      ctx.fillText(imgWmText, 0, 0);
      
      canvas.toBlob((blob) => {
        setImgWmUrl(URL.createObjectURL(blob));
        showToast('Watermark Applied');
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(imgWmFile);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImgWmFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Watermark Text</label>
        <input type="text" className="form-control" value={imgWmText} onChange={(e) => setImgWmText(e.target.value)} />
      </div>
      <button onClick={handleImgWatermark} disabled={!imgWmFile} className="btn btn-primary">Stamp Image</button>
      {imgWmUrl && (
        <div style={{ marginTop: '30px' }}>
          <img src={imgWmUrl} alt="Watermarked" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} />
          <br />
          <a href={imgWmUrl} download="watermarked.jpg" className="btn btn-secondary">Download Output</a>
        </div>
      )}
    </div>
  );
}