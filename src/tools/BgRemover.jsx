import React, { useState, useEffect } from 'react';
import { Wand2, Download } from 'lucide-react';

export default function BgRemover({ showToast }) {
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgResultUrl, setBgResultUrl] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    return () => { if (bgResultUrl) URL.revokeObjectURL(bgResultUrl); };
  }, [bgResultUrl]);

  const handleBgRemove = async () => {
    if (!bgImageFile) return;
    setIsRemovingBg(true);
    setProgressText('Connecting to AI Engine...');
    
    try {
      const imgly = await import('@imgly/background-removal');
      const removeBackground = imgly.removeBackground || imgly.default;
      
      // Configuration with live progress tracking
      const config = {
        progress: (key, current, total) => {
          const percent = Math.round((current / total) * 100);
          setProgressText(`Downloading ${key}: ${percent}%`);
        }
      };
      
      const blob = await removeBackground(bgImageFile, config);
      
      setBgResultUrl(URL.createObjectURL(blob));
      showToast('Background Erased via AI!');
    } catch (e) {
      console.error("CRITICAL AI ERROR: ", e);
      showToast('AI Error! Please check your console.', 'error');
    }
    
    setIsRemovingBg(false);
    setProgressText('');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Upload Photograph or Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => { 
            setBgImageFile(e.target.files[0]); 
            setBgResultUrl(null); 
          }} 
          className="file-input" 
        />
        {bgImageFile && (
          <div style={{ marginTop: '15px' }}>
            <img src={URL.createObjectURL(bgImageFile)} style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '12px', border: '1px solid var(--border)' }} alt="Preview" />
          </div>
        )}
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.6' }}>
        This tool utilizes a local WebAssembly AI model to automatically detect the main subject of your photo and erase the complex background. No data is sent to external servers.
      </p>

      <button onClick={handleBgRemove} disabled={!bgImageFile || isRemovingBg} className="btn btn-primary">
        <Wand2 size={20} /> {isRemovingBg ? progressText : 'Remove Background Automatically'}
      </button>

      {bgResultUrl && (
        <div style={{ marginTop: '30px', padding: '20px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <img src={bgResultUrl} style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: '15px', background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZvAXIiMjowTDMQ0MwwsZGMgC9LE0M4oMA4O/EA4eFAAAO3oQ/Q6l5fAAAAAASUVORK5CYII=)' }} alt="No Background Result" />
          <br />
          <a href={bgResultUrl} download="transparent-subject.png" className="btn btn-secondary">
            <Download size={20} /> Download Transparent PNG
          </a>
        </div>
      )}
    </div>
  );
}