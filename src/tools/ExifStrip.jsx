import React, { useState, useEffect } from 'react';

export default function ExifStrip({ showToast }) {
  const [strippedImgUrl, setStrippedImgUrl] = useState(null);

  useEffect(() => {
    return () => { if (strippedImgUrl) URL.revokeObjectURL(strippedImgUrl); };
  }, [strippedImgUrl]);

  const handleExifUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      
      // Drawing to canvas and exporting strips all EXIF metadata natively
      const dataUri = canvas.toDataURL('image/jpeg', 1.0);
      const byteString = atob(dataUri.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: 'image/jpeg' });

      setStrippedImgUrl(URL.createObjectURL(blob));
      showToast('Metadata Stripped');
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Select Photo</label>
        <input type="file" accept="image/*" onChange={handleExifUpload} className="file-input" />
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Drawing the image to an invisible HTML5 canvas safely strips all embedded GPS and camera metadata.
      </p>
      {strippedImgUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={strippedImgUrl} download="clean-image.jpg" className="btn btn-primary">Download Safe Image</a>
        </div>
      )}
    </div>
  );
}