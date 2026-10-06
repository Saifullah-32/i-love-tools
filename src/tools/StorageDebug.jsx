import React, { useState } from 'react';
import { Bug } from 'lucide-react';

export default function StorageDebug({ showToast }) {
  const [storageIn, setStorageIn] = useState('{"user":{"token":"xyz"}}');
  const [storageOut, setStorageOut] = useState('');

  const formatStorage = () => {
    try {
      setStorageOut(JSON.stringify(JSON.parse(storageIn), null, 4));
      showToast('Parsed LocalStorage');
    } catch {
      showToast('Invalid JSON', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Raw LocalStorage JSON Dump</label>
        <textarea rows="8" className="form-control" style={{ fontFamily: 'monospace' }} value={storageIn} onChange={(e) => setStorageIn(e.target.value)} />
      </div>
      <button onClick={formatStorage} className="btn btn-primary">
        <Bug size={20} /> Parse & Validate String
      </button>
      {storageOut && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Parsed Browser Object</label>
          <textarea rows="12" readOnly className="form-control" value={storageOut} />
        </div>
      )}
    </div>
  );
}