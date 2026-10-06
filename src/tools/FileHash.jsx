import React, { useState } from 'react';

export default function FileHash({ showToast }) {
  const [hashFile, setHashFile] = useState(null);
  const [hashAlgo, setHashAlgo] = useState('SHA-256');
  const [fileHashResult, setFileHashResult] = useState('');

  const handleComputeFileHash = async () => {
    if (!hashFile) return;
    try {
      const buffer = await hashFile.arrayBuffer();
      const digest = await crypto.subtle.digest(hashAlgo, buffer);
      setFileHashResult(Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join(''));
      showToast('Computed');
    } catch {
      showToast('Error computing hash', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Target File</label>
        <input type="file" onChange={(e) => setHashFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Algorithm</label>
        <select className="form-control" value={hashAlgo} onChange={(e) => setHashAlgo(e.target.value)}>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-512">SHA-512</option>
          <option value="SHA-1">SHA-1</option>
        </select>
      </div>
      <button onClick={handleComputeFileHash} disabled={!hashFile} className="btn btn-primary">Compute File Hash</button>
      {fileHashResult && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Checksum Output</label>
          <textarea rows="2" readOnly className="form-control" value={fileHashResult} />
        </div>
      )}
    </div>
  );
}