import React from 'react';

export default function AdBanner() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: '40px 0 20px 0' }}>
      
      {/* Native Ad Sandbox */}
      <iframe 
        src="/ad-native.html" 
        title="Adsterra Native"
        style={{ width: '100%', maxWidth: '800px', height: '250px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      ></iframe>

      {/* Vertical Ad Sandbox */}
      <iframe 
        src="/ad-vertical.html" 
        title="Adsterra Vertical"
        style={{ width: '160px', height: '300px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      ></iframe>
      
    </div>
  );
}