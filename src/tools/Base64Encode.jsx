import React, { useState } from 'react';

export default function Base64Encode({ showToast }) {
  const [baseInput, setBaseInput] = useState('');
  const [baseMode, setBaseMode] = useState('encode');

  const getBase64Result = () => {
    if (!baseInput) return '';
    try {
      return baseMode === 'encode' ? btoa(baseInput) : atob(baseInput);
    } catch {
      return 'Error: Invalid String';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Mode</label>
        <select className="form-control" value={baseMode} onChange={(e) => setBaseMode(e.target.value)}>
          <option value="encode">Encode string to Base64</option>
          <option value="decode">Decode Base64 to string</option>
        </select>
      </div>
      <div className="form-group">
        <label>Input</label>
        <textarea rows="4" className="form-control" value={baseInput} onChange={(e) => setBaseInput(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Result</label>
        <textarea rows="4" readOnly className="form-control" value={getBase64Result()} />
      </div>
    </div>
  );
}