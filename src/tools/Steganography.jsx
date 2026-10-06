import React, { useState, useEffect } from 'react';

export default function Steganography({ showToast }) {
  const [stegMode, setStegMode] = useState('encode');
  const [stegFile, setStegFile] = useState(null);
  const [stegSecret, setStegSecret] = useState('');
  const [stegResultUrl, setStegResultUrl] = useState('');
  const [stegDecoded, setStegDecoded] = useState('');

  useEffect(() => {
    return () => { if (stegResultUrl) URL.revokeObjectURL(stegResultUrl); };
  }, [stegResultUrl]);

  const handleStegProcess = () => {
    if (!stegFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      if (stegMode === 'encode') {
        const text = stegSecret;
        let bits = '';
        const len = text.length;
        for (let i = 31; i >= 0; i--) bits += (len >> i) & 1;
        for (let i = 0; i < len; i++) {
          const code = text.charCodeAt(i);
          for (let j = 7; j >= 0; j--) bits += (code >> j) & 1;
        }
        for (let i = 0; i < bits.length; i++) data[i] = (data[i] & ~1) | parseInt(bits[i], 10);
        ctx.putImageData(imgData, 0, 0);
        setStegResultUrl(URL.createObjectURL(dataURItoBlob(canvas.toDataURL('image/png'))));
        showToast('Encoded');
      } else {
        let lenBits = '';
        for (let i = 0; i < 32; i++) lenBits += data[i] & 1;
        const msgLen = parseInt(lenBits, 2);
        if (isNaN(msgLen) || msgLen <= 0 || msgLen > 100000) return showToast('No Message Found', 'error');
        
        let decoded = '';
        let bitIndex = 32;
        for (let i = 0; i < msgLen; i++) {
          let charBits = '';
          for (let j = 0; j < 8; j++) charBits += data[bitIndex++] & 1;
          decoded += String.fromCharCode(parseInt(charBits, 2));
        }
        setStegDecoded(decoded);
        showToast('Decoded!');
      }
    };
    img.src = URL.createObjectURL(stegFile);
  };

  // Helper to safely convert base64 to Blob for object URL
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Mode</label>
        <select className="form-control" value={stegMode} onChange={(e) => setStegMode(e.target.value)}>
          <option value="encode">Hide Message</option>
          <option value="decode">Extract Message</option>
        </select>
      </div>
      <div className="form-group">
        <label>Carrier Image</label>
        <input type="file" accept="image/*" onChange={(e) => setStegFile(e.target.files[0])} className="file-input" />
      </div>
      {stegMode === 'encode' && (
        <div className="form-group">
          <label>Secret Message</label>
          <textarea rows="3" className="form-control" value={stegSecret} onChange={(e) => setStegSecret(e.target.value)} />
        </div>
      )}
      <button onClick={handleStegProcess} disabled={!stegFile} className="btn btn-primary">Process</button>
      
      {stegResultUrl && stegMode === 'encode' && (
        <div style={{ marginTop: '30px' }}>
          <img src={stegResultUrl} style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} alt="Steg" />
          <br/>
          <a href={stegResultUrl} download="secret-image.png" className="btn btn-secondary">Download Image</a>
        </div>
      )}
      {stegDecoded && stegMode === 'decode' && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Extracted Message</label>
          <textarea rows="4" readOnly className="form-control" value={stegDecoded} />
        </div>
      )}
    </div>
  );
}