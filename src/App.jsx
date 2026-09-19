import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdBanner from './AdBanner';
import HomePage from './pages/HomePage';
import ToolsDirectory from './pages/ToolsDirectory';
import ToolPageWrapper from './pages/ToolPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { categories, flatTools, popularToolIds } from './data/categories';
import './App.css';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = (category) => { if (window.innerWidth > 900) setActiveDropdown(category); };
  const handleMouseLeave = () => { if (window.innerWidth > 900) setActiveDropdown(null); };
  const handleMobileClick = (category) => { if (window.innerWidth <= 900) setActiveDropdown(activeDropdown === category ? null : category); };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value && location.pathname !== '/tools') {
      navigate('/tools');
    }
  };

  return (
    <div className="container">
      {/* Minimalist Top Header */}
      <header className="header" style={{ padding: '16px 32px' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          
          {/* Left: Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setSearchQuery('')}>
            <img src="/favicon.png" alt="1T Logo" style={{ height: '36px', width: 'auto', borderRadius: '8px' }} />
            <h1 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-main)' }}>I Love Tools</h1>
          </Link>

          {/* Center: Main Navigation */}
          <nav style={{ display: 'flex', gap: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <Link to="/" style={{ color: location.pathname === '/' ? 'var(--text-main)' : 'inherit', transition: 'color 0.2s' }}>Home</Link>
            <Link to="/tools" style={{ color: location.pathname === '/tools' ? 'var(--text-main)' : 'inherit', transition: 'color 0.2s' }}>Tools</Link>
            <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--text-main)' : 'inherit', transition: 'color 0.2s' }}>About</Link>
            <Link to="/contact" style={{ color: location.pathname === '/contact' ? 'var(--text-main)' : 'inherit', transition: 'color 0.2s' }}>Contact</Link>
          </nav>

          {/* Right: Search & CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="search-container" style={{ width: '240px' }}>
              <Search className="search-icon" size={16} />
              <input type="text" placeholder="Search 80+ tools..." className="search-bar" value={searchQuery} onChange={handleSearch} style={{ padding: '8px 12px 8px 36px', background: 'var(--bg-base)' }} />
            </div>
            <Link to="/tools" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Get Started</Link>
          </div>

        </div>

        {/* Sub-Header: Tool Categories Dropdowns */}
        <nav className="header-nav" style={{ justifyContent: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '16px' }}>
          {Object.keys(categories).map(category => (
            <div key={category} className="header-nav-item" onMouseEnter={() => handleMouseEnter(category)} onMouseLeave={handleMouseLeave}>
              <button className="nav-category-btn" onClick={() => handleMobileClick(category)}>
                {category} <ChevronDown size={14} className={`chevron ${activeDropdown === category ? 'open' : ''}`} />
              </button>
              <div className={`header-dropdown ${activeDropdown === category ? 'show' : ''}`}>
                {categories[category].map(tool => (
                  <Link key={tool.id} to={`/tool/${tool.id}`} className="nav-link" onClick={() => setActiveDropdown(null)}>
                    <tool.icon size={16} /> {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </header>

      <div className="app-layout">
        <main className="main-content">
          <AdBanner />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<ToolsDirectory searchQuery={searchQuery} categories={categories} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/tool/:id" element={<ToolPageWrapper flatTools={flatTools} categories={categories} />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <footer style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border)', marginTop: '60px' }}>
        <p style={{ color: 'var(--text-main)', marginBottom: '8px', fontWeight: '500' }}>I Love Tools &copy; {new Date().getFullYear()}</p>
        <p style={{ marginBottom: '16px' }}>The modern platform for client-side utilities.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/about" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--text-main)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'}>About Us</Link>
          <Link to="/contact" style={{ transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color='var(--text-main)'} onMouseOut={(e) => e.target.style.color='var(--text-muted)'}>Contact</Link>
        </div>
      </footer>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}