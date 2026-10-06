import React, { useState, useEffect } from 'react';

export default function PhotoFilters({ showToast }) {
  const [filterFile, setFilterFile] = useState(null);
  const [filterType, setFilterType] = useState('grayscale');
  const [filterUrl, setFilterUrl] = useState(null);

  useEffect(() => {
    return () => { if (filterUrl) URL.revokeObjectURL(filterUrl); };
  }, [filterUrl]);

  const handlePhotoFilter = () => {
    if (!filterFile) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (filterType === 'grayscale') ctx.filter = 'grayscale(100%)';
      else if (filterType === 'sepia') ctx.filter = 'sepia(100%)';
      else if (filterType === 'blur') ctx.filter = 'blur(5px)';
      else if (filterType === 'invert') ctx.filter = 'invert(100%)';
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        setFilterUrl(URL.createObjectURL(blob));
        showToast('Filter Applied');
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(filterFile);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setFilterFile(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Select CSS Filter</label>
        <select className="form-control" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="grayscale">Grayscale / B&W</option>
          <option value="sepia">Vintage Sepia</option>
          <option value="blur">Gaussian Blur</option>
          <option value="invert">Color Invert</option>
        </select>
      </div>
      <button onClick={handlePhotoFilter} disabled={!filterFile} className="btn btn-primary">Apply Filter</button>
      {filterUrl && (
        <div style={{ marginTop: '30px' }}>
          <img src={filterUrl} alt="Filtered" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px' }} />
          <br />
          <a href={filterUrl} download="filtered.jpg" className="btn btn-secondary">Download Output</a>
        </div>
      )}
    </div>
  );
}