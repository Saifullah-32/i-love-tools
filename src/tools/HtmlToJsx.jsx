import React, { useState } from 'react';
import { Code } from 'lucide-react';

export default function HtmlToJsx({ showToast }) {
  const [input, setInput] = useState('<div class="card" tabindex="0">\n  <p style="color: red;">Hello</p>\n</div>');
  const [output, setOutput] = useState('');

  const convert = () => {
    let jsx = input
      .replace(/class=/g, 'className=')
      .replace(/tabindex=/g, 'tabIndex=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/style="([^"]*)"/g, (match, p1) => {
        const styleObj = p1.split(';').filter(Boolean).map(s => {
          const [key, val] = s.split(':');
          const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
          return `${camelKey}: '${val.trim()}'`;
        }).join(', ');
        return `style={{ ${styleObj} }}`;
      });
    setOutput(jsx);
    showToast('Converted HTML to JSX');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Raw HTML</label>
        <textarea rows="6" className="form-control" value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <button onClick={convert} className="btn btn-primary"><Code size={20}/> Convert to JSX</button>
      {output && (
        <div className="form-group" style={{marginTop:'30px'}}>
          <label>React JSX Output</label>
          <textarea rows="6" readOnly className="form-control" value={output} />
        </div>
      )}
    </div>
  );
}