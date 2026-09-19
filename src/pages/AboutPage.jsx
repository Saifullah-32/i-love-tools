import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About Us | I Love Tools';
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>About Us</h1>
      
      <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '20px' }}>
          <strong>I Love Tools</strong> was engineered with a single goal in mind: to provide powerful, everyday web utilities without compromising user privacy. 
        </p>
        <p style={{ marginBottom: '20px' }}>
          The internet is filled with free tool websites, but almost all of them require you to upload your sensitive PDFs, private images, and confidential code to their servers. Not only is this slow, but it creates a massive security vulnerability for you and your clients.
        </p>
        <p style={{ marginBottom: '20px' }}>
          Built by Software Index, this platform leverages modern browser capabilities to execute <strong>100% of the processing locally on your device</strong>. Whether you are merging a PDF, converting an image, or generating an AES encryption key, your data never leaves your computer.
        </p>
        <h3 style={{ color: 'var(--text-main)', marginTop: '30px', marginBottom: '15px' }}>Our Core Principles</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong>Zero Uploads:</strong> What happens on your device, stays on your device.</li>
          <li style={{ marginBottom: '10px' }}><strong>No Paywalls:</strong> We don't have expensive server bills, so we don't pass costs onto you.</li>
          <li style={{ marginBottom: '10px' }}><strong>Frictionless UX:</strong> No mandatory sign-ups, no waiting for files to process in a remote queue.</li>
        </ul>
      </div>
    </motion.div>
  );
}