import React, { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    // This check prevents React from injecting the same ad script twice
    if (bannerRef.current && !bannerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      // The exact URL from your Adsterra dashboard
      script.src = '//pl31132214.profitableratecpmnetwork.com/d21b6f193d6f4695922b07fd9c40bfb9/invoke.js';
      
      bannerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', minHeight: '90px', width: '100%' }}>
      <div ref={bannerRef}>
        {/* Adsterra targets this exact ID to display the banner */}
        <div id="container-d21b6f193d6f4695922b07fd9c40bfb9"></div>
      </div>
    </div>
  );
}