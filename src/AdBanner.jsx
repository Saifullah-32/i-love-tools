import React, { useEffect } from 'react';

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1371188797226014" // <-- Your real Client ID
        data-ad-slot="1234567890"               // Note: You will replace this when you create an Ad Unit
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}