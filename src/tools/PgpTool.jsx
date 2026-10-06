import React, { useState } from 'react';

export default function PgpTool({ showToast }) {
  const [pgpMode, setPgpMode] = useState('encrypt');
  const [pgpMsg, setPgpMsg] = useState('');
  const [pgpPass, setPgpPass] = useState('');
  const [pgpOutput, setPgpOutput] = useState('');

  const handlePgpProcess = async () => {
    try {
      const openpgp = await import('openpgp');
      if (pgpMode === 'encrypt') {
        const message = await openpgp.createMessage({ text: pgpMsg });
        const encrypted = await openpgp.encrypt({ message, passwords: [pgpPass], format: 'armored' });
        setPgpOutput(encrypted);
        showToast('PGP Encrypted');
      } else {
        const message = await openpgp.readMessage({ armoredMessage: pgpMsg });
        const { data: decrypted } = await openpgp.decrypt({ message, passwords: [pgpPass], format: 'utf8' });
        setPgpOutput(decrypted);
        showToast('PGP Decrypted');
      }
    } catch (err) {
      setPgpOutput(`Error: ${err.message}`);
      showToast('PGP Failed', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Mode</label>
        <select className="form-control" value={pgpMode} onChange={(e) => setPgpMode(e.target.value)}>
          <option value="encrypt">Encrypt</option>
          <option value="decrypt">Decrypt</option>
        </select>
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea rows="4" className="form-control" value={pgpMsg} onChange={(e) => setPgpMsg(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Passphrase" className="form-control" value={pgpPass} onChange={(e) => setPgpPass(e.target.value)} />
      </div>
      <button onClick={handlePgpProcess} className="btn btn-primary">Process PGP</button>
      {pgpOutput && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Result</label>
          <textarea rows="8" readOnly className="form-control" value={pgpOutput} />
        </div>
      )}
    </div>
  );
}