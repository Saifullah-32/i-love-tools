import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ServerOff, ArrowRight } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'I Love Tools | 100% Free & Private Web Utilities';
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="home-dashboard" style={{textAlign: 'center', padding: '4rem 1rem'}}>
      
      <h1 style={{fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.2', color: 'var(--text-main)'}}>
        All the tools you need. <br/> <span style={{color: 'var(--primary)'}}>None of the privacy risks.</span>
      </h1>
      
      <p style={{color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: '1.6'}}>
        I Love Tools is a premium suite of 80+ web utilities designed for developers, designers, and everyday users. Everything runs entirely inside your browser. No server uploads. No data collection. 100% Free.
      </p>

      <Link to="/tools" className="btn btn-primary" style={{padding: '16px 32px', fontSize: '1.2rem', display: 'inline-flex', alignItems: 'center', gap: '10px', borderRadius: '50px'}}>
        Browse All 80+ Tools <ArrowRight size={20} />
      </Link>

      <div className="responsive-grid" style={{marginTop: '5rem', textAlign: 'left'}}>
        <div style={{padding: '30px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)'}}>
          <ShieldCheck size={40} color="var(--success)" style={{marginBottom: '20px'}} />
          <h3 style={{marginBottom: '10px', color: 'var(--text-main)'}}>100% Private</h3>
          <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>Your files never leave your device. All processing happens locally in your browser, guaranteeing absolute privacy for your sensitive documents and data.</p>
        </div>
        
        <div style={{padding: '30px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)'}}>
          <Zap size={40} color="var(--primary)" style={{marginBottom: '20px'}} />
          <h3 style={{marginBottom: '10px', color: 'var(--text-main)'}}>Lightning Fast</h3>
          <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>By eliminating server uploads and downloads, tasks like image conversion, PDF merging, and text extraction happen instantly using your device's power.</p>
        </div>

        <div style={{padding: '30px', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)'}}>
          <ServerOff size={40} color="var(--warning)" style={{marginBottom: '20px'}} />
          <h3 style={{marginBottom: '10px', color: 'var(--text-main)'}}>No Usage Limits</h3>
          <p style={{color: 'var(--text-muted)', lineHeight: '1.6'}}>We don't pay for expensive cloud processing, which means we don't need to put you behind a paywall. Use every tool as many times as you want, completely free.</p>
        </div>
      </div>
    </motion.div>
  );
}