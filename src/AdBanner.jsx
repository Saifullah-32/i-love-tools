import React from 'react';

export default function AdBanner() {
  // Wrapping the ad code inside an isolated HTML document string
  // ensures React doesn't block Adsterra's older script methods.
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; background: transparent; }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="//pl31132214.profitableratecpmnetwork.com/d21b6f193d6f4695922b07fd9c40bfb9/invoke.js"></script>
        <div id="container-d21b6f193d6f4695922b07fd9c40bfb9"></div>
      </body>
    </html>
  `;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', width: '100%', minHeight: '100px' }}>
      <iframe
        title="Advertisement"
        srcDoc={adHtml}
        width="100%"
        height="120"
        frameBorder="0"
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden', background: 'transparent' }}
      ></iframe>
    </div>
  );
}