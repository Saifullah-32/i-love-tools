import React, { useState, useEffect } from 'react';

export default function ImgCrop({ showToast }) {
  const [imgCropFile, setImgCropFile] = useState(null);
  const [imgCropX, setImgCropX] = useState(0);
  const [imgCropY, setImgCropY] = useState(0);
  const [imgCropW, setImgCropW] = useState(500);
  const [imgCropH, setImgCropH] = useState(500);
  const [imgCropUrl, setImgCropUrl] = useState(null);

  useEffect(() => {
    return () => { if (imgCropUrl) URL.revokeObjectURL(imgCropUrl); };
  }, [imgCropUrl]);

  const handleImgCrop = () => {
    if (!imgCropFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Number(imgCropW);
      canvas.height = Number(imgCropH);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, Number(imgCropX), Number(imgCropY), Number(imgCropW), Number(imgCropH), 0, 0, Number(imgCropW), Number(imgCropH));
      
      canvas.toBlob((blob) => {
        setImgCropUrl(URL.createObjectURL(blob));
        showToast('Image Cropped');
      }, 'image/png');
    };
    img.src = URL.createObjectURL(imgCropFile);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImgCropFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="responsive-grid" style={{ marginBottom: '20px' }}>
        <div><label className="form-group">Start X (px)</label><input type="number" className="form-control" value={imgCropX} onChange={(e) => setImgCropX(e.target.value)} /></div>
        <div><label className="form-group">Start Y (px)</label><input type="number" className="form-control" value={imgCropY} onChange={(e) => setImgCropY(e.target.value)} /></div>
        <div><label className="form-group">Width (px)</label><input type="number" className="form-control" value={imgCropW} onChange={(e) => setImgCropW(e.target.value)} /></div>
        <div><label className="form-group">Height (px)</label><input type="number" className="form-control" value={imgCropH} onChange={(e) => setImgCropH(e.target.value)} /></div>
      </div>
      <button onClick={handleImgCrop} disabled={!imgCropFile} className="btn btn-primary">Crop Image</button>
      {imgCropUrl && (
        <div style={{ marginTop: '30px' }}>
          <img src={imgCropUrl} alt="Cropped" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} />
          <br />
          <a href={imgCropUrl} download="cropped.png" className="btn btn-secondary">Download Output</a>
        </div>
      )}
    </div>
  );
}