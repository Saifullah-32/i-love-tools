import React, { useState } from 'react';

export default function BcryptHash({ showToast }) {
  const [bcryptPassInput, setBcryptPassInput] = useState('');
  const [bcryptHashOut, setBcryptHashOut] = useState('');

  const generateBcrypt = async () => {
    if (!bcryptPassInput) return;
    try {
      const bcrypt = (await import('bcryptjs')).default;
      const salt = bcrypt.genSaltSync(10);
      setBcryptHashOut(bcrypt.hashSync(bcryptPassInput, salt));
      showToast('Bcrypt Hash Generated');
    } catch {
      showToast('Hashing failed', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>String to Hash</label>
        <input type="text" className="form-control" value={bcryptPassInput} onChange={(e) => setBcryptPassInput(e.target.value)} />
      </div>
      <button onClick={generateBcrypt} className="btn btn-primary">Generate Bcrypt</button>
      {bcryptHashOut && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Hash Value</label>
          <textarea rows="3" readOnly className="form-control" value={bcryptHashOut} />
        </div>
      )}
    </div>
  );
}