import React, { useState } from 'react';

export default function ShaHash({ showToast }) {
  const [hashData, setHashData] = useState('');
  const [hashResult, setHashResult] = useState('');

  const generateHash = async () => {
    if (!hashData) return;
    const msgBuffer = new TextEncoder().encode(hashData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    setHashResult(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));
    showToast('Hash Generated');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Input String</label>
        <textarea rows="4" className="form-control" value={hashData} onChange={(e) => setHashData(e.target.value)} />
      </div>
      <button onClick={generateHash} className="btn btn-primary">Generate SHA-256</button>
      {hashResult && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Hash Value</label>
          <div className="form-control" style={{ wordBreak: 'break-all' }}>{hashResult}</div>
        </div>
      )}
    </div>
  );
}