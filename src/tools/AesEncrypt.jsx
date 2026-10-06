import React, { useState } from 'react';

export default function AesEncrypt({ showToast }) {
  const [aesText, setAesText] = useState('');
  const [aesPass, setAesPass] = useState('');
  const [aesMode, setAesMode] = useState('encrypt');
  const [aesResult, setAesResult] = useState('');

  const handleAesProcess = async () => {
    if (!aesPass) return showToast('Password required', 'error');
    try {
      const enc = new TextEncoder();
      if (aesMode === 'encrypt') {
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(aesText));
        
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);
        
        setAesResult(btoa(String.fromCharCode(...combined)));
        showToast('Encrypted');
      } else {
        const combined = Uint8Array.from(atob(aesText), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
        
        setAesResult(new TextDecoder().decode(decrypted));
        showToast('Decrypted');
      }
    } catch {
      showToast('Operation Failed', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Mode</label>
        <select className="form-control" value={aesMode} onChange={(e) => setAesMode(e.target.value)}>
          <option value="encrypt">Encrypt</option>
          <option value="decrypt">Decrypt</option>
        </select>
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea rows="4" className="form-control" value={aesText} onChange={(e) => setAesText(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Passphrase</label>
        <input type="password" placeholder="Passphrase" className="form-control" value={aesPass} onChange={(e) => setAesPass(e.target.value)} />
      </div>
      <button onClick={handleAesProcess} className="btn btn-primary">Process</button>
      {aesResult && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Result</label>
          <textarea rows="4" readOnly className="form-control" value={aesResult} />
        </div>
      )}
    </div>
  );
}