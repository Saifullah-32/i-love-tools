import React, { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);
  const nativeRef = useRef(null);

  useEffect(() => {
    // --- 1. Safely Inject Adsterra 160x300 Vertical Banner ---
    if (bannerRef.current && !bannerRef.current.querySelector('script')) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        window.atOptions = {
          'key' : '0b79e85ac8b333771131176fb3e029f1',
          'format' : 'iframe',
          'height' : 300,
          'width' : 160,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.async = true;
      invokeScript.src = 'https://www.highrevenueformat.com/0b79e85ac8b333771131176fb3e029f1/invoke.js';
      
      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    }

    // --- 2. Safely Inject Adsterra Native Banner ---
    if (nativeRef.current && !nativeRef.current.querySelector('script')) {
      const nativeScript = document.createElement('script');
      nativeScript.type = 'text/javascript';
      nativeScript.async = true;
      nativeScript.dataset.cfasync = 'false';
      nativeScript.src = 'https://pl31132214.profitableratecpmnetwork.com/d21b6f193d6f4695922b07fd9c40bfb9/invoke.js';
      
      nativeRef.current.appendChild(nativeScript);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: '40px 0 20px 0' }}>
      
      {/* Target Div for Native Banner */}
      <div ref={nativeRef} style={{ minWidth: '300px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <div id="container-d21b6f193d6f4695922b07fd9c40bfb9"></div>
      </div>

      {/* Target Div for 160x300 Banner */}
      <div ref={bannerRef} style={{ width: '160px', minHeight: '300px', display: 'flex', justifyContent: 'center' }}>
      </div>
      
    </div>
  );
}