import React from 'react';

export default function AdBanner() {
  const nativeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>body,html{margin:0;padding:0;background:transparent;overflow:hidden;}</style>
    </head>
    <body>
      <script async="async" data-cfasync="false" src="https://pl31132214.profitableratecpmnetwork.com/d21b6f193d6f4695922b07fd9c40bfb9/invoke.js"></script>
      <div id="container-d21b6f193d6f4695922b07fd9c40bfb9"></div>
    </body>
    </html>
  `;

  const verticalHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>body,html{margin:0;padding:0;background:transparent;overflow:hidden;display:flex;justify-content:center;}</style>
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
  `;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: '40px 0 20px 0' }}>
      
      {/* Native Ad srcDoc Sandbox */}
      <iframe 
        srcDoc={nativeHtml}
        title="Adsterra Native"
        style={{ width: '100%', maxWidth: '800px', height: '250px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      ></iframe>

      {/* Vertical Ad srcDoc Sandbox */}
      <iframe 
        srcDoc={verticalHtml}
        title="Adsterra Vertical"
        style={{ width: '160px', height: '300px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      ></iframe>
      
    </div>
  );
}