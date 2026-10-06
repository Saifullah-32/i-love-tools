import React, { useState, useEffect } from 'react';

export default function MockupGen({ showToast }) {
  const [mockupImg, setMockupImg] = useState(null);
  const [mockupDevice, setMockupDevice] = useState('browser');
  const [mockupBg, setMockupBg] = useState('#4f46e5');
  const [mockupPadding, setMockupPadding] = useState(40);
  const [mockupResultUrl, setMockupResultUrl] = useState(null);

  useEffect(() => {
    return () => { if (mockupResultUrl) URL.revokeObjectURL(mockupResultUrl); };
  }, [mockupResultUrl]);

  const handleRenderMockup = () => {
    if (!mockupImg) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const pad = Number(mockupPadding);
      const headerHeight = mockupDevice === 'browser' ? 40 : 0;
      canvas.width = img.width + pad * 2;
      canvas.height = img.height + pad * 2 + headerHeight;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = mockupBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      
      ctx.fillStyle = '#1e1e2e';
      ctx.beginPath();
      ctx.roundRect(pad, pad, img.width, img.height + headerHeight, 14);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      
      if (mockupDevice === 'browser') {
        ctx.fillStyle = '#ff5f56';
        ctx.beginPath(); ctx.arc(pad + 20, pad + 20, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffbd2e';
        ctx.beginPath(); ctx.arc(pad + 38, pad + 20, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#27c93f';
        ctx.beginPath(); ctx.arc(pad + 56, pad + 20, 6, 0, Math.PI * 2); ctx.fill();
      }
      
      ctx.drawImage(img, pad, pad + headerHeight, img.width, img.height);
      
      canvas.toBlob((blob) => {
        setMockupResultUrl(URL.createObjectURL(blob));
        showToast('Mockup Rendered');
      }, 'image/png');
    };
    img.src = URL.createObjectURL(mockupImg);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Screenshot</label>
        <input type="file" accept="image/*" onChange={(e) => setMockupImg(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Padding</label>
        <input type="number" className="form-control" value={mockupPadding} onChange={(e) => setMockupPadding(e.target.value)} />
      </div>
      <button onClick={handleRenderMockup} disabled={!mockupImg} className="btn btn-primary">Render Mockup</button>
      {mockupResultUrl && (
        <div style={{ marginTop: '30px' }}>
          <img src={mockupResultUrl} style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} alt="Mockup" />
          <br/>
          <a href={mockupResultUrl} download="mockup.png" className="btn btn-secondary">Download Mockup</a>
        </div>
      )}
    </div>
  );
}