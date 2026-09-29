import React, { useEffect } from 'react';

export default function AdBanner() {
  useEffect(() => {
    // --- 1. Safely Inject Adsterra Native Banner ---
    const nativeContainer = document.getElementById('adsterra-native');
    if (nativeContainer && !nativeContainer.querySelector('script')) {
      const nativeScript = document.createElement('script');
      nativeScript.async = true;
      nativeScript.dataset.cfasync = 'false';
      nativeScript.src = 'https://pl31132214.profitableratecpmnetwork.com/d21b6f193d6f4695922b07fd9c40bfb9/invoke.js';
      
      nativeContainer.appendChild(nativeScript);
    }

    // --- 2. Safely Inject Adsterra 160x300 Vertical Banner ---
    const verticalContainer = document.getElementById('adsterra-160x300');
    if (verticalContainer && !verticalContainer.querySelector('script')) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '0b79e85ac8b333771131176fb3e029f1',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highrevenueformat.com/0b79e85ac8b333771131176fb3e029f1/invoke.js';
      
      verticalContainer.appendChild(confScript);
      verticalContainer.appendChild(invokeScript);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: '40px 0 20px 0' }}>
      
      {/* Target Div for Native Banner */}
      <div id="adsterra-native" style={{ minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
        <div id="container-d21b6f193d6f4695922b07fd9c40bfb9"></div>
      </div>

      {/* Target Div for 160x300 Banner */}
      <div id="adsterra-160x300" style={{ width: '160px', height: '300px', display: 'flex', justifyContent: 'center' }}>
        {/* Adsterra will dynamically inject the iframe right here */}
      </div>
      
    </div>
  );
}