import React, { useEffect, useRef } from 'react';

export default function AdBanner() {
  const nativeRef = useRef(null);
  const verticalRef = useRef(null);

  useEffect(() => {
    // --- 1. Vertical 160x300 Banner Dynamic Stream ---
    if (verticalRef.current && !verticalRef.current.hasChildNodes()) {
      const iframe = document.createElement('iframe');
      iframe.width = '160';
      iframe.height = '300';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      verticalRef.current.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>body { margin: 0; background: transparent; display: flex; justify-content: center; overflow: hidden; }</style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '0b79e85ac8b333771131176fb3e029f1',
              'format' : 'iframe',
              'height' : 300,
              'width' : 160,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highrevenueformat.com/0b79e85ac8b333771131176fb3e029f1/invoke.js"></script>
        </body>
        </html>
      `);
      doc.close();
    }

    // --- 2. Native Banner Dynamic Stream ---
    if (nativeRef.current && !nativeRef.current.hasChildNodes()) {
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '250px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      nativeRef.current.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>body { margin: 0; background: transparent; overflow: hidden; }</style>
        </head>
        <body>
          <script async="async" data-cfasync="false" src="https://pl31132214.profitableratecpmnetwork.com/d21b6f193d6f4695922b07fd9c40bfb9/invoke.js"></script>
          <div id="container-d21b6f193d6f4695922b07fd9c40bfb9"></div>
        </body>
        </html>
      `);
      doc.close();
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: '40px 0 20px 0' }}>
      
      {/* Native Ad Container */}
      <div ref={nativeRef} style={{ width: '100%', maxWidth: '800px', height: '250px', display: 'flex', justifyContent: 'center' }}></div>

      {/* Vertical Ad Container */}
      <div ref={verticalRef} style={{ width: '160px', height: '300px', display: 'flex', justifyContent: 'center' }}></div>
      
    </div>
  );
}