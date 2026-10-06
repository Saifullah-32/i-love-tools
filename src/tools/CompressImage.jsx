import React, { useState, useEffect } from 'react';

export default function CompressImage({ showToast }) {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImgUrl, setCompressedImgUrl] = useState(null);
  const [targetSize, setTargetSize] = useState('500');
  const [targetUnit, setTargetUnit] = useState('KB');

  useEffect(() => {
    return () => { if (compressedImgUrl) URL.revokeObjectURL(compressedImgUrl); };
  }, [compressedImgUrl]);

  const handleCompressImage = async () => {
    if (!originalImage || !targetSize) return;
    try {
      const sizeInMB = targetUnit === 'KB' ? targetSize / 1024 : Number(targetSize);
      const imageCompression = (await import('browser-image-compression')).default;
      const compressedFile = await imageCompression(originalImage, { maxSizeMB: sizeInMB, maxWidthOrHeight: 4000, useWebWorker: true });
      
      setCompressedImgUrl(URL.createObjectURL(compressedFile));
      showToast('Compressed!');
    } catch {
      showToast('Failed compression', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Original Image</label>
        <input type="file" accept="image/*" onChange={(e) => setOriginalImage(e.target.files[0])} className="file-input" />
      </div>
      <div className="responsive-grid">
        <div className="form-group">
          <label>Target Max Size</label>
          <input type="number" className="form-control" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Unit</label>
          <select className="form-control" value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)}>
            <option value="KB">Kilobytes (KB)</option>
            <option value="MB">Megabytes (MB)</option>
          </select>
        </div>
      </div>
      <button onClick={handleCompressImage} disabled={!originalImage} className="btn btn-primary">Compress Image</button>
      {compressedImgUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={compressedImgUrl} download="compressed.jpg" className="btn btn-secondary">Download Result</a>
        </div>
      )}
    </div>
  );
}