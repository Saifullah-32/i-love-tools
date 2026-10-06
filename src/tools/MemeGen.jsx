import React, { useState, useEffect } from 'react';

export default function MemeGen({ showToast }) {
  const [memeFile, setMemeFile] = useState(null);
  const [memeTop, setMemeTop] = useState('TOP TEXT');
  const [memeBottom, setMemeBottom] = useState('BOTTOM TEXT');
  const [memeUrl, setMemeUrl] = useState(null);

  useEffect(() => {
    return () => { if (memeUrl) URL.revokeObjectURL(memeUrl); };
  }, [memeUrl]);

  const handleMemeGen = () => {
    if (!memeFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      ctx.font = `bold ${Math.floor(img.height / 10)}px Impact, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.floor(img.height / 150) + 2;
      ctx.textAlign = 'center';
      
      ctx.strokeText(memeTop.toUpperCase(), img.width / 2, img.height / 10 + 20);
      ctx.fillText(memeTop.toUpperCase(), img.width / 2, img.height / 10 + 20);
      
      ctx.strokeText(memeBottom.toUpperCase(), img.width / 2, img.height - img.height / 15);
      ctx.fillText(memeBottom.toUpperCase(), img.width / 2, img.height - img.height / 15);
      
      canvas.toBlob((blob) => {
        setMemeUrl(URL.createObjectURL(blob));
        showToast('Meme Generated');
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(memeFile);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Background Image</label>
        <input type="file" accept="image/*" onChange={(e) => setMemeFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Top Text</label>
        <input type="text" className="form-control" value={memeTop} onChange={(e) => setMemeTop(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Bottom Text</label>
        <input type="text" className="form-control" value={memeBottom} onChange={(e) => setMemeBottom(e.target.value)} />
      </div>
      <button onClick={handleMemeGen} disabled={!memeFile} className="btn btn-primary">Generate Meme</button>
      {memeUrl && (
        <div style={{ marginTop: '30px' }}>
          <img src={memeUrl} alt="Meme" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} />
          <br />
          <a href={memeUrl} download="meme.jpg" className="btn btn-secondary">Download Output</a>
        </div>
      )}
    </div>
  );
}