import React, { useState } from 'react';

export default function PassStrength() {
  const [passTestInput, setPassTestInput] = useState('Passw0rd123!');

  const passAnalysis = (() => {
    let score = 0;
    const checks = {
      length: passTestInput.length >= 12,
      upper: /[A-Z]/.test(passTestInput),
      lower: /[a-z]/.test(passTestInput),
      numbers: /[0-9]/.test(passTestInput),
      symbols: /[^A-Za-z0-9]/.test(passTestInput)
    };
    
    if (passTestInput.length >= 8) score += 20;
    if (passTestInput.length >= 14) score += 20;
    if (checks.upper && checks.lower) score += 20;
    if (checks.numbers) score += 20;
    if (checks.symbols) score += 20;
    
    let crackTime = '< 1 millisecond';
    if (score >= 80) crackTime = '3,000+ Years';
    else if (score >= 60) crackTime = '2 Months';
    else if (score >= 40) crackTime = '3 Days';
    
    return { score, crackTime };
  })();

  return (
    <div style={{ width: '100%' }}>
      <div className="form-group">
        <label>Type Password to Test</label>
        <input type="text" className="form-control" value={passTestInput} onChange={(e) => setPassTestInput(e.target.value)} />
      </div>
      <div style={{ margin: '40px 0', padding: '30px', background: 'var(--bg-surface)', borderRadius: '16px' }}>
        <strong>Security Score: {passAnalysis.score}%</strong>
        <p style={{ fontSize: '1.5rem', marginTop: '10px', color: passAnalysis.score > 70 ? '#10b981' : '#ef4444' }}>
          Est. Crack Time: {passAnalysis.crackTime}
        </p>
      </div>
    </div>
  );
}