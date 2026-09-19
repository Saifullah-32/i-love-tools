import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact | I Love Tools';
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
      
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Get in Touch</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>Have a suggestion for a new tool, or found a bug? We'd love to hear from you.</p>
      
      <div className="responsive-grid">
        <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <Mail size={40} color="var(--primary)" style={{ marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>Email Us</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>For support, feature requests, or business inquiries, reach out via email.</p>
          <a href="mailto:software.index.si@gmail.com" className="btn btn-primary" style={{ display: 'inline-block' }}>software.index.si@gmail.com</a>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <MessageSquare size={40} color="var(--success)" style={{ marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>Bug Reports</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>If a specific tool isn't rendering properly, please let us know your browser version when emailing.</p>
        </div>
      </div>
    </motion.div>
  );
}