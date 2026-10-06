import React, { useState } from 'react';
import { Wind } from 'lucide-react';

export default function CssToTailwind({ showToast }) {
  const [cssTwInput, setCssTwInput] = useState('.card { display: flex; justify-content: center; width: 100%; margin: 0 auto; font-weight: bold; }');
  const [cssTwOutput, setCssTwOutput] = useState('');

  const convertCssToTw = () => {
    const map = {
      'display: flex': 'flex', 'display: block': 'block', 'display: grid': 'grid',
      'justify-content: center': 'justify-center', 'justify-content: space-between': 'justify-between',
      'align-items: center': 'items-center', 'width: 100%': 'w-full', 'height: 100%': 'h-full',
      'margin: 0 auto': 'mx-auto', 'font-weight: bold': 'font-bold'
    };
    let out = cssTwInput;
    Object.keys(map).forEach(k => {
      out = out.replace(new RegExp(k + ';?', 'gi'), map[k]);
    });
    setCssTwOutput(out.replace(/\n/g, ' ').replace(/{|}|.card/g, '').replace(/;/g, '').trim());
    showToast('Converted');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>CSS Code</label>
        <textarea rows="6" className="form-control" value={cssTwInput} onChange={(e) => setCssTwInput(e.target.value)} />
      </div>
      <button onClick={convertCssToTw} className="btn btn-primary">
        <Wind size={20} /> Convert
      </button>
      {cssTwOutput && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>Tailwind Classes</label>
          <textarea rows="4" readOnly className="form-control" value={cssTwOutput} />
        </div>
      )}
    </div>
  );
}