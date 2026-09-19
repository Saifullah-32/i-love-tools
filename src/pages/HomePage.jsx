import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, TerminalSquare, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'I Love Tools | 100% Free & Private Web Utilities';
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className="home-dashboard" style={{textAlign: 'center', padding: '6rem 1rem 4rem 1rem'}}>
     

      {/* Massive Hero Heading */}
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '1.1', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
        Ship faster. <br />
        <span style={{ color: 'var(--text-muted)' }}>Process locally.</span>
      </h1>
      
      {/* Subheading */}
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
        The modern platform for developers and designers who need fast, secure web utilities. Everything you need to build, deploy, and format—running 100% client-side.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/tools" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '99px' }}>
          Start Building <ArrowRight size={18} />
        </Link>
        <Link to="/about" className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '99px' }}>
          View Documentation
        </Link>
      </div>

      {/* Trusted By Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Trusted by Industry Leaders</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.5, filter: 'grayscale(100%)' }}>
          {/* Placeholder names mimicking the logos in the video */}
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Vercel</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Stripe</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Linear</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Notion</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Figma</span>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div style={{ marginTop: '8rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Everything you need to ship</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
          Built for modern teams. Powerful features that help you build, deploy, and scale faster than ever without compromising privacy.
        </p>

        <div className="responsive-grid" style={{ textAlign: 'left' }}>
          
          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShieldCheck size={24} color="var(--text-main)" />
            </div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>100% Private</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Your files never leave your device. All processing happens locally in your browser, guaranteeing absolute privacy for sensitive data.</p>
          </div>
          
          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Zap size={24} color="var(--text-main)" />
            </div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>Blazing Fast</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>By eliminating server uploads and downloads, tasks like image conversion and PDF merging happen instantly using your device's power.</p>
          </div>

          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <TerminalSquare size={24} color="var(--text-main)" />
            </div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>Developer First</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Engineered for developers. Convert SVG to JSX, generate Tailwind classes, format JSON, and test APIs all from one unified dashboard.</p>
          </div>

          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Lock size={24} color="var(--text-main)" />
            </div>
            <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>Enterprise Security</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>We don't collect data, track usage, or require logins. You get enterprise-grade security simply by keeping your workflow entirely local.</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}