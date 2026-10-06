import React, { useState } from 'react';

export default function PasswordGen({ showToast }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);

  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let r = '';
    const maxValid = Math.floor(4294967296 / charset.length) * charset.length;
    while (r.length < length) {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      if (randomValues[0] < maxValid) r += charset[randomValues[0] % charset.length];
    }
    setPassword(r);
    showToast('Password Generated');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Length ({length})</label>
        <input type="range" min="8" max="128" value={length} onChange={(e) => setLength(e.target.value)} className="form-control" />
      </div>
      <button onClick={generatePassword} className="btn btn-primary">Generate Secure Password</button>
      {password && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Your Password</label>
          <div className="form-control" style={{ fontSize: '1.5rem', textAlign: 'center', wordBreak: 'break-all' }}>{password}</div>
        </div>
      )}
    </div>
  );
}