import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdBanner from './AdBanner';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolPageWrapper from './pages/ToolsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { categories, flatTools, popularToolIds } from './data/categories';
import './App.css';

// We separate the content from the Router so we can use the useNavigate hook
function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseEnter = (category) => { if (window.innerWidth > 900) setActiveDropdown(category); };
  const handleMouseLeave = () => { if (window.innerWidth > 900) setActiveDropdown(null); };
  const handleMobileClick = (category) => { if (window.innerWidth <= 900) setActiveDropdown(activeDropdown === category ? null : category); };

  // Global search handler: redirects to /tools immediately if typing from another page
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value && location.pathname !== '/tools') {
      navigate('/tools');
    }
  };

  return (
    <div className="container">
      <header className="header" style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)' }}>
        
        {/* TOP HEADER: Logo, Page Nav, Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <Link to="/" className="site-logo-container" onClick={() => setSearchQuery('')}>
            <h1 className="site-logo" style={{ margin: 0 }}>⚡ I Love Tools</h1>
          </Link>

          <nav style={{ display: 'flex', gap: '30px', fontWeight: '600', fontSize: '1.05rem' }}>
            <Link to="/" style={{ color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)', textDecoration: 'none' }}>Home</Link>
            <Link to="/tools" style={{ color: location.pathname === '/tools' ? 'var(--primary)' : 'var(--text-main)', textDecoration: 'none' }}>Tools</Link>
            <Link to="/about" style={{ color: location.pathname === '/about' ? 'var(--primary)' : 'var(--text-main)', textDecoration: 'none' }}>About Us</Link>
            <Link to="/contact" style={{ color: location.pathname === '/contact' ? 'var(--primary)' : 'var(--text-main)', textDecoration: 'none' }}>Contact</Link>
          </nav>

          <div className="search-container" style={{ margin: 0, minWidth: '280px' }}>
            <Search className="search-icon" size={20} />
            <input type="text" placeholder="Search across 80+ tools..." className="search-bar" value={searchQuery} onChange={handleSearch} />
          </div>
        </div>

        {/* BOTTOM HEADER: Categories Dropdowns */}
        <nav className="header-nav" style={{ justifyContent: 'center', borderTop: '1px solid var(--border)', paddingTop: '15px' }}>
          {Object.keys(categories).map(category => (
            <div key={category} className="header-nav-item" onMouseEnter={() => handleMouseEnter(category)} onMouseLeave={handleMouseLeave}>
              <button className="nav-category-btn" onClick={() => handleMobileClick(category)}>
                {category} <ChevronDown size={16} className={`chevron ${activeDropdown === category ? 'open' : ''}`} />
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
              <Route path="/tools" element={<ToolsPage searchQuery={searchQuery} categories={categories} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/tool/:id" element={<ToolPageWrapper flatTools={flatTools} categories={categories} />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>I Love Tools &copy; {new Date().getFullYear()}</p>
        <p style={{ marginBottom: '8px' }}>Engineered for developers and designers.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
          <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link>
          <span>•</span>
          <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link>
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