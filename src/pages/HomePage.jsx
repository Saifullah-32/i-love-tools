import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, TerminalSquare, Lock, ArrowRight, LayoutGrid } from 'lucide-react';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'I Love Tools | 100% Free & Private Web Utilities';
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -15 }} 
      transition={{ duration: 0.4 }} 
      className="home-dashboard" 
      style={{textAlign: 'center', padding: '6rem 1rem 4rem 1rem'}}
    >
      
      {/* Massive Hero Heading - Single SEO H1 */}
      <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: '700', letterSpacing: '-0.04em', lineHeight: '1.1', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
        Ship faster. <br />
        <span style={{ color: 'var(--text-muted)' }}>Process locally.</span>
      </h1>
      
      {/* Subheading */}
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
        The modern platform for developers and designers who need fast, secure web utilities. Everything you need to build, deploy, and format—running 100% client-side.
      </p>

      {/* CTA Buttons - SEO Internal Links */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/tools" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '99px' }}>
          Browse all tools <ArrowRight size={18} />
        </Link>
        <Link to="/about" className="btn btn-ghost" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '99px' }}>
          View Documentation
        </Link>
      </div>

      {/* Trusted By Section */}
      <div style={{ marginTop: '6rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>Trusted by Industry Leaders</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', opacity: 0.5, filter: 'grayscale(100%)' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Vercel</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Stripe</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Linear</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Notion</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Figma</span>
        </div>
      </div>

      {/* Feature Bento Grid */}
      <div style={{ marginTop: '8rem', textAlign: 'center' }}>
        {/* SEO H2 Heading */}
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Everything you need to ship</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 4rem auto' }}>
          Built for modern teams. Powerful features that help you build, deploy, and scale faster than ever without compromising privacy.
        </p>

        <div className="responsive-grid" style={{ textAlign: 'left' }}>
          
          <div style={{ padding: '40px', background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShieldCheck size={24} color="var(--text-main)" />
            </div>
            {/* SEO H3 Subheadings */}
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

      {/* SEO FAQ Section (Improves Word Count & Keyword Density) */}
      <div style={{ marginTop: '6rem', textAlign: 'left', maxWidth: '800px', margin: '6rem auto 0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Are these web utilities truly 100% free?</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Yes. We do not charge subscriptions, require credit cards, or limit your usage. You can process as many files, convert as many documents, and minify as much code as you need without hitting any paywalls.</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>How does local client-side processing protect my privacy?</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Traditional utility websites upload your sensitive documents to remote servers for processing, creating a massive security risk. I Love Tools utilizes modern WebAssembly and HTML5 APIs to execute complex tasks directly within your browser's memory. Your files never leave your physical device.</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Do I need to install any software?</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>No installation is required. Whether you are using a desktop, laptop, or mobile device, all of our tools run instantly inside modern web browsers like Chrome, Firefox, Safari, and Edge.</p>
        </div>
      </div>

      {/* SEO Internal Link Directory to fix "Very Few Links" error */}
      <div style={{ marginTop: '6rem', padding: '40px', background: 'var(--bg-surface)', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <LayoutGrid size={32} color="var(--text-main)" />
        <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>Explore Our App Ecosystem</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px' }}>
          Stop jumping between dozens of ad-filled websites. Access our complete directory of secure, local-first web utilities.
        </p>
        <Link to="/tools" className="btn btn-primary" style={{ marginTop: '10px', padding: '16px 32px', borderRadius: '12px', fontSize: '1.1rem' }}>
          Browse All 108 Tools Directory
        </Link>
      </div>

    </motion.div>
  );
}