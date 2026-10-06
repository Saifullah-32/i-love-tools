import React, { useState } from 'react';

export default function MeshGrad() {
  const [mesh1, setMesh1] = useState('#e94057');
  const [mesh2, setMesh2] = useState('#8a2387');
  const [mesh3, setMesh3] = useState('#f27121');

  const meshCss = `background-color: #ffffff;\nbackground-image:\n  radial-gradient(at 0% 0%, ${mesh1} 0px, transparent 50%),\n  radial-gradient(at 100% 0%, ${mesh2} 0px, transparent 50%),\n  radial-gradient(at 100% 100%, ${mesh3} 0px, transparent 50%);`;

  return (
    <div style={{ width: '100%' }}>
      <div className="responsive-grid" style={{ marginBottom: '20px' }}>
        <div className="form-group"><label>Color 1</label><input type="color" className="form-control" style={{height:'60px', padding:'10px'}} value={mesh1} onChange={(e) => setMesh1(e.target.value)} /></div>
        <div className="form-group"><label>Color 2</label><input type="color" className="form-control" style={{height:'60px', padding:'10px'}} value={mesh2} onChange={(e) => setMesh2(e.target.value)} /></div>
        <div className="form-group"><label>Color 3</label><input type="color" className="form-control" style={{height:'60px', padding:'10px'}} value={mesh3} onChange={(e) => setMesh3(e.target.value)} /></div>
      </div>
      
      <div style={{ height: '250px', width: '100%', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '30px', backgroundColor: '#ffffff', backgroundImage: `radial-gradient(at 0% 0%, ${mesh1} 0px, transparent 50%), radial-gradient(at 100% 0%, ${mesh2} 0px, transparent 50%), radial-gradient(at 100% 100%, ${mesh3} 0px, transparent 50%)` }}></div>

      <div className="form-group">
        <label>CSS Background Property</label>
        <textarea rows="6" readOnly className="form-control" value={meshCss} />
      </div>
    </div>
  );
}