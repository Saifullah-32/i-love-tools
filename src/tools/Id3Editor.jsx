import React, { useState, useEffect } from 'react';

export default function Id3Editor({ showToast }) {
  const [id3File, setId3File] = useState(null);
  const [id3Title, setId3Title] = useState('');
  const [id3Artist, setId3Artist] = useState('');
  const [id3Album, setId3Album] = useState('');
  const [id3Url, setId3Url] = useState(null);

  useEffect(() => {
    return () => { if (id3Url) URL.revokeObjectURL(id3Url); };
  }, [id3Url]);

  const writeId3 = async () => {
    if (!id3File) return;
    try {
      const ID3Writer = (await import('browser-id3-writer')).default;
      const buffer = await id3File.arrayBuffer();
      const writer = new ID3Writer(buffer);
      writer.setFrame('TIT2', id3Title).setFrame('TPE1', [id3Artist]).setFrame('TALB', id3Album);
      writer.addTag();
      setId3Url(URL.createObjectURL(writer.getBlob()));
      showToast('Tags Written');
    } catch (e) {
      showToast('Error writing tags', 'error');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>MP3 File</label>
        <input type="file" accept="audio/mpeg" onChange={(e) => setId3File(e.target.files[0])} className="file-input" />
      </div>
      <div className="form-group">
        <label>Title</label>
        <input type="text" className="form-control" value={id3Title} onChange={(e) => setId3Title(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Artist</label>
        <input type="text" className="form-control" value={id3Artist} onChange={(e) => setId3Artist(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Album</label>
        <input type="text" className="form-control" value={id3Album} onChange={(e) => setId3Album(e.target.value)} />
      </div>
      <button onClick={writeId3} disabled={!id3File} className="btn btn-primary">
        Write Tags
      </button>
      {id3Url && (
        <div style={{ marginTop: '20px' }}>
          <a href={id3Url} download="tagged.mp3" className="btn btn-secondary">Download MP3</a>
        </div>
      )}
    </div>
  );
}