import React, { useState, useEffect } from 'react';

export default function ImgRotate({ showToast }) {
  const [imgRotFile, setImgRotFile] = useState(null);
  const [imgRotDeg, setImgRotDeg] = useState('90');
  const [imgRotUrl, setImgRotUrl] = useState(null);

  useEffect(() => {
    return () => { if (imgRotUrl) URL.revokeObjectURL(imgRotUrl); };
  }, [imgRotUrl]);

  const handleImgRotate = () => {
    if (!imgRotFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const angle = Number(imgRotDeg) * Math.PI / 180;
      if (imgRotDeg === '90' || imgRotDeg === '270') {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      canvas.toBlob((blob) => {
        setImgRotUrl(URL.createObjectURL(blob));
        showToast('Image Rotated');
      }, 'image/png');
    };
    img.src = URL.createObjectURL(imgRotFile);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImgRotFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Degrees to Rotate</label>
        <select className="form-control" value={imgRotDeg} onChange={(e) => setImgRotDeg(e.target.value)}>
          <option value="90">90° Clockwise</option>
          <option value="180">180°</option>
          <option value="270">90° Counter-Clockwise</option>
        </select>
      </div>
      <button onClick={handleImgRotate} disabled={!imgRotFile} className="btn btn-primary">Rotate Photo</button>
      {imgRotUrl && (
        <div style={{ marginTop: '30px' }}>
          <img src={imgRotUrl} alt="Rotated" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} />
          <br />
          <a href={imgRotUrl} download="rotated.png" className="btn btn-secondary">Download Output</a>
        </div>
      )}
    </div>
  );
}