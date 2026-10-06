import React, { useState, useEffect } from 'react';

export default function FaviconGen({ showToast }) {
  const [favFile, setFavFile] = useState(null);
  const [favZipUrl, setFavZipUrl] = useState(null);

  useEffect(() => {
    return () => { if (favZipUrl) URL.revokeObjectURL(favZipUrl); };
  }, [favZipUrl]);

  const generateFavicons = async () => {
    if (!favFile) return;
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const sizes = [
        { name: 'favicon-16x16.png', size: 16 },
        { name: 'favicon-32x32.png', size: 32 },
        { name: 'apple-touch-icon.png', size: 180 },
        { name: 'android-chrome-512x512.png', size: 512 }
      ];
      
      const img = new window.Image();
      img.src = URL.createObjectURL(favFile);
      await new Promise(r => { img.onload = r; });
      
      for (const item of sizes) {
        const canvas = document.createElement('canvas');
        canvas.width = item.size;
        canvas.height = item.size;
        canvas.getContext('2d').drawImage(img, 0, 0, item.size, item.size);
        zip.file(item.name, canvas.toDataURL('image/png').split(',')[1], { base64: true });
      }
      
      zip.file('site.webmanifest', JSON.stringify({
        name: "My Web App",
        icons: [{ src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }],
        display: "standalone"
      }, null, 2));
      
      const content = await zip.generateAsync({ type: 'blob' });
      setFavZipUrl(URL.createObjectURL(content));
      showToast('Bundle Created');
    } catch {
      showToast('Failed to create bundle', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Logo (PNG/JPG)</label>
        <input type="file" accept="image/*" onChange={(e) => setFavFile(e.target.files[0])} className="file-input" />
      </div>
      <button onClick={generateFavicons} disabled={!favFile} className="btn btn-primary">Build Favicon Bundle</button>
      {favZipUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={favZipUrl} download="favicons.zip" className="btn btn-secondary">Download ZIP Archive</a>
        </div>
      )}
    </div>
  );
}