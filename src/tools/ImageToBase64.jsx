import React, { useState } from 'react';

export default function ImageToBase64({ showToast }) {
  const [base64, setBase64] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBase64(ev.target.result);
      showToast('Image converted to Base64');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="file-input" />
      </div>
      {base64 && (
        <div className="form-group" style={{marginTop:'30px'}}>
          <label>Base64 Data URI</label>
          <textarea rows="8" readOnly className="form-control" value={base64} />
        </div>
      )}
    </div>
  );
}