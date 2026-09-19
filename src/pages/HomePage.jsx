import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Layers } from 'lucide-react';

const ToolCard = ({ tool }) => (
  <Link to={`/tool/${tool.id}`} className="tool-card">
    <div className="tool-card-header">
      <div className="tool-card-icon"><tool.icon size={24} /></div>
      <h3>{tool.name}</h3>
    </div>
    <p>{tool.description}</p>
  </Link>
);

export default function HomePage({ searchQuery, categories, flatTools, popularToolIds }) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    document.title = 'I Love Tools | 100% Free & Private Web Utilities';
  }, []);

  const visibleCategories = Object.keys(categories).filter(cat => 
    !searchQuery || categories[cat].some(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const categoriesToRender = (searchQuery || showAllCategories) ? visibleCategories : visibleCategories.slice(0, 1);

  return (
    <motion.div key="home" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="home-dashboard">
      <div className="home-hero">
        <h2>All the tools you need. None of the privacy risks.</h2>
        <p style={{color: 'var(--text-muted)', fontSize: '1.2rem'}}>80+ powerful web utilities running entirely on your local device.</p>
      </div>

      {!searchQuery && (
        <>
          <div className="section-heading"><Sparkles size={24} color="var(--primary)" /> Popular Tools</div>
          <div className="responsive-grid">
            {popularToolIds.map(id => { const t = flatTools.find(tool => tool.id === id); return t ? <ToolCard key={t.id} tool={t} /> : null; })}
          </div>
        </>
      )}

      <div className="section-heading" style={{marginTop: '3rem'}}><Layers size={24} color="var(--primary)" /> {searchQuery ? 'Search Results' : 'Browse Categories'}</div>
      
      {visibleCategories.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>No tools found for "{searchQuery}".</div>
      ) : (
        <>
          {categoriesToRender.map(cat => {
            const toolsToShow = categories[cat].filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));
            if (toolsToShow.length === 0) return null;
            return (
              <div key={cat} style={{marginBottom: '40px'}}>
                <h3 style={{marginBottom: '15px', color: 'var(--text-main)'}}>{cat}</h3>
                <div className="responsive-grid">
                  {toolsToShow.map(tool => <ToolCard key={tool.id} tool={tool} />)}
                </div>
              </div>
            )
          })}
          {!searchQuery && !showAllCategories && visibleCategories.length > 1 && (
            <div style={{textAlign: 'center', marginTop: '20px', marginBottom: '40px'}}>
              <button className="btn btn-secondary" onClick={() => setShowAllCategories(true)} style={{padding: '12px 24px', fontSize: '1.1rem'}}>
                <Layers size={18} style={{marginRight: '8px'}} /> View All 80+ Tools
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}