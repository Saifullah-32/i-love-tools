import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdBanner from './AdBanner';
import HomePage from './pages/HomePage';
import ToolPageWrapper from './pages/ToolPage';
import { categories, flatTools, popularToolIds } from './data/categories';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const handleMouseEnter = (category) => { if (window.innerWidth > 900) setActiveDropdown(category); };
  const handleMouseLeave = () => { if (window.innerWidth > 900) setActiveDropdown(null); };
  const handleMobileClick = (category) => { if (window.innerWidth <= 900) setActiveDropdown(activeDropdown === category ? null : category); };

  return (
    <BrowserRouter>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <Link to="/" className="site-logo-container" onClick={() => setSearchQuery('')}>
              <h1 className="site-logo">⚡ I Love Tools</h1>
            </Link>
            <p className="header-subtitle">100% Free, Private, Client-Side Web Utilities</p>

            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input type="text" placeholder="Search across 80+ tools..." className="search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <nav className="header-nav">
              {Object.keys(categories).map(category => (
                <div key={category} className="header-nav-item" onMouseEnter={() => handleMouseEnter(category)} onMouseLeave={handleMouseLeave}>
                  <button className="nav-category-btn" onClick={() => handleMobileClick(category)}>
                    {category} <ChevronDown size={16} className={`chevron ${activeDropdown === category || searchQuery ? 'open' : ''}`} />
                  </button>
                  <div className={`header-dropdown ${activeDropdown === category || searchQuery ? 'show' : ''}`}>
                    {categories[category].map(tool => (
                      <Link key={tool.id} to={`/tool/${tool.id}`} className="nav-link" onClick={() => setActiveDropdown(null)}>
                        <tool.icon size={16} /> {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </header>

        <div className="app-layout">
          <main className="main-content">
            <AdBanner />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage searchQuery={searchQuery} categories={categories} flatTools={flatTools} popularToolIds={popularToolIds} />} />
                <Route path="/tool/:id" element={<ToolPageWrapper flatTools={flatTools} categories={categories} />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>

        <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>I Love Tools &copy; {new Date().getFullYear()}</p>
          <p style={{ marginBottom: '8px' }}>Engineered for developers and designers.</p>
          <p style={{ marginBottom: '20px' }}>
            Have a suggestion for a new tool or found a bug? Let us know! <br/>
            Email: <a href="mailto:software.index.si@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>software.index.si@gmail.com</a>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button onClick={() => setActiveModal('privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setActiveModal('terms')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Terms of Service</button>
          </div>
        </footer>

        <AnimatePresence>
          {activeModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setActiveModal(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-base)', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                {activeModal === 'privacy' ? ( <> <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>Privacy Policy</h2> <p style={{ color: 'var(--text-muted)' }}>At I Love Tools, your privacy is our extreme priority. Most tools and utilities provided on this website operate 100% client-side. We do not upload, process, or store your local files on external servers.</p> </> ) : ( <> <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>Terms of Service</h2> <p style={{ color: 'var(--text-muted)' }}>All tools provided on this website are free to use and run primarily locally in your browser. We provide these utilities "as is" without any warranties of any kind.</p> </> )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <Analytics />
        <SpeedInsights />
      </div>
    </BrowserRouter>
  );
}