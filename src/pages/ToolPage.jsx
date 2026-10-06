import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

// === UI COMPONENTS ===
const Toast = ({ message, type }) => ( 
  <motion.div layout initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }} className={`toast ${type}`}> 
    {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />} <span>{message}</span> 
  </motion.div> 
);

const ToolCard = ({ tool }) => ( 
  <Link to={`/tool/${tool.id}`} className="tool-card"> 
    <div className="tool-card-header"><div className="tool-card-icon"><tool.icon size={24} /></div><h3>{tool.name}</h3></div> 
    <p>{tool.description}</p> 
  </Link> 
);

const RelatedTools = ({ currentTool, categories }) => { 
  let catName = Object.keys(categories).find(cat => categories[cat].some(t => t.id === currentTool.id)); 
  if (!catName) return null; 
  const related = categories[catName].filter(t => t.id !== currentTool.id).slice(0, 3); 
  if (related.length === 0) return null; 
  return ( 
    <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', width: '100%', maxWidth: '1200px'}}> 
      <h3 style={{marginBottom: '1rem', fontSize: '1.2rem', textAlign: 'left'}}>Related Tools</h3> 
      <div className="responsive-grid" style={{textAlign: 'left'}}> {related.map(t => <ToolCard key={t.id} tool={t} />)} </div> 
    </motion.div> 
  ); 
};

// === TOOL REGISTRY ===
const toolComponents = {
  // Existing ...
  'html-to-jsx': lazy(() => import('../tools/HtmlToJsx')),
  'img-to-base64': lazy(() => import('../tools/ImageToBase64')),
  'svg-to-jsx': lazy(() => import('../tools/SvgToJsx')),
  'css-to-tailwind': lazy(() => import('../tools/CssToTailwind')),
  'csv-to-sql': lazy(() => import('../tools/CsvToSql')),
  'pdf-merge': lazy(() => import('../tools/PdfMerge')),
  'pdf-extract': lazy(() => import('../tools/PdfExtract')),
  'bg-remover': lazy(() => import('../tools/BgRemover')),
  'pass-strength': lazy(() => import('../tools/PassStrength')),
  'id3-editor': lazy(() => import('../tools/Id3Editor')),
  'aes-encrypt': lazy(() => import('../tools/AesEncrypt')),
  'rsa-gen': lazy(() => import('../tools/RsaGen')),
  'pgp-tool': lazy(() => import('../tools/PgpTool')),
  'steganography': lazy(() => import('../tools/Steganography')),
  'file-hash': lazy(() => import('../tools/FileHash')),
  'hash': lazy(() => import('../tools/ShaHash')),
  'bcrypt': lazy(() => import('../tools/BcryptHash')),
  'base64': lazy(() => import('../tools/Base64Encode')),
  'password': lazy(() => import('../tools/PasswordGen')),
  'exif-strip': lazy(() => import('../tools/ExifStrip')),
  'storage-debug': lazy(() => import('../tools/StorageDebug')),

  // NEW: Media & Graphics (Part 1)
  'img-crop': lazy(() => import('../tools/ImgCrop')),
  'img-rotate': lazy(() => import('../tools/ImgRotate')),
  'img-watermark-overlay': lazy(() => import('../tools/ImgWatermark')),
  'meme-gen': lazy(() => import('../tools/MemeGen')),
  'photo-filters': lazy(() => import('../tools/PhotoFilters')),
  'ocr': lazy(() => import('../tools/Ocr')),
  'mockup-gen': lazy(() => import('../tools/MockupGen')),
  'mesh-grad': lazy(() => import('../tools/MeshGrad')),
  'color-blind': lazy(() => import('../tools/ColorBlind')),
  'image': lazy(() => import('../tools/CompressImage')),
  'img-converter': lazy(() => import('../tools/ImgConverter')),
  'favicon-gen': lazy(() => import('../tools/FaviconGen')),
};

export default function ToolPageWrapper({ flatTools, categories }) {
  const { id } = useParams();
  const tool = flatTools.find((t) => t.id === id);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { 
    if (tool) {
      window.scrollTo(0, 0); 
      document.title = `Free ${tool.name} Tool | Secure & Private - I Love Tools`; 
    }
  }, [tool]);

  if (!tool) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Tool Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>The utility you are looking for does not exist.</p>
        <Link to="/tools" className="btn btn-primary">Browse All Tools</Link>
      </div>
    );
  }

  const showToast = (message, type = 'success') => { 
    const toastId = Date.now(); 
    setToasts(prev => [...prev, { id: toastId, message, type }]); 
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== toastId)); }, 3500); 
  };

  const ActiveToolComponent = toolComponents[tool.id];

  return (
    <motion.div key="tool" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="tool-workspace">
      <div className="toast-container">
        <AnimatePresence>{toasts.map(toast => <Toast key={toast.id} message={toast.message} type={toast.type} />)}</AnimatePresence>
      </div>

      <div className="tool-header">
        <Link to="/tools" className="back-btn"><ArrowLeft size={16}/> Browse all tools</Link>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </div>

      <div className="tool-body">
        <Suspense fallback={<div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading tool engine...</div>}>
          {ActiveToolComponent ? (
            <ActiveToolComponent showToast={showToast} />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>This tool is currently being optimized into its own isolated component.</p>
              <p>Create <code>src/tools/{tool.id}.jsx</code> and add it to the registry to activate it.</p>
            </div>
          )}
        </Suspense>
      </div>

      <RelatedTools currentTool={tool} categories={categories} />

      <div style={{ marginTop: '60px', padding: '50px 40px', borderTop: '1px solid var(--border)', color: 'var(--text-main)', background: 'var(--bg-card)', borderRadius: '24px', width:'100%', maxWidth:'1000px', textAlign:'left', boxShadow:'0 10px 30px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight:'800' }}>Free Client-Side {tool.name} Utility</h2>
        <p style={{ marginBottom: '30px', color:'var(--text-muted)', lineHeight: '1.8', fontSize:'1.1rem' }}>
          Are you looking for a secure, fast, and reliable solution for <strong>{tool.name.toLowerCase()}</strong>? 
          Our free client-side tool is designed to solve your problems instantly. 
          {tool.description}
        </p>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight:'700' }}>Why Choose I Love Tools?</h3>
        <ul style={{ marginBottom: '20px', color:'var(--text-muted)', paddingLeft: '25px', lineHeight: '1.8', fontSize:'1.1rem' }}>
          <li style={{marginBottom: '15px'}}><strong>Zero-Trust Security Architecture:</strong> Your files never leave your immediate device storage. Because this utility processes data 100% client-side via JavaScript, there are absolutely no server uploads, meaning zero risk of accidental data breaches or intercept leaks.</li>
          <li style={{marginBottom: '15px'}}><strong>Instantaneous Execution Speed:</strong> Say goodbye to waiting for massive files to upload across slow networks.</li>
          <li style={{marginBottom: '10px'}}><strong>Unlimited Access:</strong> We never restrict your file sizes or limit how many times you can run scripts daily.</li>
        </ul>
      </div>
    </motion.div>
  );
}