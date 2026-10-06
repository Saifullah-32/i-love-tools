import React, { useState, useEffect } from 'react';

export default function ColorBlind({ showToast }) {
  const [cbImage, setCbImage] = useState(null);
  const [cbType, setCbType] = useState('protanopia');
  const [cbResult, setCbResult] = useState(null);

  useEffect(() => {
    return () => { if (cbResult) URL.revokeObjectURL(cbResult); };
  }, [cbResult]);

  const simulateColorBlindness = () => {
    if (!cbImage) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (cbType === 'protanopia') {
          d[i] = 0.567 * r + 0.433 * g;
          d[i + 1] = 0.558 * r + 0.442 * g;
          d[i + 2] = 0.242 * g + 0.758 * b;
        } else if (cbType === 'deuteranopia') {
          d[i] = 0.625 * r + 0.375 * g;
          d[i + 1] = 0.7 * r + 0.3 * g;
          d[i + 2] = 0.3 * g + 0.7 * b;
        } else if (cbType === 'tritanopia') {
          d[i] = 0.95 * r + 0.05 * g;
          d[i + 1] = 0.433 * r + 0.567 * g;
          d[i + 2] = 0.475 * g + 0.525 * b;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      
      canvas.toBlob((blob) => {
        setCbResult(URL.createObjectURL(blob));
        showToast('Filter Applied');
      }, 'image/png');
    };
    img.src = URL.createObjectURL(cbImage);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Image File</label>
        <input type="file" accept="image/*" onChange={(e) => setCbImage(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Filter Type</label>
        <select className="form-control" value={cbType} onChange={(e) => setCbType(e.target.value)}>
          <option value="protanopia">Protanopia (Red-Blind)</option>
          <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
          <option value="tritanopia">Tritanopia (Blue-Blind)</option>
        </select>
      </div>
      <button onClick={simulateColorBlindness} disabled={!cbImage} className="btn btn-primary">Simulate</button>
      {cbResult && (
        <div style={{ marginTop: '30px' }}>
          <img src={cbResult} style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} alt="Simulated Vision" />
          <br/>
          <a href={cbResult} download="simulated.png" className="btn btn-secondary">Download Result</a>
        </div>
      )}
    </div>
  );
}