import React, { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && typeof window !== 'undefined') {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '20px 0' }} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        title="Advertisement"
        style={{ display: 'block', minWidth: '300px', minHeight: '90px' }}
        data-ad-client="ca-pub-1371188797226014"
        data-ad-slot="9342551609"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;