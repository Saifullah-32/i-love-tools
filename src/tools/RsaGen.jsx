import React, { useState } from 'react';

export default function RsaGen({ showToast }) {
  const [rsaPublic, setRsaPublic] = useState('');
  const [rsaPrivate, setRsaPrivate] = useState('');

  const generateRSA = async () => {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
        true, ["encrypt", "decrypt"]
      );
      const pub = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const priv = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      
      const toPem = (buf, t) => `-----BEGIN ${t}-----\n${btoa(String.fromCharCode(...new Uint8Array(buf))).match(/.{1,64}/g).join('\n')}\n-----END ${t}-----\n`;
      
      setRsaPublic(toPem(pub, "PUBLIC KEY"));
      setRsaPrivate(toPem(priv, "PRIVATE KEY"));
      showToast('RSA Keys Generated');
    } catch {
      showToast('Error generating keys', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <button onClick={generateRSA} className="btn btn-primary">Generate RSA Keys</button>
      {rsaPublic && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Public & Private Keys</label>
          <textarea rows="10" readOnly className="form-control" value={`${rsaPublic}\n${rsaPrivate}`} />
        </div>
      )}
    </div>
  );
}