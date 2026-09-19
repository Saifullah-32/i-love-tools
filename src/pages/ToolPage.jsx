import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';
import { popularToolIds, flatTools } from '../data/categories';

const ToolCard = ({ tool }) => (
  <Link to={`/tool/${tool.id}`} className="tool-card">
    <div className="tool-card-header">
      <div className="tool-card-icon"><tool.icon size={24} /></div>
      <h3>{tool.name}</h3>
    </div>
    <p>{tool.description}</p>
  </Link>
);

export default function ToolsPage({ searchQuery, categories }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'All Tools | I Love Tools';
  }, []);

  const visibleCategories = Object.keys(categories).filter(cat => 
    !searchQuery || categories[cat].some(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <motion.div key="tools" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="home-dashboard">
      
      {/* Show Popular Tools only when the user is NOT actively searching */}
      {!searchQuery && (
        <>
          <div className="section-heading" style={{marginTop: '1rem'}}>
            <Sparkles size={24} color="var(--primary)" /> 
            Popular Tools
          </div>
          <div className="responsive-grid" style={{marginBottom: '3rem'}}>
            {popularToolIds.map(id => { 
              const t = flatTools.find(tool => tool.id === id); 
              return t ? <ToolCard key={t.id} tool={t} /> : null; 
            })}
          </div>
        </>
      )}

      <div className="section-heading" style={{marginTop: '1rem'}}>
        <Layers size={24} color="var(--primary)" /> 
        {searchQuery ? 'Search Results' : 'All Web Utilities'}
      </div>
      
      {visibleCategories.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>No tools found for "{searchQuery}".</div>
      ) : (
        visibleCategories.map(cat => {
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
        })
      )}
    </motion.div>
  );
}