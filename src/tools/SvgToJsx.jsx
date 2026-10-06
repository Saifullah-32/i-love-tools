import React, { useState } from 'react';
import { Code } from 'lucide-react';

export default function SvgToJsx({ showToast }) {
  const [svgJsxInput, setSvgJsxInput] = useState('<svg></svg>');
  const [svgJsxOutput, setSvgJsxOutput] = useState('');

  const convertSvgToJsx = () => {
    let res = svgJsxInput
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=');
    setSvgJsxOutput(`export const Icon = (props) => (\n  ${res.trim()}\n);`);
    showToast('Converted to JSX');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Raw SVG Code</label>
        <textarea rows="6" className="form-control" value={svgJsxInput} onChange={(e) => setSvgJsxInput(e.target.value)} />
      </div>
      <button onClick={convertSvgToJsx} className="btn btn-primary">
        <Code size={20} /> Convert to JSX
      </button>
      {svgJsxOutput && (
        <div className="form-group" style={{ marginTop: '30px' }}>
          <label>React JSX Output</label>
          <textarea rows="6" readOnly className="form-control" value={svgJsxOutput} />
        </div>
      )}
    </div>
  );
}