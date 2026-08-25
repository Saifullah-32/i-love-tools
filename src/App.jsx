import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Image, FileText, Type, Key, Download, QrCode, Binary, AlignLeft, 
  CheckSquare, Code, Palette, FileUp, FileArchive, Music, Code2, 
  Maximize, Hash, Timer, Play, Pause, Square, LockOpen, Database, 
  FileCode2, Droplet, FileSpreadsheet, Calculator, Clock, Video, 
  Monitor, RefreshCw, Brackets, Calendar, FileSearch, Keyboard, 
  Crop, Globe, Link, Search, ChevronDown, ShieldCheck, Layers, 
  Sparkles, Film, Scissors, Wand2, Mic, Volume2, CameraOff, 
  KeyRound, Fingerprint, FileJson, GitCompare, ImagePlus, 
  Clapperboard, AppWindow, MicVocal, ArrowLeft, CheckCircle2, AlertCircle,
  Lock, Eye, FileCheck, Send, Sliders, FileCode
} from 'lucide-react';
import AdBanner from './AdBanner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

const encodeWAV = (audioBuffer) => {
  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let sampleRate = audioBuffer.sampleRate;
  let offset = 0; let pos = 0;
  const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
  const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };
  setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); setUint32(0x20746d66); 
  setUint32(16); setUint16(1); setUint16(numOfChan); setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); setUint16(numOfChan * 2); setUint16(16); 
  setUint32(0x61746164); setUint32(length - pos - 4); 
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) channels.push(audioBuffer.getChannelData(i));
  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true); pos += 2;
    }
    offset++;
  }
  return new Blob([buffer], { type: "audio/wav" });
};

const categories = {
  "Security & Privacy": [
    { id: 'aes-encrypt', name: 'AES Encryption', icon: ShieldCheck, description: 'Securely encrypt and decrypt sensitive text using AES-GCM directly in your browser.' },
    { id: 'rsa-gen', name: 'RSA Key Generator', icon: KeyRound, description: 'Generate secure Public and Private RSA key pairs locally for SSH or applications.' },
    { id: 'pgp-tool', name: 'PGP Encryptor', icon: Lock, description: 'Encrypt and decrypt standard armored PGP messages using passwords or OpenPGP keys.' },
    { id: 'steganography', name: 'Steganography', icon: Eye, description: 'Visually hide and encode secret encrypted text messages inside any standard image file.' },
    { id: 'file-hash', name: 'File Hash Check', icon: FileCheck, description: 'Calculate and verify SHA-256, SHA-1, and SHA-512 hashes for any local file.' },
    { id: 'hash', name: 'SHA-256 Hash', icon: Hash, description: 'Instantly generate secure SHA-256 cryptographic hashes from text.' },
    { id: 'bcrypt', name: 'Bcrypt Hash', icon: Fingerprint, description: 'Generate strong Bcrypt hashes securely inside the browser for backend testing.' },
    { id: 'password', name: 'Password Gen', icon: Key, description: 'Create randomized, secure passwords with custom character sets.' },
    { id: 'exif-strip', name: 'EXIF Stripper', icon: CameraOff, description: 'Remove hidden GPS coordinates, camera models, and timestamps from photos.' },
  ],
  "Media & Graphics": [
    { id: 'image', name: 'Compress Image', icon: Image, description: 'Compress PNG, JPG, and WebP images locally with custom target file size limits.' },
    { id: 'img-converter', name: 'Format Converter', icon: RefreshCw, description: 'Transcode images between PNG, JPG, and modern WebP formats in the browser.' },
    { id: 'favicon-gen', name: 'Favicon Generator', icon: FileArchive, description: 'Upload a logo to generate a complete multi-size favicon package and web manifest.' },
    { id: 'videditor', name: 'Video Editor', icon: Film, description: 'Trim clips, adjust playback speed, crop aspect ratios, and apply filters locally.' },
    { id: 'audioedit', name: 'Audio Editor', icon: Mic, description: 'Trim, adjust volume, apply fades, shift speed, and reverse audio to WAV.' },
    { id: 'resize', name: 'Resize Image', icon: Maximize, description: 'Resize the pixel dimensions of any image instantly in your browser.' },
    { id: 'palette-extract', name: 'Color Palette', icon: Palette, description: 'Extract dominant color palettes and hex codes from any uploaded image.' },
    { id: 'svg', name: 'SVG to PNG', icon: Image, description: 'Convert raw SVG code or files into standard PNG images.' },
    { id: 'svg-minify', name: 'SVG Minifier', icon: FileCode2, description: 'Reduce SVG file sizes by stripping whitespace, comments, and redundant nodes.' },
    { id: 'dummyimg', name: 'Dummy Image', icon: ImagePlus, description: 'Generate custom placeholder images with custom dimensions, colors, and text.' },
  ],
  "Developer & Code": [
    { id: 'api-tester', name: 'API Request Tester', icon: Send, description: 'Test REST APIs, inspect response headers, and format payloads without desktop clients.' },
    { id: 'code-to-img', name: 'Code to Image', icon: Code, description: 'Convert code snippets into clean, shareable images with customizable styling.' },
    { id: 'json-ts', name: 'JSON to TS', icon: Brackets, description: 'Convert JSON structures into TypeScript interface declarations.' },
    { id: 'json', name: 'JSON Format', icon: Code, description: 'Beautify, indent, and validate JSON payloads.' },
    { id: 'json-csv', name: 'JSON ↔ CSV', icon: FileJson, description: 'Convert JSON arrays to tabular CSVs or parse CSV data back to JSON.' },
    { id: 'sql-format', name: 'SQL Format', icon: Database, description: 'Format and beautify unindented SQL statements.' },
    { id: 'beautify', name: 'Code Beautify', icon: Code2, description: 'Format and indent code snippets.' },
    { id: 'diff-check', name: 'Diff Checker', icon: GitCompare, description: 'Compare two text blocks side-by-side to highlight differences.' },
    { id: 'url-encode', name: 'URL Encoder', icon: Link, description: 'Encode or decode URL query strings and URI components.' },
    { id: 'uuid-gen', name: 'UUID Generator', icon: Key, description: 'Generate bulk randomized UUIDs (v4).' },
    { id: 'mongo', name: 'MongoDB ID', icon: Database, description: 'Extract creation timestamps from MongoDB ObjectIDs.' },
    { id: 'jwt', name: 'JWT Decode', icon: LockOpen, description: 'Decode JSON Web Tokens to inspect payload and header claims.' },
    { id: 'box-shadow', name: 'CSS Shadow Gen', icon: AppWindow, description: 'Visually configure multi-layer CSS box-shadow styles.' },
    { id: 'glass', name: 'Glass CSS', icon: Sparkles, description: 'Generate CSS for Glassmorphism backdrop-blur effects.' },
    { id: 'data-uri', name: 'Data URI Gen', icon: FileCode, description: 'Convert images and SVGs into base64 Data URIs ready for CSS stylesheets.' },
    { id: 'regex', name: 'Regex Test', icon: FileSearch, description: 'Test regular expressions against target text.' },
    { id: 'keys', name: 'Keycodes', icon: Keyboard, description: 'Inspect JavaScript keyboard event properties and keyCodes.' },
    { id: 'viewport', name: 'Viewport', icon: Monitor, description: 'View current screen resolution, viewport dimensions, and device pixel ratio.' },
    { id: 'color', name: 'Color Pick', icon: Droplet, description: 'Convert HEX color codes into standard RGB values.' },
    { id: 'ratio', name: 'Aspect Ratio', icon: Crop, description: 'Calculate pixel dimensions based on aspect ratios.' },
  ],
  "Text & Data": [
    { id: 'excel-json', name: 'Excel to JSON', icon: FileSpreadsheet, description: 'Parse Excel sheets (.xlsx, .xls) and CSVs directly into structured JSON datasets.' },
    { id: 'counter', name: 'Word Counter', icon: FileText, description: 'Count words, characters, and spaces in text.' },
    { id: 'case', name: 'Case Convert', icon: Type, description: 'Switch text between uppercase, lowercase, and title case.' },
    { id: 'spell', name: 'Writing Pad', icon: CheckSquare, description: 'A writing pad with native browser spellcheck.' },
    { id: 'lorem', name: 'Lorem Ipsum', icon: AlignLeft, description: 'Generate placeholder Lorem Ipsum text.' },
    { id: 'md', name: 'Markdown', icon: FileCode2, description: 'Render and preview Markdown syntax safely in real-time.' },
    { id: 'cron', name: 'Cron Parse', icon: Calendar, description: 'Translate cron schedule expressions into readable text.' },
  ],
  "Business & Utilities": [
    { id: 'pdfgen', name: 'Photos to PDF', icon: FileUp, description: 'Convert multiple images and photos into a single PDF document.' },
    { id: 'invoice', name: 'PDF Invoice', icon: FileSpreadsheet, description: 'Create and download billing invoices as PDFs.' },
    { id: 'freelance', name: 'Freelance Calc', icon: Calculator, description: 'Calculate gross and net freelance earnings with tax estimates.' },
    { id: 'dummy-data', name: 'Mock Data Gen', icon: Layers, description: 'Generate randomized mock user records in JSON or CSV.' },
    { id: 'seo', name: 'SEO Meta', icon: Globe, description: 'Generate standard and Open Graph meta tags for web pages.' },
    { id: 'contrast-checker', name: 'Contrast Checker', icon: Sliders, description: 'Check color contrast ratios against WCAG 2.1 AA and AAA standards.' },
    { id: 'utm', name: 'UTM Builder', icon: Link, description: 'Build trackable campaign URLs with UTM parameters.' },
    { id: 'qr', name: 'QR Code', icon: QrCode, description: 'Generate QR code images from URLs or plain text.' },
    { id: 'zip', name: 'Zip Docs', icon: FileArchive, description: 'Compress files into a single .zip archive safely.' },
    { id: 'audio', name: 'Extract Audio', icon: Music, description: 'Extract raw audio tracks from video into high-quality WAV files.' },
    { id: 'screen', name: 'Screen Record', icon: Video, description: 'Record your screen natively without third-party software.' },
    { id: 'vid2gif', name: 'Video to GIF', icon: Clapperboard, description: 'Convert short video clips into lightweight, animated GIFs.' },
    { id: 'voicememo', name: 'Voice Memo', icon: MicVocal, description: 'Record and save audio notes securely in the browser.' },
    { id: 'timer', name: 'Stopwatch', icon: Timer, description: 'A precision stopwatch and lap timer.' },
    { id: 'pomo', name: 'Pomodoro', icon: Clock, description: 'Focus interval timer using the Pomodoro technique.' },
  ]
};

const flatTools = Object.values(categories).flat();
const popularToolIds = ['videditor', 'image', 'api-tester', 'excel-json', 'steganography', 'pgp-tool', 'code-to-img', 'json-ts'];

const Toast = ({ message, type }) => (
  <div className={`toast ${type}`}>
    {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
    <span>{message}</span>
  </div>
);

const ToolCard = ({ tool, navigate }) => (
  <a href={`/tool/${tool.id}`} onClick={(e) => { e.preventDefault(); navigate(`/tool/${tool.id}`); }} className="tool-card">
    <div className="tool-card-header">
      <div className="tool-card-icon"><tool.icon size={24} /></div>
      <h3>{tool.name}</h3>
    </div>
    <p>{tool.description}</p>
  </a>
);

const ToolHeader = ({ tool, navigate }) => (
  <div className="tool-header">
    <button className="back-btn" onClick={() => navigate('/')}>
      <ArrowLeft size={16}/> Browse all tools
    </button>
    <div className="tool-header-modern">
      <div className="tool-header-icon"><tool.icon size={40} /></div>
      <div className="tool-header-text">
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>
      </div>
    </div>
  </div>
);

const RelatedTools = ({ currentTool, navigate }) => {
  let catName = Object.keys(categories).find(cat => categories[cat].some(t => t.id === currentTool.id));
  if (!catName) return null;
  const related = categories[catName].filter(t => t.id !== currentTool.id).slice(0, 3);
  if (related.length === 0) return null;
  return (
    <div style={{marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)'}}>
      <h3 style={{marginBottom: '1rem', fontSize: '1.2rem'}}>Related Tools</h3>
      <div className="responsive-grid">
        {related.map(t => <ToolCard key={t.id} tool={t} navigate={navigate} />)}
      </div>
    </div>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const searchInputRef = useRef(null);

  useEffect(() => { 
    const handlePopState = () => setCurrentPath(window.location.pathname); 
    window.addEventListener('popstate', handlePopState); 
    return () => window.removeEventListener('popstate', handlePopState); 
  }, []);

  useEffect(() => { 
    const handleKeyDown = (e) => { 
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { 
        e.preventDefault(); 
        if (currentPath !== '/') navigate('/'); 
        setTimeout(() => searchInputRef.current?.focus(), 50); 
      } 
    }; 
    window.addEventListener('keydown', handleKeyDown); 
    return () => window.removeEventListener('keydown', handleKeyDown); 
  }, [currentPath]);

  const navigate = (path) => { 
    window.history.pushState({}, '', path); 
    setCurrentPath(path); 
    setSearchQuery(''); 
    setActiveDropdown(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const activeTab = currentPath === '/' ? 'home' : currentPath.replace('/tool/', ''); 
  const currentTool = flatTools.find(t => t.id === activeTab);

  useEffect(() => { 
    const isHome = activeTab === 'home'; 
    const siteName = 'I Love Tools'; 
    const title = isHome ? `${siteName} | 100% Free & Private Web Utilities` : `${currentTool?.name} - Free Client-Side Tool | ${siteName}`; 
    const description = isHome ? 'An all-in-one hub of 62+ free, private web utilities. Edit videos, convert audio, format code, and compress images directly in your browser with zero server uploads.' : currentTool?.description || `Use our free ${currentTool?.name} tool directly in your browser. 100% secure, client-side processing.`; 
    const canonical = `https://ilovetools.dev${currentPath}`; 
    document.title = title; 
    const setMeta = (name, content, isProperty = false) => { 
      const attr = isProperty ? 'property' : 'name'; 
      let tag = document.querySelector(`meta[${attr}="${name}"]`); 
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attr, name); document.head.appendChild(tag); } 
      tag.setAttribute('content', content); 
    }; 
    setMeta('description', description); setMeta('og:type', isHome ? 'website' : 'WebApplication', true); 
    setMeta('og:title', title, true); setMeta('og:description', description, true); 
    setMeta('og:url', canonical, true); setMeta('og:site_name', siteName, true); 
    setMeta('twitter:card', 'summary_large_image'); setMeta('twitter:title', title); 
    setMeta('twitter:description', description); 
    let link = document.querySelector('link[rel="canonical"]'); 
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); } 
    link.setAttribute('href', canonical); 
  }, [activeTab, currentPath, currentTool]);

  const [toasts, setToasts] = useState([]); 
  const showToast = (message, type = 'success') => { 
    const id = Date.now(); 
    setToasts(prev => [...prev, { id, message, type }]); 
    setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 3500); 
  };

  const [searchQuery, setSearchQuery] = useState(''); 
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [activeModal, setActiveModal] = useState(null); 

  const handleMouseEnter = (category) => { if (window.innerWidth > 900) setActiveDropdown(category); }; 
  const handleMouseLeave = () => { if (window.innerWidth > 900) setActiveDropdown(null); }; 
  const handleMobileClick = (category) => { if (window.innerWidth <= 900) setActiveDropdown(activeDropdown === category ? null : category); };

  const filteredCategories = (() => {
    if (!searchQuery) return categories;
    const filtered = {};
    const query = searchQuery.toLowerCase();
    Object.keys(categories).forEach(cat => {
      const matchingTools = categories[cat].filter(tool => tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query));
      if (matchingTools.length > 0) filtered[cat] = matchingTools;
    });
    return filtered;
  })();

  const validateFile = (file, maxSizeMB) => { 
    if (!file) return false; 
    if (file.size > maxSizeMB * 1024 * 1024) { showToast(`File too large. Max is ${maxSizeMB}MB.`, 'error'); return false; } 
    return true; 
  };

  const [activeObjectUrls, setActiveObjectUrls] = useState([]); 
  const trackUrl = (url) => { if(url) setActiveObjectUrls(prev => [...prev, url]); return url; };
  useEffect(() => { return () => { activeObjectUrls.forEach(url => URL.revokeObjectURL(url)); }; }, [activeObjectUrls]);

  // --- STATE ---
  const [aesText, setAesText] = useState(''); const [aesPass, setAesPass] = useState(''); const [aesMode, setAesMode] = useState('encrypt'); const [aesResult, setAesResult] = useState(''); const [aesError, setAesError] = useState(''); 
  const [rsaPublic, setRsaPublic] = useState(''); const [rsaPrivate, setRsaPrivate] = useState(''); 
  const [pgpMode, setPgpMode] = useState('encrypt'); const [pgpMsg, setPgpMsg] = useState(''); const [pgpPass, setPgpPass] = useState(''); const [pgpOutput, setPgpOutput] = useState(''); const [pgpProcessing, setPgpProcessing] = useState(false); 
  const [stegMode, setStegMode] = useState('encode'); const [stegFile, setStegFile] = useState(null); const [stegSecret, setStegSecret] = useState(''); const [stegResultUrl, setStegResultUrl] = useState(''); const [stegDecoded, setStegDecoded] = useState(''); 
  const [hashFile, setHashFile] = useState(null); const [hashAlgo, setHashAlgo] = useState('SHA-256'); const [fileHashResult, setFileHashResult] = useState(''); const [hashCompare, setHashCompare] = useState(''); const [hashingFile, setHashingFile] = useState(false); 
  const [hashData, setHashData] = useState(''); const [hashResult, setHashResult] = useState(''); 
  const [bcryptPassInput, setBcryptPassInput] = useState(''); const [bcryptHashOut, setBcryptHashOut] = useState(''); 
  const [baseInput, setBaseInput] = useState(''); const [baseMode, setBaseMode] = useState('encode'); 
  const [password, setPassword] = useState(''); const [length, setLength] = useState(16); 
  const [exifImgSrc, setExifImgSrc] = useState(null); const [strippedImgUrl, setStrippedImgUrl] = useState(null); 
  const [originalImage, setOriginalImage] = useState(null); const [compressedImage, setCompressedImage] = useState(null); const [compressedImgUrl, setCompressedImgUrl] = useState(null); const [compressing, setCompressing] = useState(false); const [targetSize, setTargetSize] = useState(''); const [targetUnit, setTargetUnit] = useState('KB'); 
  const [convFile, setConvFile] = useState(null); const [convFormat, setConvFormat] = useState('image/webp'); const [convQuality, setConvQuality] = useState(0.9); const [convUrl, setConvUrl] = useState(''); const [convSize, setConvSize] = useState(0); 
  const [favFile, setFavFile] = useState(null); const [favZipUrl, setFavZipUrl] = useState(null); const [favGenerating, setFavGenerating] = useState(false); 
  const [videoEditFile, setVideoEditFile] = useState(null); const [videoEditUrl, setVideoEditUrl] = useState(null); const [vidDuration, setVidDuration] = useState(0); const [trimStart, setTrimStart] = useState(0); const [trimEnd, setTrimEnd] = useState(0); const [vidSpeed, setVidSpeed] = useState(1); const [brightness, setBrightness] = useState(100); const [contrast, setContrast] = useState(100); const [saturation, setSaturation] = useState(100); const [sepia, setSepia] = useState(0); const [invert, setInvert] = useState(0); const [vidAspect, setVidAspect] = useState('original'); const [vidMuted, setVidMuted] = useState(false); const [vidText, setVidText] = useState(''); const [vidTextColor, setVidTextColor] = useState('#ffffff'); const [vidTextSize, setVidTextSize] = useState(48); const [vidTextPos, setVidTextPos] = useState('center'); const [videoProcessing, setVideoProcessing] = useState(false); const [videoProgress, setVideoProgress] = useState(0); const [exportedVideoUrl, setExportedVideoUrl] = useState(null); const [exportedVideoSize, setExportedVideoSize] = useState(0); const videoRef = useRef(null); 
  const [audioEditFile, setAudioEditFile] = useState(null); const [audioBuffer, setAudioBuffer] = useState(null); const [audioStart, setAudioStart] = useState(0); const [audioEnd, setAudioEnd] = useState(0); const [audioVolume, setAudioVolume] = useState(100); const [audioFadeIn, setAudioFadeIn] = useState(0); const [audioFadeOut, setAudioFadeOut] = useState(0); const [audioSpeed, setAudioSpeed] = useState(1); const [audioReverse, setAudioReverse] = useState(false); const [processingAudio, setProcessingAudio] = useState(false); const [exportedAudioUrl, setExportedAudioUrl] = useState(null); 
  const [resizeSource, setResizeSource] = useState(null); const [targetWidth, setTargetWidth] = useState(800); const [resizedDataUrl, setResizedDataUrl] = useState(null); 
  const [pdfImages, setPdfImages] = useState([]); const [generatingPdf, setGeneratingPdf] = useState(false); 
  const [extractVideo, setExtractVideo] = useState(null); const [extractingAudio, setExtractingAudio] = useState(false); const [extractedAudioUrl, setExtractedAudioUrl] = useState(null); 
  const [recordedChunks, setRecordedChunks] = useState([]); const [isRecording, setIsRecording] = useState(false); const mediaRecorderRef = useRef(null); 
  const [gifVideo, setGifVideo] = useState(null); const [gifGenerating, setGifGenerating] = useState(false); const [gifResult, setGifResult] = useState(null); const [gifW, setGifW] = useState(320); const [gifFrames, setGifFrames] = useState(30); 
  const [paletteColors, setPaletteColors] = useState([]); 
  const [svgInput, setSvgInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>'); const [pngUrl, setPngUrl] = useState(null); 
  const [svgMinInput, setSvgMinInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <!-- Circle Graphic -->\n  <circle cx="50" cy="50" r="40" fill="#e94057" />\n</svg>'); const [svgMinOutput, setSvgMinOutput] = useState(''); const [svgSavings, setSvgSavings] = useState(''); 
  const [arW1, setArW1] = useState(1920); const [arH1, setArH1] = useState(1080); const [arW2, setArW2] = useState(1280); const arH2 = Math.round((arH1 / arW1) * arW2) || 0;
  const [colorInput, setColorInput] = useState('#2563eb'); const [rgbOutput, setRgbOutput] = useState('rgb(37, 99, 235)'); 
  const [dummyW, setDummyW] = useState(800); const [dummyH, setDummyH] = useState(600); const [dummyBg, setDummyBg] = useState('#cccccc'); const [dummyColor, setDummyColor] = useState('#666666'); const [dummyText, setDummyText] = useState(''); const [dummyImgUrl, setDummyImgUrl] = useState(''); 
  const [apiUrl, setApiUrl] = useState('https://jsonplaceholder.typicode.com/todos/1'); const [apiMethod, setApiMethod] = useState('GET'); const [apiHeaders, setApiHeaders] = useState('{\n  "Content-Type": "application/json"\n}'); const [apiBody, setApiBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}'); const [apiLoading, setApiLoading] = useState(false); const [apiResponse, setApiResponse] = useState(''); const [apiStatus, setApiStatus] = useState(null); const [apiTime, setApiTime] = useState(null); 
  const [codeSnippet, setCodeSnippet] = useState('const calculateTotal = (items) => {\n  return items.reduce((sum, item) => sum + item.price, 0);\n};\n\nconsole.log(calculateTotal([{ price: 10 }, { price: 20 }]));'); const [codeTitle, setCodeTitle] = useState('index.js'); const [codeImgUrl, setCodeImgUrl] = useState(''); 
  const [fgColor, setFgColor] = useState('#1e293b'); const [bgColor, setBgColor] = useState('#ffffff'); 
  const [dataUriOut, setDataUriOut] = useState(''); 
  const [excelFile, setExcelFile] = useState(null); const [excelJsonOut, setExcelJsonOut] = useState(''); const [excelRowCount, setExcelRowCount] = useState(0); 
  const [jsonToTsInput, setJsonToTsInput] = useState('{"id": 1, "name": "Tool", "active": true}'); const [tsOutput, setTsOutput] = useState(''); 
  const [jsonInput, setJsonInput] = useState(''); const [jsonOutput, setJsonOutput] = useState(''); 
  const [j2cInput, setJ2cInput] = useState('[{"name":"John","age":30}]'); const [j2cOutput, setJ2cOutput] = useState(''); const [j2cMode, setJ2cMode] = useState('json2csv'); 
  const [sqlInput, setSqlInput] = useState('SELECT id, name FROM users WHERE age > 21;'); const [sqlOutput, setSqlOutput] = useState(''); 
  const [messyCode, setMessyCode] = useState(`int main(){cout<<"Hello";return 0;}`); const [cleanCode, setCleanCode] = useState(''); 
  const [diffA, setDiffA] = useState('Line 1\nLine 2'); const [diffB, setDiffB] = useState('Line 1\nLine 2 changed'); const [diffResult, setDiffResult] = useState([]); 
  const [urlInput, setUrlInput] = useState('https://ilovetools.dev/search?q=test'); const [urlOutput, setUrlOutput] = useState(''); const [urlMode, setUrlMode] = useState('encode'); 
  const [uuidCount, setUuidCount] = useState(10); const [uuidOutput, setUuidOutput] = useState(''); 
  const [mongoId, setMongoId] = useState(''); const [mongoResult, setMongoResult] = useState(''); 
  const [jwt, setJwt] = useState(''); const [jwtData, setJwtData] = useState(''); 
  const [boxH, setBoxH] = useState(10); const [boxV, setBoxV] = useState(10); const [boxBlur, setBoxBlur] = useState(15); const [boxSpread, setBoxSpread] = useState(0); const [boxColor, setBoxColor] = useState('#000000'); const [boxOpacity, setBoxOpacity] = useState(0.25); 
  const [blur, setBlur] = useState(10); const [opacity, setOpacity] = useState(0.5); 
  const [cronInput, setCronInput] = useState('0 12 * * 1-5'); const [cronResult, setCronResult] = useState(''); 
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z]+'); const [regexText, setRegexText] = useState('Test 123 string'); const [regexResult, setRegexResult] = useState(''); 
  const [keyData, setKeyData] = useState({ key: '-', code: '-', keyCode: '-' }); 
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); 
  const [text, setText] = useState(''); const [caseText, setCaseText] = useState(''); const [spellText, setSpellText] = useState(''); 
  const [paragraphs, setParagraphs] = useState(3); 
  const [mdInput, setMdInput] = useState('# Hello World\n\n**Bold Text**'); const [mdOutput, setMdOutput] = useState('');
  const [hours, setHours] = useState(10); const [rate, setRate] = useState(50); const [tax, setTax] = useState(20); const [client, setClient] = useState(''); 
  const [dummyCount, setDummyCount] = useState(5); const [dummyFormat, setDummyFormat] = useState('json'); const [dummyOutput, setDummyOutput] = useState(''); 
  const [seoTitle, setSeoTitle] = useState('My Awesome Page'); const [seoDesc, setSeoDesc] = useState('A brief description.'); const [seoImg, setSeoImg] = useState('https://example.com/image.jpg'); 
  const [utmUrl, setUtmUrl] = useState('https://example.com'); const [utmSrc, setUtmSrc] = useState('newsletter'); const [utmMed, setUtmMed] = useState('email'); const [utmCamp, setUtmCamp] = useState('summer_sale'); 
  const [qrText, setQrText] = useState('https://example.com');
  const [zipFiles, setZipFiles] = useState([]); const [zipping, setZipping] = useState(false); const [zipUrl, setZipUrl] = useState(null); 
  const [memoStream, setMemoStream] = useState(null); const [isRecordingMemo, setIsRecordingMemo] = useState(false); const memoChunks = useRef([]); const [memoUrl, setMemoUrl] = useState(null); const memoRecorderRef = useRef(null); 
  const [time, setTime] = useState(0); const [timerOn, setTimerOn] = useState(false); 
  const [pomoTime, setPomoTime] = useState(25 * 60); const [pomoActive, setPomoActive] = useState(false); 

  // --- DYNAMIC LOGIC ---
  const handleAesProcess = async () => { setAesError(''); if (!aesPass) { showToast('Password required', 'error'); return; } try { const enc = new TextEncoder(); if (aesMode === 'encrypt') { const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]); const salt = crypto.getRandomValues(new Uint8Array(16)); const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]); const iv = crypto.getRandomValues(new Uint8Array(12)); const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(aesText)); const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength); combined.set(salt, 0); combined.set(iv, salt.length); combined.set(new Uint8Array(encrypted), salt.length + iv.length); setAesResult(btoa(String.fromCharCode(...combined))); showToast('Encrypted Successfully'); } else { const combined = Uint8Array.from(atob(aesText), c => c.charCodeAt(0)); const salt = combined.slice(0, 16); const iv = combined.slice(16, 28); const data = combined.slice(28); const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]); const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]); const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data); setAesResult(new TextDecoder().decode(decrypted)); showToast('Decrypted Successfully'); } } catch { setAesError('Decryption failed.'); showToast('Decryption Failed', 'error'); } };
  const generateRSA = async () => { try { const keyPair = await window.crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]); const exportedPubKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey); const exportedPrivKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey); const exportToPem = (buffer, type) => { const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer))); return `-----BEGIN ${type}-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END ${type}-----\n`; }; setRsaPublic(exportToPem(exportedPubKey, "PUBLIC KEY")); setRsaPrivate(exportToPem(exportedPrivKey, "PRIVATE KEY")); showToast('RSA Keys Generated'); } catch { showToast('Error generating keys', 'error'); } };
  
  const handlePgpProcess = async () => { 
    if (!pgpMsg || !pgpPass) { showToast('Message/Passphrase required', 'error'); return; } 
    setPgpProcessing(true); 
    try { 
      const openpgp = await import('openpgp'); 
      if (pgpMode === 'encrypt') { 
        const message = await openpgp.createMessage({ text: pgpMsg }); 
        const encrypted = await openpgp.encrypt({ message, passwords: [pgpPass], format: 'armored' }); 
        setPgpOutput(encrypted); showToast('PGP Encrypted'); 
      } else { 
        const message = await openpgp.readMessage({ armoredMessage: pgpMsg }); 
        const { data: decrypted } = await openpgp.decrypt({ message, passwords: [pgpPass], format: 'utf8' }); 
        setPgpOutput(decrypted); showToast('PGP Decrypted'); 
      } 
    } catch (err) { setPgpOutput(`Error: ${err.message}`); showToast('PGP Failed', 'error'); } 
    setPgpProcessing(false); 
  };
  
  const handleStegProcess = () => { if (!validateFile(stegFile, 15)) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); const data = imgData.data; if (stegMode === 'encode') { const text = stegSecret; let bits = ''; for (let i = 31; i >= 0; i--) bits += (text.length >> i) & 1; for (let i = 0; i < text.length; i++) { const code = text.charCodeAt(i); for (let j = 7; j >= 0; j--) bits += (code >> j) & 1; } if (bits.length > data.length) { showToast('Image too small', 'error'); return; } for (let i = 0; i < bits.length; i++) { data[i] = (data[i] & ~1) | parseInt(bits[i], 10); } ctx.putImageData(imgData, 0, 0); setStegResultUrl(trackUrl(canvas.toDataURL('image/png'))); showToast('Encoded'); } else { let lenBits = ''; for (let i = 0; i < 32; i++) lenBits += data[i] & 1; const msgLen = parseInt(lenBits, 2); if (isNaN(msgLen) || msgLen <= 0 || msgLen > 100000) { setStegDecoded('No hidden message found.'); showToast('No Message', 'error'); return; } let decoded = ''; let bitIndex = 32; for (let i = 0; i < msgLen; i++) { let charBits = ''; for (let j = 0; j < 8; j++) { charBits += data[bitIndex++] & 1; } decoded += String.fromCharCode(parseInt(charBits, 2)); } setStegDecoded(decoded); showToast('Decoded!'); } }; img.src = URL.createObjectURL(stegFile); };
  const handleComputeFileHash = async () => { if (!validateFile(hashFile, 500)) return; setHashingFile(true); try { const buffer = await hashFile.arrayBuffer(); const digest = await crypto.subtle.digest(hashAlgo, buffer); const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join(''); setFileHashResult(hashHex); showToast('Checksum Computed'); } catch { showToast('Hash failed', 'error'); } setHashingFile(false); };
  const generateHash = async () => { const msgBuffer = new TextEncoder().encode(hashData); const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); setHashResult(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')); };
  
  const generateBcrypt = async () => { 
    if (!bcryptPassInput) { showToast('Enter text', 'error'); return; } 
    try { 
      const b = await import('bcryptjs'); 
      const bcrypt = b.default || b; 
      const salt = bcrypt.genSaltSync(10); 
      setBcryptHashOut(bcrypt.hashSync(bcryptPassInput, salt)); showToast('Bcrypt Hash Generated'); 
    } catch { showToast('Module load error', 'error'); } 
  };
  
  const getBase64Result = () => { if (!baseInput) return ''; try { return baseMode === 'encode' ? btoa(baseInput) : atob(baseInput); } catch { return 'Error: Invalid String'; } };
  const generatePassword = () => { const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'; let r = ''; const maxValid = Math.floor(4294967296 / charset.length) * charset.length; while (r.length < length) { const randomValues = new Uint32Array(1); window.crypto.getRandomValues(randomValues); if (randomValues[0] < maxValid) r += charset[randomValues[0] % charset.length]; } setPassword(r); };
  const handleExifUpload = (e) => { const file = e.target.files[0]; if (validateFile(file, 25)) { const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); setStrippedImgUrl(trackUrl(canvas.toDataURL('image/jpeg', 1.0))); showToast('Metadata Stripped'); }; img.src = URL.createObjectURL(file); setExifImgSrc(img.src); } };
  const handleImageUpload = (e) => { const file = e.target.files[0]; if (validateFile(file, 50)) { setOriginalImage(file); setCompressedImage(null); } }; 
  
  const handleCompressImage = async () => { 
    if (!originalImage || !targetSize || targetSize <= 0) { showToast('Enter valid size', 'error'); return; } 
    setCompressing(true); 
    try { 
      const ic = await import('browser-image-compression'); 
      const imageCompression = ic.default || ic; 
      const sizeInMB = targetUnit === 'KB' ? targetSize / 1024 : Number(targetSize); 
      const options = { maxSizeMB: sizeInMB, maxWidthOrHeight: 4000, useWebWorker: true }; 
      const compressedFile = await imageCompression(originalImage, options); 
      setCompressedImage(compressedFile); setCompressedImgUrl(trackUrl(URL.createObjectURL(compressedFile))); showToast('Compressed!'); 
    } catch { showToast('Failed compression', 'error'); } finally { setCompressing(false); } 
  };
  
  const handleConvertImage = () => { if (!convFile) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); canvas.toBlob((blob) => { setConvUrl(trackUrl(URL.createObjectURL(blob))); setConvSize(blob.size); showToast('Converted'); }, convFormat, convQuality); }; img.src = URL.createObjectURL(convFile); };
  
  const generateFavicons = async () => { 
    if (!favFile) return; 
    setFavGenerating(true); 
    try { 
      const j = await import('jszip'); const JSZip = j.default || j; const zip = new JSZip(); 
      const sizes = [ { name: 'favicon-16x16.png', size: 16 }, { name: 'favicon-32x32.png', size: 32 }, { name: 'favicon-48x48.png', size: 48 }, { name: 'apple-touch-icon.png', size: 180 }, { name: 'android-chrome-192x192.png', size: 192 }, { name: 'android-chrome-512x512.png', size: 512 } ]; 
      const img = new window.Image(); img.src = URL.createObjectURL(favFile); 
      await new Promise(r => { img.onload = r; }); 
      for (const item of sizes) { 
        const canvas = document.createElement('canvas'); canvas.width = item.size; canvas.height = item.size; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, item.size, item.size); 
        const b64 = canvas.toDataURL('image/png').split(',')[1]; zip.file(item.name, b64, { base64: true }); 
      } 
      zip.file('site.webmanifest', JSON.stringify({ name: "My Web App", short_name: "App", icons: [ { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" }, { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" } ], theme_color: "#ffffff", background_color: "#ffffff", display: "standalone" }, null, 2)); 
      const content = await zip.generateAsync({ type: 'blob' }); setFavZipUrl(trackUrl(URL.createObjectURL(content))); setFavGenerating(false); showToast('Bundle Created'); 
    } catch { showToast('Module error', 'error'); setFavGenerating(false); } 
  };
  
  const handleVideoLoad = (e) => { const file = e.target.files[0]; if (validateFile(file, 500)) { setVideoEditFile(file); setExportedVideoUrl(null); setVideoProgress(0); setVideoEditUrl(trackUrl(URL.createObjectURL(file))); const tempVid = document.createElement('video'); tempVid.src = URL.createObjectURL(file); tempVid.onloadedmetadata = () => { setVidDuration(tempVid.duration); setTrimStart(0); setTrimEnd(tempVid.duration); }; showToast('Video Loaded'); } }; 
  useEffect(() => { if (videoRef.current) { videoRef.current.playbackRate = vidSpeed; } }, [vidSpeed]); 
  const handleVideoExport = () => { if (!videoEditFile || !videoRef.current) return; setVideoProcessing(true); setVideoProgress(0); setExportedVideoUrl(null); const video = videoRef.current; video.currentTime = trimStart; video.playbackRate = vidSpeed; video.muted = true; const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); let sourceW = video.videoWidth; let sourceH = video.videoHeight; let sX = 0, sY = 0, sW = sourceW, sH = sourceH; if (vidAspect !== 'original') { let targetRatio = vidAspect === '16:9' ? 16/9 : (vidAspect === '9:16' ? 9/16 : 1); let vidRatio = sourceW / sourceH; if (vidRatio > targetRatio) { sW = sourceH * targetRatio; sX = (sourceW - sW) / 2; } else { sH = sourceW / targetRatio; sY = (sourceH - sH) / 2; } } let targetCanvasW = 1280; let targetCanvasH = 720; if (vidAspect === 'original') { targetCanvasW = sourceW; targetCanvasH = sourceH; } else if (vidAspect === '16:9') { targetCanvasW = 1280; targetCanvasH = 720; } else if (vidAspect === '9:16') { targetCanvasW = 720; targetCanvasH = 1280; } else if (vidAspect === '1:1') { targetCanvasW = 1080; targetCanvasH = 1080; } canvas.width = targetCanvasW; canvas.height = targetCanvasH; let combinedStream; const canvasStream = canvas.captureStream(30); try { const origStream = video.captureStream ? video.captureStream() : video.mozCaptureStream ? video.mozCaptureStream() : null; if (!vidMuted && origStream && origStream.getAudioTracks().length > 0) { combinedStream = new MediaStream([canvasStream.getVideoTracks()[0], origStream.getAudioTracks()[0]]); } else { combinedStream = canvasStream; } } catch { combinedStream = canvasStream; } let recorder; try { recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: 2500000 }); } catch { recorder = new MediaRecorder(combinedStream, { videoBitsPerSecond: 2500000 }); } const chunks = []; recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); }; recorder.onstop = () => { const blob = new Blob(chunks, { type: 'video/webm' }); setExportedVideoUrl(trackUrl(URL.createObjectURL(blob))); setExportedVideoSize(blob.size); setVideoProcessing(false); showToast('Export Complete!'); }; const drawFrame = () => { if (video.paused || video.ended || video.currentTime >= trimEnd) { recorder.stop(); video.pause(); return; } ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) invert(${invert}%)`; ctx.drawImage(video, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height); ctx.filter = 'none'; if (vidText) { ctx.fillStyle = vidTextColor; ctx.font = `bold ${vidTextSize}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let tx = canvas.width / 2; let ty = canvas.height / 2; if (vidTextPos === 'top') ty = 50 + vidTextSize; if (vidTextPos === 'bottom') ty = canvas.height - 50 - vidTextSize; ctx.fillText(vidText, tx, ty); } const totalDuration = trimEnd - trimStart; const currentProgress = video.currentTime - trimStart; setVideoProgress(Math.max(0, Math.min(100, Math.round((currentProgress / totalDuration) * 100)))); requestAnimationFrame(drawFrame); }; video.onplay = () => { recorder.start(); drawFrame(); }; video.play().catch(() => { setVideoProcessing(false); }); };
  const handleAudioLoad = async (e) => { const file = e.target.files[0]; if (validateFile(file, 100)) { setAudioEditFile(file); setExportedAudioUrl(null); setAudioBuffer(null); try { const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const arrayBuffer = await file.arrayBuffer(); const buffer = await audioCtx.decodeAudioData(arrayBuffer); setAudioBuffer(buffer); setAudioStart(0); setAudioEnd(buffer.duration); showToast('Audio Loaded'); } catch { showToast("Failed to decode audio", "error"); } } }; 
  const handleExportAudio = async () => { if (!audioBuffer) return; if (audioStart >= audioEnd) { showToast("Start before end time", "error"); return; } setProcessingAudio(true); try { const startOffset = audioStart; const endOffset = audioEnd; const duration = (endOffset - startOffset) / audioSpeed; const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, Math.max(1, duration * audioBuffer.sampleRate), audioBuffer.sampleRate); const sourceNode = offlineCtx.createBufferSource(); if (audioReverse) { const reversedBuffer = offlineCtx.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate); for (let i = 0; i < audioBuffer.numberOfChannels; i++) { const destData = reversedBuffer.getChannelData(i); const srcData = audioBuffer.getChannelData(i); for (let j = 0; j < audioBuffer.length; j++) { destData[j] = srcData[audioBuffer.length - 1 - j]; } } sourceNode.buffer = reversedBuffer; } else { sourceNode.buffer = audioBuffer; } sourceNode.playbackRate.value = audioSpeed; const gainNode = offlineCtx.createGain(); gainNode.gain.value = audioVolume / 100; if (audioFadeIn > 0) { gainNode.gain.setValueAtTime(0, 0); gainNode.gain.linearRampToValueAtTime(audioVolume / 100, audioFadeIn); } if (audioFadeOut > 0) { gainNode.gain.setValueAtTime(audioVolume / 100, Math.max(0, duration - audioFadeOut)); gainNode.gain.linearRampToValueAtTime(0, duration); } sourceNode.connect(gainNode); gainNode.connect(offlineCtx.destination); let actualStart = audioReverse ? (audioBuffer.duration - endOffset) : startOffset; sourceNode.start(0, actualStart, duration * audioSpeed); const renderedBuffer = await offlineCtx.startRendering(); const wavBlob = encodeWAV(renderedBuffer); setExportedAudioUrl(trackUrl(URL.createObjectURL(wavBlob))); showToast('WAV Exported'); } catch { showToast('Error processing', 'error'); } setProcessingAudio(false); };
  const handleResize = () => { if (!resizeSource) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = targetWidth; canvas.height = img.height * (targetWidth / img.width); canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height); setResizedDataUrl(trackUrl(canvas.toDataURL('image/jpeg', 0.9))); showToast('Resized'); }; img.src = URL.createObjectURL(resizeSource); };
  
  const generatePdf = async () => { 
    if (pdfImages.length === 0) return; 
    setGeneratingPdf(true); 
    try { 
      // 🚀 DYNAMIC IMPORT
      const { jsPDF } = await import('jspdf'); 
      const doc = new jsPDF(); 
      for (let i = 0; i < pdfImages.length; i++) { 
        const imgData = await new Promise((res) => { const reader = new FileReader(); reader.onload = (e) => res(e.target.result); reader.readAsDataURL(pdfImages[i]); }); 
        if (i > 0) doc.addPage(); 
        const imgProps = doc.getImageProperties(imgData); const pdfW = doc.internal.pageSize.getWidth(); doc.addImage(imgData, 'JPEG', 0, 0, pdfW, (imgProps.height * pdfW) / imgProps.width); 
      } 
      doc.save('Generated.pdf'); setGeneratingPdf(false); showToast('PDF Downloaded'); 
    } catch { showToast('Module error', 'error'); setGeneratingPdf(false); } 
  };
  
  const handleExtractAudio = async () => { if (!validateFile(extractVideo, 500)) return; setExtractingAudio(true); setExtractedAudioUrl(null); try { const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const arrayBuffer = await extractVideo.arrayBuffer(); const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer); const wavBlob = encodeWAV(decodedBuffer); setExtractedAudioUrl(trackUrl(URL.createObjectURL(wavBlob))); showToast('Extracted to WAV'); } catch { showToast('Extraction error', 'error'); } setExtractingAudio(false); };
  const startRecording = async () => { try { const stream = await navigator.mediaDevices.getDisplayMedia({ video: true }); mediaRecorderRef.current = new MediaRecorder(stream); mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]); }; mediaRecorderRef.current.start(); setIsRecording(true); stream.getVideoTracks()[0].onended = () => stopRecording(); } catch {} }; const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); }; const downloadVideo = () => { const blob = new Blob(recordedChunks, { type: 'video/webm' }); const url = trackUrl(URL.createObjectURL(blob)); const a = document.createElement('a'); a.href = url; a.download = 'screen-recording.webm'; a.click(); setRecordedChunks([]); showToast('Downloaded'); };
  
  const createGif = async () => { 
    if (!gifVideo) return; 
    setGifGenerating(true); 
    try { 
      // 🚀 DYNAMIC IMPORT
      const g = await import('gifshot'); const gifshot = g.default || g; 
      gifshot.createGIF({ 'video': [URL.createObjectURL(gifVideo)], 'numFrames': gifFrames, 'gifWidth': gifW }, function(obj) { 
        if (!obj.error) { setGifResult(trackUrl(obj.image)); showToast('GIF Generated'); } else { showToast('GIF Error', 'error'); } 
        setGifGenerating(false); 
      }); 
    } catch { showToast('Module error', 'error'); setGifGenerating(false); } 
  };
  
  const handlePaletteUpload = (e) => { const file = e.target.files[0]; if (!validateFile(file, 25)) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 100; canvas.height = 100; ctx.drawImage(img, 0, 0, 100, 100); const data = ctx.getImageData(0, 0, 100, 100).data; const sampled = []; for (let i = 0; i < data.length; i += 400) { const r = data[i].toString(16).padStart(2, '0'); const g = data[i+1].toString(16).padStart(2, '0'); const b = data[i+2].toString(16).padStart(2, '0'); sampled.push(`#${r}${g}${b}`); } const unique = [...new Set(sampled)].slice(0, 6); setPaletteColors(unique); showToast('Palette Extracted'); }; img.src = URL.createObjectURL(file); };
  const convertSvg = () => { const blob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' }); const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; canvas.getContext('2d').drawImage(img, 0, 0); setPngUrl(trackUrl(canvas.toDataURL('image/png'))); showToast('Converted'); }; img.src = URL.createObjectURL(blob); };
  const minifySvg = () => { const originalLength = svgMinInput.length; let minified = svgMinInput.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(); setSvgMinOutput(minified); const saved = Math.round(((originalLength - minified.length) / (originalLength || 1)) * 100); setSvgSavings(`Reduced from ${originalLength} bytes to ${minified.length} bytes (${Math.max(0, saved)}% reduction)`); showToast('SVG Minified'); };
  const handleColorChange = (e) => { const hex = e.target.value; setColorInput(hex); let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (r) setRgbOutput(`rgb(${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)})`); else setRgbOutput('Invalid HEX'); };
  const genDummy = () => { const canvas = document.createElement('canvas'); canvas.width = dummyW; canvas.height = dummyH; const ctx = canvas.getContext('2d'); ctx.fillStyle = dummyBg; ctx.fillRect(0, 0, dummyW, dummyH); ctx.fillStyle = dummyColor; ctx.font = `bold ${Math.max(20, Math.floor(dummyW/10))}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(dummyText || `${dummyW} x ${dummyH}`, dummyW/2, dummyH/2); setDummyImgUrl(trackUrl(canvas.toDataURL('image/png'))); showToast('Generated'); };
  const handleApiSend = async () => { setApiLoading(true); setApiResponse(''); setApiStatus(null); const start = performance.now(); try { let headers = {}; if (apiHeaders.trim()) { try { headers = JSON.parse(apiHeaders); } catch { throw new Error('Invalid JSON in Headers'); } } const opts = { method: apiMethod, headers }; if (['POST', 'PUT', 'PATCH'].includes(apiMethod) && apiBody.trim()) opts.body = apiBody; const res = await fetch(apiUrl, opts); const duration = Math.round(performance.now() - start); setApiTime(duration); setApiStatus(`${res.status} ${res.statusText}`); const text = await res.text(); try { setApiResponse(JSON.stringify(JSON.parse(text), null, 2)); } catch { setApiResponse(text); } showToast(`Status: ${res.status}`); } catch (e) { setApiStatus('Failed / CORS Blocked'); setApiResponse(`Error: ${e.message}\n\nNote: Browsers enforce CORS policies on client-side requests.`); showToast('Request Failed', 'error'); } setApiLoading(false); };
  const generateCodeImage = () => { const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const lines = codeSnippet.split('\n'); const padX = 40; const padY = 40; const lineHeight = 24; const fontSize = 15; canvas.width = 800; canvas.height = padY * 2 + 50 + lines.length * lineHeight; const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); grad.addColorStop(0, '#e94057'); grad.addColorStop(1, '#8a2387'); ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height); const cardX = padX; const cardY = padY; const cardW = canvas.width - padX * 2; const cardH = canvas.height - padY * 2; ctx.fillStyle = '#1e1e2e'; ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 12); ctx.fill(); ctx.fillStyle = '#ff5f56'; ctx.beginPath(); ctx.arc(cardX + 20, cardY + 22, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ffbd2e'; ctx.beginPath(); ctx.arc(cardX + 38, cardY + 22, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#27c93f'; ctx.beginPath(); ctx.arc(cardX + 56, cardY + 22, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#a6adc8'; ctx.font = '13px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(codeTitle || 'snippet', canvas.width / 2, cardY + 26); ctx.textAlign = 'left'; ctx.font = `${fontSize}px "Fira Code", monospace, "Courier New"`; lines.forEach((line, i) => { ctx.fillStyle = '#585b70'; ctx.fillText(String(i + 1).padStart(2, ' '), cardX + 20, cardY + 60 + i * lineHeight); ctx.fillStyle = '#cdd6f4'; ctx.fillText(line, cardX + 55, cardY + 60 + i * lineHeight); }); setCodeImgUrl(trackUrl(canvas.toDataURL('image/png'))); showToast('Image Rendered'); };
  
  const getLuminance = (hex) => { const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255); const a = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }; const lum1 = getLuminance(fgColor); const lum2 = getLuminance(bgColor); const contrastRatio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05); const contrastFormatted = contrastRatio.toFixed(2);
  const handleDataUriUpload = (e) => { const file = e.target.files[0]; if (!validateFile(file, 5)) return; const reader = new FileReader(); reader.onload = (ev) => { setDataUriOut(ev.target.result); showToast('Generated'); }; reader.readAsDataURL(file); };
  
  const handleExcelUpload = async (e) => { 
    const file = e.target.files[0]; if (!validateFile(file, 25)) return; 
    setExcelFile(file); 
    try { 
      // 🚀 DYNAMIC IMPORT
      const XLSX = await import('xlsx'); 
      const reader = new FileReader(); 
      reader.onload = (ev) => { 
        try { 
          const data = new Uint8Array(ev.target.result); const workbook = XLSX.read(data, { type: 'array' }); 
          const firstSheet = workbook.SheetNames[0]; const worksheet = workbook.Sheets[firstSheet]; 
          const json = XLSX.utils.sheet_to_json(worksheet); 
          setExcelJsonOut(JSON.stringify(json, null, 2)); setExcelRowCount(json.length); showToast(`Parsed ${json.length} rows`); 
        } catch { showToast('Parse Failed', 'error'); } 
      }; 
      reader.readAsArrayBuffer(file); 
    } catch { showToast('Library load failed', 'error'); } 
  };
  
  const convertJsonToTs = () => { try { const obj = JSON.parse(jsonToTsInput); let ts = 'export interface GeneratedInterface {\n'; for (let k in obj) ts += `  ${k}: ${Array.isArray(obj[k]) ? 'any[]' : typeof obj[k]};\n`; setTsOutput(ts + '}'); showToast('Converted'); } catch { setTsOutput('Error'); showToast('Invalid JSON', 'error'); } };
  const formatJson = () => { try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); showToast('Formatted'); } catch { setJsonOutput('Error'); showToast('Invalid JSON', 'error'); } };
  const runJ2c = () => { try { if (j2cMode === 'json2csv') { const obj = JSON.parse(j2cInput); const array = Array.isArray(obj) ? obj : [obj]; if (array.length === 0) return setJ2cOutput(''); const keys = Object.keys(array[0]); const csv = [keys.join(','), ...array.map(item => keys.map(k => `"${(item[k]||'').toString().replace(/"/g, '""')}"`).join(','))].join('\n'); setJ2cOutput(csv); } else { const lines = j2cInput.split('\n').filter(l => l.trim()); const headers = lines[0].split(',').map(h => h.replace(/(^"|"$)/g, '').trim()); const result = lines.slice(1).map(line => { const values = line.split(','); const obj = {}; headers.forEach((h, i) => { obj[h] = values[i] ? values[i].replace(/(^"|"$)/g, '') : ''; }); return obj; }); setJ2cOutput(JSON.stringify(result, null, 2)); } showToast('Success'); } catch { showToast('Error', 'error'); } };
  const formatSql = () => { try { const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LIMIT']; let formatted = sqlInput.trim(); keywords.forEach(kw => { const regex = new RegExp(`\\b${kw}\\b`, 'gi'); formatted = formatted.replace(regex, `\n${kw}`); }); setSqlOutput(formatted.trim()); showToast('Formatted'); } catch { showToast('Error', 'error'); } };
  const formatSnippet = () => { let indent = 0; let result = ''; const lines = messyCode.replace(/{/g, '{\n').replace(/}/g, '\n}\n').replace(/;/g, ';\n').split('\n'); lines.forEach(line => { let trimmed = line.trim(); if (!trimmed) return; if (trimmed.includes('}')) indent = Math.max(0, indent - 1); result += '  '.repeat(indent) + trimmed + '\n'; if (trimmed.includes('{')) indent++; }); setCleanCode(result); };
  
  const runDiff = async () => { 
    try { 
      // 🚀 DYNAMIC IMPORT
      const { diffLines } = await import('diff'); 
      setDiffResult(diffLines(diffA, diffB)); showToast('Compared'); 
    } catch { showToast('Error loading module', 'error'); } 
  };
  
  const handleUrlTransform = () => { try { if (urlMode === 'encode') setUrlOutput(encodeURIComponent(urlInput)); else setUrlOutput(decodeURIComponent(urlInput)); } catch { showToast('Error', 'error'); } };
  const generateUuids = () => { const count = Math.min(Math.max(1, Number(uuidCount) || 10), 1000); const list = Array.from({ length: count }, () => crypto.randomUUID()); setUuidOutput(list.join('\n')); };
  const extractMongoDate = () => { if (mongoId.length === 24) setMongoResult(new Date(parseInt(mongoId.substring(0, 8), 16) * 1000).toLocaleString()); else { showToast('Invalid ID', 'error'); } };
  const decodeJwt = () => { try { setJwtData(JSON.stringify(JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2)); } catch { showToast('Invalid JWT', 'error'); } };
  const hexToRgba = (hex, opacity) => { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgba(${r}, ${g}, ${b}, ${opacity})`; }; 
  const boxShadowCSS = `box-shadow: ${boxH}px ${boxV}px ${boxBlur}px ${boxSpread}px ${hexToRgba(boxColor, boxOpacity)};`;
  const glassCss = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.3);`;
  
  const translateCron = async () => { 
    try { 
      // 🚀 DYNAMIC IMPORT
      const ct = await import('cronstrue'); const cronstrue = ct.default || ct; 
      setCronResult(cronstrue.toString(cronInput)); 
    } catch { showToast('Invalid Cron', 'error'); } 
  };
  
  const testRegex = () => { try { const re = new RegExp(regexPattern, 'g'); const matches = regexText.match(re); setRegexResult(matches ? matches.join(', ') : 'No matches found.'); } catch { showToast('Invalid Regex', 'error'); } };
  const handleKeyDown = (e) => { e.preventDefault(); setKeyData({ key: e.key === ' ' ? 'Space' : e.key, code: e.code, keyCode: e.keyCode }); };
  
  useEffect(() => { 
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); 
    window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); 
  }, []);
  
  const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length;
  const cleanSpaces = () => setSpellText(spellText.replace(/\s+/g, ' ').trim());
  const generatedLorem = Array(Number(paragraphs)).fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.").join('\n\n');
  
  useEffect(() => { 
    // 🚀 DYNAMIC IMPORT ONLY WHEN MARKDOWN IS ACTIVE
    if (activeTab === 'md') { 
      Promise.all([import('marked'), import('dompurify')]).then(([{ marked }, dompurify]) => { 
        const DOMPurify = dompurify.default || dompurify; 
        setMdOutput(DOMPurify.sanitize(marked.parse(mdInput))); 
      }); 
    } 
  }, [mdInput, activeTab]);

  const gross = hours * rate; const net = gross - (gross * (tax / 100)); 
  const generateInvoice = async () => { 
    try { 
      // 🚀 DYNAMIC IMPORT
      const { jsPDF } = await import('jspdf'); const doc = new jsPDF(); 
      doc.setFontSize(22); doc.text('INVOICE', 20, 20); doc.setFontSize(12); doc.text(`Client: ${client}`, 20, 40); doc.text(`Total Hours: ${hours}`, 20, 50); doc.text(`Hourly Rate: $${rate}`, 20, 60); doc.text(`Gross Total: $${gross}`, 20, 70); doc.text(`Net (After ${tax}% Tax): $${net}`, 20, 80); doc.save(`Invoice-${client || 'Client'}.pdf`); showToast('Invoice Created'); 
    } catch { showToast('Module error', 'error'); } 
  };
  
  const generateMockData = () => { const firstNames = ['Alex', 'Sam', 'Jordan']; const lastNames = ['Smith', 'Johnson', 'Williams']; const count = Math.min(Math.max(1, Number(dummyCount) || 5), 50); const rows = Array.from({ length: count }, (_, i) => { const fn = firstNames[Math.floor(Math.random() * firstNames.length)]; const ln = lastNames[Math.floor(Math.random() * lastNames.length)]; return { id: i + 1, fullName: `${fn} ${ln}`, email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com` }; }); if (dummyFormat === 'json') { setDummyOutput(JSON.stringify(rows, null, 2)); } else { const csvHeaders = 'id,fullName,email\n'; const csvRows = rows.map(r => `${r.id},"${r.fullName}","${r.email}"`).join('\n'); setDummyOutput(csvHeaders + csvRows); } showToast('Generated'); };
  const seoTags = `<title>${seoTitle}</title>\n<meta name="description" content="${seoDesc}">\n<meta property="og:title" content="${seoTitle}">\n<meta property="og:description" content="${seoDesc}">\n<meta property="og:image" content="${seoImg}">\n<meta name="twitter:card" content="summary_large_image">`;
  const utmResult = `${utmUrl}?utm_source=${encodeURIComponent(utmSrc)}&utm_medium=${encodeURIComponent(utmMed)}&utm_campaign=${encodeURIComponent(utmCamp)}`;
  
  const compressDocs = async () => { 
    if (zipFiles.length === 0) return; 
    setZipping(true); 
    try { 
      // 🚀 DYNAMIC IMPORT
      const j = await import('jszip'); const JSZip = j.default || j; const zip = new JSZip(); 
      zipFiles.forEach(file => { const safeName = file.name.replace(/^.*[\\\/]/, '').replace(/[^a-zA-Z0-9.\-_]/g, '_'); zip.file(safeName || 'unnamed_file', file); }); 
      const content = await zip.generateAsync({ type: 'blob' }); setZipUrl(trackUrl(URL.createObjectURL(content))); setZipping(false); showToast('ZIP Created'); 
    } catch { showToast('Module error', 'error'); setZipping(false); } 
  };
  
  const startMemo = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); setMemoStream(stream); memoRecorderRef.current = new MediaRecorder(stream); memoChunks.current = []; memoRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) memoChunks.current.push(e.data); }; memoRecorderRef.current.onstop = () => { const blob = new Blob(memoChunks.current, { type: 'audio/webm' }); setMemoUrl(trackUrl(URL.createObjectURL(blob))); showToast('Voice Memo Saved'); }; memoRecorderRef.current.start(); setIsRecordingMemo(true); } catch { showToast('Mic denied', 'error'); } }; const stopMemo = () => { if (memoRecorderRef.current) { memoRecorderRef.current.stop(); if (memoStream) { memoStream.getTracks().forEach(track => track.stop()); } } setIsRecordingMemo(false); };
  
  useEffect(() => { let interval = null; if (timerOn) interval = setInterval(() => setTime(prev => prev + 10), 10); else clearInterval(interval); return () => clearInterval(interval); }, [timerOn]); 
  const formatTime = (t) => { const ms = ("0" + ((t / 10) % 100)).slice(-2); const s = ("0" + Math.floor((t / 1000) % 60)).slice(-2); const m = ("0" + Math.floor((t / 60000) % 60)).slice(-2); return `${m}:${s}.${ms}`; };
  useEffect(() => { let int = null; if (pomoActive && pomoTime > 0) int = setInterval(() => setPomoTime(p => p - 1), 1000); else clearInterval(int); return () => clearInterval(int); }, [pomoActive, pomoTime]); 
  const formatPomo = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="container">
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>

      <header className="header">
        <div className="header-content">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="site-logo-container">
            <h1 className="site-logo">⚡ I Love Tools</h1>
          </a>

          <nav className="header-nav">
            {Object.keys(categories).map(category => (
              <div key={category} className="header-nav-item" onMouseEnter={() => handleMouseEnter(category)} onMouseLeave={handleMouseLeave}>
                <button className="nav-category-btn" onClick={() => handleMobileClick(category)}>
                  {category} <ChevronDown size={16} className={`chevron ${activeDropdown === category ? 'open' : ''}`} />
                </button>
                <div className={`header-dropdown ${activeDropdown === category ? 'show' : ''}`}>
                  {categories[category].map(tool => (
                    <a key={tool.id} href={`/tool/${tool.id}`} className={activeTab === tool.id ? 'active nav-link' : 'nav-link'} onClick={(e) => { e.preventDefault(); navigate(`/tool/${tool.id}`); }}>
                      <tool.icon size={16} /> {tool.name}
                    </a>
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
          
          {activeTab === 'home' && (
            <div className="home-dashboard">
              
              <div className="hero-wrapper">
                <div className="hero-blob blob-1"></div>
                <div className="hero-blob blob-2"></div>
                <div className="hero-blob blob-3"></div>
                
                <div className="hero-badge animate-fade-up">✦ 62+ Free Client-Side Tools</div>
                <h2 className="hero-title animate-fade-up delay-1">Your Everyday <span className="text-gradient">Tools</span>,<br/>All in One Place.</h2>
                <p className="hero-desc animate-fade-up delay-2">Convert, compress, generate, format, and securely transform files and data directly in your browser. No data ever leaves your device.</p>
                
                <div className="search-container-large animate-fade-up delay-3">
                  <Search className="search-icon-large" size={24} />
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Search tools... (e.g. JSON, Compress, PGP)" 
                    className="search-bar-large" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                  <div className="search-shortcut">⌘ K</div>
                </div>
              </div>

              {!searchQuery && (
                <div className="category-filters animate-fade-up delay-3">
                  <button className={`cat-chip ${selectedCategory === 'All' ? 'active' : ''}`} onClick={() => setSelectedCategory('All')}>All Tools</button>
                  {Object.keys(categories).map(cat => (
                    <button key={cat} className={`cat-chip ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
                  ))}
                </div>
              )}

              {!searchQuery && selectedCategory === 'All' && (
                <>
                  <div className="section-heading animate-fade-up"><Sparkles size={28} color="var(--primary)" /> New & Popular</div>
                  <div className="responsive-grid">
                    {[...popularToolIds].map((id, idx) => { 
                      const t = flatTools.find(tool => tool.id === id); 
                      return t ? <ToolCard key={t.id} tool={t} navigate={navigate} /> : null; 
                    })}
                  </div>
                  
                  <div className="more-tools-banner animate-fade-up delay-3">
                    <h3>✨ Enhance Your Workflow</h3>
                    <p>Explore our massive collection of privacy-first utilities below.</p>
                  </div>
                </>
              )}

              <div className="section-heading animate-fade-up">
                <Layers size={28} color="var(--primary)" /> 
                {searchQuery ? 'Search Results' : (selectedCategory === 'All' ? 'Browse All Categories' : selectedCategory)}
              </div>
              
              {Object.keys(filteredCategories).length === 0 ? (
                <div style={{textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontSize: '1.2rem'}}>✦ No tools found for "{searchQuery}". Try another keyword.</div>
              ) : (
                Object.keys(filteredCategories).filter(cat => selectedCategory === 'All' || cat === selectedCategory).map(cat => (
                  <div key={cat} style={{marginBottom: '50px'}}>
                    <h3 style={{marginBottom: '20px', color: 'var(--text-main)', fontSize: '1.4rem'}}>{cat}</h3>
                    <div className="responsive-grid">
                      {filteredCategories[cat].map((tool, idx) => <ToolCard key={tool.id} tool={tool} navigate={navigate} />)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab !== 'home' && currentTool && (
            <div className="tool-workspace">
              <ToolHeader tool={currentTool} navigate={navigate} />

              {/* SECURITY & PRIVACY */}
              {activeTab === 'aes-encrypt' && ( <div> <div className="btn-group"> <button className={`btn ${aesMode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setAesMode('encrypt'); setAesResult(''); setAesError(''); }}>Encrypt</button> <button className={`btn ${aesMode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setAesMode('decrypt'); setAesResult(''); setAesError(''); }}>Decrypt</button> </div> <div className="form-group"><label>{aesMode === 'encrypt' ? 'Message' : 'Ciphertext'}</label><textarea rows="4" className="form-control" value={aesText} onChange={(e) => setAesText(e.target.value)} /></div> <div className="form-group"><label>Passphrase</label><input type="password" placeholder="Enter secure passphrase..." className="form-control" value={aesPass} onChange={(e) => setAesPass(e.target.value)} /></div> <button onClick={handleAesProcess} className="btn btn-primary form-group"><ShieldCheck size={18}/> Process Locally</button> {aesResult && <div className="form-group"><label>Result</label><textarea rows="4" readOnly className="form-control readonly-area" value={aesResult} /></div>} </div> )}
              {activeTab === 'rsa-gen' && ( <div> <button onClick={generateRSA} className="btn btn-primary form-group"><KeyRound size={18}/> Generate Secure Keys</button> {rsaPublic && ( <div className="responsive-grid"> <div className="form-group"><label>Public Key</label><textarea rows="6" readOnly className="form-control readonly-area" value={rsaPublic} /></div> <div className="form-group"><label>Private Key</label><textarea rows="6" readOnly className="form-control readonly-area" value={rsaPrivate} /></div> </div> )} </div> )}
              {activeTab === 'pgp-tool' && ( <div> <div className="btn-group"> <button className={`btn ${pgpMode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setPgpMode('encrypt'); setPgpOutput(''); }}>Encrypt</button> <button className={`btn ${pgpMode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setPgpMode('decrypt'); setPgpOutput(''); }}>Decrypt</button> </div> <div className="form-group"><label>{pgpMode === 'encrypt' ? 'Message to Encrypt' : 'Armored PGP Message'}</label><textarea rows="4" className="form-control" value={pgpMsg} onChange={(e) => setPgpMsg(e.target.value)} /></div> <div className="form-group"><label>Passphrase</label><input type="password" placeholder="Passphrase" className="form-control" value={pgpPass} onChange={(e) => setPgpPass(e.target.value)} /></div> <button onClick={handlePgpProcess} disabled={pgpProcessing} className="btn btn-primary form-group"><Lock size={18}/> {pgpProcessing ? 'Processing...' : (pgpMode === 'encrypt' ? 'Encrypt PGP Message' : 'Decrypt PGP Message')}</button> {pgpOutput && <div className="form-group"><label>Output</label><textarea rows="8" readOnly className="form-control readonly-area" value={pgpOutput} /></div>} </div> )}
              {activeTab === 'steganography' && ( <div> <div className="btn-group"> <button className={`btn ${stegMode === 'encode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStegMode('encode')}>Encode Secret</button> <button className={`btn ${stegMode === 'decode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setStegMode('decode')}>Decode Secret</button> </div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={(e) => setStegFile(e.target.files[0])} className="file-input" /></div> {stegMode === 'encode' && ( <div className="form-group"><label>Secret Message to Embed</label><textarea rows="3" className="form-control" value={stegSecret} onChange={(e) => setStegSecret(e.target.value)} /></div> )} <button onClick={handleStegProcess} disabled={!stegFile} className="btn btn-primary form-group">{stegMode === 'encode' ? 'Embed Message' : 'Extract Hidden Message'}</button> {stegResultUrl && stegMode === 'encode' && ( <div className="results-grid"> <div><h4>Status</h4><p>Secret Embedded</p></div> <div><h4>Protected File</h4><p>PNG Format</p><a href={stegResultUrl} download="steg-image.png" className="btn btn-primary" style={{marginTop:'10px'}}><Download size={16}/> Download Encoded Image</a></div> </div> )} {stegDecoded && stegMode === 'decode' && ( <div className="form-group" style={{marginTop:'20px'}}><label>Decoded Hidden Message</label><textarea rows="4" readOnly className="form-control readonly-area" value={stegDecoded} /></div> )} </div> )}
              {activeTab === 'file-hash' && ( <div> <div className="file-input-wrapper"><input type="file" onChange={(e) => { setHashFile(e.target.files[0]); setFileHashResult(''); }} className="file-input" /></div> <div className="responsive-grid form-group"> <div> <label>Algorithm</label> <select className="form-control" value={hashAlgo} onChange={(e) => setHashAlgo(e.target.value)}> <option value="SHA-256">SHA-256</option> <option value="SHA-1">SHA-1</option> <option value="SHA-512">SHA-512</option> </select> </div> </div> <button onClick={handleComputeFileHash} disabled={!hashFile || hashingFile} className="btn btn-primary form-group"><FileCheck size={18}/> {hashingFile ? 'Calculating...' : 'Compute Hash'}</button> {fileHashResult && ( <> <div className="form-group"><label>Checksum ({hashAlgo})</label><textarea rows="2" readOnly className="form-control readonly-area" value={fileHashResult} /></div> <div className="form-group"><label>Verify Against Expected Hash</label><input type="text" className="form-control" placeholder="Paste expected hash..." value={hashCompare} onChange={(e) => setHashCompare(e.target.value)} /></div> {hashCompare.trim() && ( <div style={{padding:'12px', borderRadius:'8px', fontWeight:'bold', background: hashCompare.trim().toLowerCase() === fileHashResult.toLowerCase() ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: hashCompare.trim().toLowerCase() === fileHashResult.toLowerCase() ? 'var(--success)' : 'var(--error)'}}> {hashCompare.trim().toLowerCase() === fileHashResult.toLowerCase() ? '✓ Checksums Match Exactly' : '✕ Checksum Mismatch'} </div> )} </> )} </div> )}
              {activeTab === 'hash' && ( <div> <div className="form-group"><label>Text to Hash</label><textarea rows="4" className="form-control" value={hashData} onChange={(e) => setHashData(e.target.value)} /></div> <button onClick={generateHash} className="btn btn-primary form-group"><Hash size={18}/> Generate Hash</button> {hashResult && <div className="form-control readonly-area"><code>{hashResult}</code></div>} </div> )}
              {activeTab === 'bcrypt' && ( <div> <div className="form-group"><label>String to Hash</label><input type="text" className="form-control" placeholder="Enter string..." value={bcryptPassInput} onChange={(e) => setBcryptPassInput(e.target.value)} /></div> <button onClick={generateBcrypt} className="btn btn-primary form-group"><Fingerprint size={18}/> Hash Password</button> {bcryptHashOut && <div className="form-group"><label>Result</label><textarea rows="3" readOnly className="form-control readonly-area" value={bcryptHashOut} /></div>} </div> )}
              {activeTab === 'base64' && ( <div> <div className="btn-group form-group"> <button className={`btn ${baseMode === 'encode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => {setBaseMode('encode'); setBaseInput('');}}>Encode</button> <button className={`btn ${baseMode === 'decode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => {setBaseMode('decode'); setBaseInput('');}}>Decode</button> </div> <div className="form-group"><label>Input Text</label><textarea rows="4" className="form-control" placeholder="Input text..." value={baseInput} onChange={(e) => setBaseInput(e.target.value)} /></div> <div className="form-group"><label>Result</label><textarea rows="4" readOnly className="form-control readonly-area" value={getBase64Result()} /></div> </div> )}
              {activeTab === 'password' && ( <div> <div className="form-group"> <label>Length: {length}</label> <input type="range" min="8" max="128" value={length} onChange={(e) => setLength(e.target.value)} /> </div> <button onClick={generatePassword} className="btn btn-primary form-group"><RefreshCw size={18} /> Generate Password</button> {password && <div className="form-control readonly-area"><code>{password}</code></div>} </div> )}
              {activeTab === 'exif-strip' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={handleExifUpload} className="file-input" /></div> {strippedImgUrl && ( <div className="results-grid"> <div><h4>Status</h4><p style={{color:'var(--success)'}}>Metadata stripped</p></div> <div><h4>Safe Image</h4><p>Ready to share</p><a href={strippedImgUrl} download="clean-image.jpg" className="btn btn-primary" style={{marginTop: '10px'}}><Download size={16} /> Download</a></div> </div> )} </div> )}

              {activeTab === 'image' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" /></div> {originalImage && <p style={{ fontSize: '0.9rem', margin: '10px 0', color: 'var(--text-muted)' }}>Original Size: {(originalImage.size / 1024 / 1024).toFixed(2)} MB</p>} <div style={{ display: 'flex', gap: '10px' }} className="form-group"> <input type="number" className="form-control" placeholder="Target size (e.g. 500)" value={targetSize} onChange={(e) => setTargetSize(e.target.value)} /> <select className="form-control" style={{ width: '100px' }} value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)}><option value="KB">KB</option><option value="MB">MB</option></select> </div> <button onClick={handleCompressImage} disabled={compressing || !originalImage} className="btn btn-primary form-group"><Image size={18}/> {compressing ? 'Compressing...' : 'Compress Image'}</button> {compressedImgUrl && ( <div className="results-grid"> <div><h4>Original</h4><p>{(originalImage.size / 1024 / 1024).toFixed(2)} MB</p></div> <div><h4>Compressed</h4><p style={{color:'var(--success)'}}>{(compressedImage.size / 1024 / 1024).toFixed(2)} MB</p><a href={compressedImgUrl} download={`compressed-${originalImage.name}`} className="btn btn-primary" style={{marginTop: '10px'}}><Download size={16} /> Download</a></div> </div> )} </div> )}
              {activeTab === 'img-converter' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={(e) => { setConvFile(e.target.files[0]); setConvUrl(''); }} className="file-input" /></div> <div className="responsive-grid form-group"> <div> <label>Target Format</label> <select className="form-control" value={convFormat} onChange={(e) => setConvFormat(e.target.value)}> <option value="image/webp">WebP (Modern & Compact)</option> <option value="image/png">PNG (Lossless)</option> <option value="image/jpeg">JPEG (Standard)</option> </select> </div> {convFormat !== 'image/png' && ( <div> <label>Quality ({Math.round(convQuality * 100)}%)</label> <input type="range" min="0.1" max="1.0" step="0.05" value={convQuality} onChange={(e) => setConvQuality(Number(e.target.value))} /> </div> )} </div> <button onClick={handleConvertImage} disabled={!convFile} className="btn btn-primary form-group"><RefreshCw size={18}/> Convert Format</button> {convUrl && ( <div className="results-grid"> <div><h4>Original Size</h4><p>{(convFile.size / 1024).toFixed(1)} KB</p></div> <div><h4>New Size</h4><p style={{color:'var(--success)'}}>{(convSize / 1024).toFixed(1)} KB</p><a href={convUrl} download={`converted.${convFormat.split('/')[1]}`} className="btn btn-primary" style={{marginTop:'10px'}}><Download size={16}/> Download Image</a></div> </div> )} </div> )}
              {activeTab === 'favicon-gen' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={(e) => { setFavFile(e.target.files[0]); setFavZipUrl(null); }} className="file-input" /></div> <button onClick={generateFavicons} disabled={!favFile || favGenerating} className="btn btn-primary form-group"><FileArchive size={18}/> {favGenerating ? 'Generating Assets...' : 'Generate Favicon Bundle (.zip)'}</button> {favZipUrl && ( <div className="results-grid"> <div><h4>Status</h4><p style={{color:'var(--success)'}}>Package Ready</p></div> <div><h4>Includes</h4><p>16px, 32px, 180px, 512px + Manifest</p><a href={favZipUrl} download="favicons.zip" className="btn btn-primary" style={{marginTop:'10px'}}><Download size={16}/> Download ZIP</a></div> </div> )} </div> )}
              {activeTab === 'videditor' && ( <div> <div className="file-input-wrapper"><input type="file" accept="video/*" onChange={handleVideoLoad} className="file-input" /></div> {videoEditUrl && ( <> <video ref={videoRef} src={videoEditUrl} controls style={{ width: '100%', maxHeight: '400px', backgroundColor: '#000', borderRadius: '16px', marginBottom: '20px', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) invert(${invert}%)`}} /> <div className="responsive-grid" style={{ marginBottom: '20px' }}> <div className="form-group"> <label><Scissors size={14}/> Trimming & Speed</label> <span style={{fontSize:'0.85rem'}}>Start Time: {trimStart}s</span><input type="range" min="0" max={vidDuration} step="0.1" value={trimStart} onChange={(e) => setTrimStart(Number(e.target.value))} /> <span style={{fontSize:'0.85rem'}}>End Time: {trimEnd}s</span><input type="range" min="0" max={vidDuration} step="0.1" value={trimEnd} onChange={(e) => setTrimEnd(Number(e.target.value))} /> <span style={{fontSize:'0.85rem'}}>Playback Speed ({vidSpeed}x)</span><input type="range" min="0.5" max="2" step="0.25" value={vidSpeed} onChange={(e) => setVidSpeed(Number(e.target.value))} /> </div> <div className="form-group"> <label><Crop size={14}/> Canvas & Audio</label> <select className="form-control" value={vidAspect} onChange={(e) => setVidAspect(e.target.value)}><option value="original">Original Aspect</option><option value="16:9">16:9 Widescreen</option><option value="9:16">9:16 Vertical</option><option value="1:1">1:1 Square</option></select> <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer', fontWeight:'600' }}><input type="checkbox" checked={vidMuted} onChange={(e) => setVidMuted(e.target.checked)} style={{ width: '20px', height: '20px', accentColor:'var(--primary)' }} />Mute Audio</label> </div> <div className="form-group"> <label><Wand2 size={14}/> Color Filters</label> <span style={{fontSize:'0.85rem'}}>Brightness ({brightness}%)</span><input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} /> <span style={{fontSize:'0.85rem'}}>Contrast ({contrast}%)</span><input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} /> <span style={{fontSize:'0.85rem'}}>Saturation ({saturation}%)</span><input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} /> </div> </div> <button onClick={handleVideoExport} disabled={videoProcessing} className="btn btn-primary" style={{ width: '100%' }}><Film size={18}/> {videoProcessing ? `Exporting... ${videoProgress}%` : 'Export Edited Video'}</button> </> )} {exportedVideoUrl && ( <div className="results-grid"> <div><h4>Original Size</h4><p>{(videoEditFile.size / 1024 / 1024).toFixed(2)} MB</p></div> <div><h4>Exported Size</h4><p style={{color:'var(--success)'}}>{(exportedVideoSize / 1024 / 1024).toFixed(2)} MB</p><a href={exportedVideoUrl} download={`edited-${videoEditFile.name.split('.')[0]}.webm`} className="btn btn-primary" style={{marginTop:'10px'}}><Download size={16} /> Download Video</a></div> </div> )} </div> )}
              {activeTab === 'audioedit' && ( <div> <div className="file-input-wrapper"><input type="file" accept="audio/*, video/*" onChange={handleAudioLoad} className="file-input" /></div> {audioBuffer && ( <> <div className="responsive-grid" style={{ marginBottom: '20px' }}> <div className="form-group"> <label><Scissors size={14}/> Trimming</label> <span style={{fontSize:'0.85rem'}}>Start Time: {audioStart.toFixed(1)}s</span><input type="range" min="0" max={audioBuffer.duration} step="0.1" value={audioStart} onChange={(e) => setAudioStart(Number(e.target.value))} /> <span style={{fontSize:'0.85rem'}}>End Time: {audioEnd.toFixed(1)}s</span><input type="range" min="0" max={audioBuffer.duration} step="0.1" value={audioEnd} onChange={(e) => setAudioEnd(Number(e.target.value))} /> </div> <div className="form-group"> <label><Volume2 size={14}/> Effects</label> <span style={{fontSize:'0.85rem'}}>Volume ({audioVolume}%)</span><input type="range" min="0" max="200" value={audioVolume} onChange={(e) => setAudioVolume(Number(e.target.value))} /> <span style={{fontSize:'0.85rem'}}>Speed ({audioSpeed}x)</span><input type="range" min="0.5" max="2" step="0.25" value={audioSpeed} onChange={(e) => setAudioSpeed(Number(e.target.value))} /> <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer', fontWeight:'600' }}><input type="checkbox" checked={audioReverse} onChange={(e) => setAudioReverse(e.target.checked)} style={{ width: '20px', height: '20px', accentColor:'var(--primary)' }} />Reverse Audio</label> </div> </div> <button onClick={handleExportAudio} disabled={processingAudio} className="btn btn-primary" style={{ width: '100%' }}><Mic size={18}/> {processingAudio ? `Processing...` : 'Export Audio (WAV)'}</button> </> )} {exportedAudioUrl && ( <div className="results-grid"> <div><h4>Status</h4><p style={{color:'var(--success)'}}>Export Ready</p></div> <div><h4>Format</h4><p>WAV Format</p><a href={exportedAudioUrl} download={`edited-${audioEditFile.name.split('.')[0]}.wav`} className="btn btn-primary" style={{marginTop:'10px'}}><Download size={16} /> Download Audio</a></div> </div> )} </div> )}
              {activeTab === 'resize' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={(e) => { setResizeSource(e.target.files[0]); setResizedDataUrl(null); }} className="file-input" /></div> <div className="form-group"> <label>Target Width: {targetWidth}px</label> <input type="range" min="100" max="3000" value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)} /> </div> <button onClick={handleResize} disabled={!resizeSource} className="btn btn-primary form-group"><Maximize size={18}/> Resize Image</button> {resizedDataUrl && <div><a href={resizedDataUrl} download="resized.jpg" className="btn btn-secondary"><Download size={16}/> Download Resized JPG</a></div>} </div> )}
              {activeTab === 'pdfgen' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" multiple onChange={(e) => setPdfImages(Array.from(e.target.files))} className="file-input" /></div> <button onClick={generatePdf} disabled={pdfImages.length === 0 || generatingPdf} className="btn btn-primary"><FileUp size={18}/> {generatingPdf ? 'Generating...' : 'Download PDF Document'}</button> </div> )}
              {activeTab === 'audio' && ( <div> <div className="file-input-wrapper"><input type="file" accept="video/*" onChange={(e) => { setExtractVideo(e.target.files[0]); setExtractedAudioUrl(null); }} className="file-input" /></div> <button onClick={handleExtractAudio} disabled={extractingAudio || !extractVideo} className="btn btn-primary form-group"><Music size={18}/> {extractingAudio ? `Extracting...` : 'Extract Audio to WAV'}</button> {extractedAudioUrl && ( <div className="results-grid"> <div><h4>Original File</h4><p>{extractVideo.name}</p></div> <div><h4>Extracted</h4><p style={{color:'var(--success)'}}>WAV Format</p><a href={extractedAudioUrl} download={`extracted-${extractVideo.name.split('.')[0]}.wav`} className="btn btn-primary" style={{marginTop:'10px'}}><Download size={16} /> Download Audio</a></div> </div> )} </div> )}
              {activeTab === 'screen' && ( <div> <div className="btn-group"> {!isRecording ? <button onClick={startRecording} className="btn btn-primary"><Video size={18}/> Start Recording</button> : <button onClick={stopRecording} className="btn btn-danger"><Square size={18}/> Stop Recording</button>} {recordedChunks.length > 0 && !isRecording && <button onClick={downloadVideo} className="btn btn-secondary"><Download size={18}/> Download Video</button>} </div> </div> )}
              {activeTab === 'vid2gif' && ( <div> <div className="file-input-wrapper"><input type="file" accept="video/*" onChange={(e) => { setGifVideo(e.target.files[0]); }} className="file-input" /></div> <div className="responsive-grid form-group"> <div><label>GIF Width ({gifW}px)</label><input type="range" min="100" max="800" step="10" value={gifW} onChange={(e) => setGifW(Number(e.target.value))} /></div> <div><label>Max Frames ({gifFrames})</label><input type="range" min="10" max="60" value={gifFrames} onChange={(e) => setGifFrames(Number(e.target.value))} /></div> </div> <button onClick={createGif} disabled={gifGenerating || !gifVideo} className="btn btn-primary form-group"><Clapperboard size={18}/> {gifGenerating ? 'Generating GIF...' : 'Create GIF'}</button> {gifResult && ( <div style={{ marginTop: '20px', textAlign: 'center' }}> <img src={gifResult} alt="Generated GIF" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '15px' }} /> <br/><a href={gifResult} download="animated.gif" className="btn btn-secondary"><Download size={16}/> Download GIF</a> </div> )} </div> )}
              {activeTab === 'palette-extract' && ( <div> <div className="file-input-wrapper"><input type="file" accept="image/*" onChange={handlePaletteUpload} className="file-input" /></div> {paletteColors.length > 0 && ( <div> <h4 style={{ marginBottom: '10px' }}>Extracted Palette:</h4> <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}> {paletteColors.map((hex, idx) => ( <div key={idx} style={{ textAlign: 'center', flex: 1, minWidth: '80px' }}> <div style={{ height: '70px', borderRadius: '12px', backgroundColor: hex, marginBottom: '8px', border: '1px solid var(--border)', boxShadow:'var(--shadow-sm)' }}></div> <code style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{hex}</code> </div> ))} </div> </div> )} </div> )}
              {activeTab === 'svg' && ( <div> <div className="form-group"><label>SVG Code</label><textarea rows="6" className="form-control" value={svgInput} onChange={(e) => setSvgInput(e.target.value)} /></div> <button onClick={convertSvg} className="btn btn-primary form-group"><RefreshCw size={18}/> Convert to PNG</button> {pngUrl && <div><img src={pngUrl} alt="Converted PNG" style={{display:'block', marginBottom:'15px', borderRadius:'12px', boxShadow:'var(--shadow-md)'}}/><a href={pngUrl} download="converted.png" className="btn btn-secondary"><Download size={16}/> Download PNG</a></div>} </div> )}
              {activeTab === 'svg-minify' && ( <div> <div className="form-group"><label>Raw SVG</label><textarea rows="6" className="form-control" value={svgMinInput} onChange={(e) => setSvgMinInput(e.target.value)} /></div> <button onClick={minifySvg} className="btn btn-primary form-group"><FileCode2 size={18}/> Minify SVG</button> {svgSavings && <p style={{ color: 'var(--success)', fontWeight: '600', marginBottom: '10px' }}>{svgSavings}</p>} {svgMinOutput && <div className="form-group"><label>Minified SVG</label><textarea rows="6" readOnly className="form-control readonly-area" value={svgMinOutput} /></div>} </div> )}
              {activeTab === 'ratio' && ( <div> <div className="responsive-grid form-group"> <div><label>Original Width</label><input type="number" className="form-control" value={arW1} onChange={(e) => setArW1(e.target.value)} /></div> <div><label>Original Height</label><input type="number" className="form-control" value={arH1} onChange={(e) => setArH1(e.target.value)} /></div> </div> <div className="responsive-grid form-group"> <div><label>New Width</label><input type="number" className="form-control" value={arW2} onChange={(e) => setArW2(e.target.value)} /></div> <div className="stat-box"><h4>New Height</h4><p>{arH2} px</p></div> </div> </div> )}
              {activeTab === 'color' && ( <div> <div className="responsive-grid form-group"> <div><label>HEX Code</label><input type="text" className="form-control" value={colorInput} onChange={handleColorChange} placeholder="#000000" /></div> <div className="stat-box"><p>{rgbOutput}</p></div> </div> <div style={{ height: '100px', borderRadius: '16px', backgroundColor: rgbOutput !== 'Invalid HEX' ? colorInput : 'var(--bg-base)', boxShadow:'var(--shadow-md)' }}></div> </div> )}
              {activeTab === 'dummyimg' && ( <div> <div className="responsive-grid form-group"> <div><label>Width</label><input type="number" className="form-control" value={dummyW} onChange={(e) => setDummyW(Number(e.target.value))} /></div> <div><label>Height</label><input type="number" className="form-control" value={dummyH} onChange={(e) => setDummyH(Number(e.target.value))} /></div> <div><label>Background Color</label><input type="color" className="form-control" style={{ padding: '2px', height: '50px' }} value={dummyBg} onChange={(e) => setDummyBg(e.target.value)} /></div> <div><label>Text Color</label><input type="color" className="form-control" style={{ padding: '2px', height: '50px' }} value={dummyColor} onChange={(e) => setDummyColor(e.target.value)} /></div> </div> <div className="form-group"><label>Custom Text (Optional)</label><input type="text" className="form-control" value={dummyText} onChange={(e) => setDummyText(e.target.value)} /></div> <button onClick={genDummy} className="btn btn-primary form-group"><ImagePlus size={18}/> Generate Image</button> {dummyImgUrl && ( <div style={{ marginTop: '20px', textAlign: 'center' }}> <img src={dummyImgUrl} alt="Dummy Placeholder" style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '15px' }} /> <br/><a href={dummyImgUrl} download={`${dummyW}x${dummyH}.png`} className="btn btn-secondary"><Download size={16}/> Download PNG</a> </div> )} </div> )}

              {activeTab === 'api-tester' && ( <div> <div style={{padding:'16px', background:'var(--primary-light)', border:'1px solid var(--primary)', color:'var(--primary)', borderRadius:'12px', marginBottom:'20px', fontSize:'0.9rem', fontWeight:'500'}}> ⚠️ <strong>Note:</strong> Requests are made locally from your browser to the destination URL. Do not enter sensitive credentials unless you trust the destination API. </div> <div style={{display:'flex', gap:'10px'}} className="form-group"> <select className="form-control" style={{width:'120px'}} value={apiMethod} onChange={(e) => setApiMethod(e.target.value)}> <option value="GET">GET</option> <option value="POST">POST</option> <option value="PUT">PUT</option> <option value="DELETE">DELETE</option> <option value="PATCH">PATCH</option> </select> <input type="text" className="form-control" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://api.example.com/v1/resource" /> </div> <div className="responsive-grid form-group"> <div> <label>Request Headers (JSON)</label> <textarea rows="4" className="form-control" value={apiHeaders} onChange={(e) => setApiHeaders(e.target.value)} /> </div> {['POST', 'PUT', 'PATCH'].includes(apiMethod) && ( <div> <label>Request Body (JSON)</label> <textarea rows="4" className="form-control" value={apiBody} onChange={(e) => setApiBody(e.target.value)} /> </div> )} </div> <button onClick={handleApiSend} disabled={apiLoading} className="btn btn-primary form-group"> <Send size={18} /> {apiLoading ? 'Sending...' : 'Send Request'} </button> {apiStatus && ( <div className="results-grid"> <div className="stat-box"><h4>Status</h4><p>{apiStatus}</p></div> {apiTime && <div className="stat-box"><h4>Response Time</h4><p>{apiTime} ms</p></div>} </div> )} {apiResponse && ( <div className="form-group" style={{marginTop:'20px'}}> <label>Response Body</label> <textarea rows="10" readOnly className="form-control readonly-area" value={apiResponse} /> </div> )} </div> )}
              {activeTab === 'code-to-img' && ( <div> <div className="responsive-grid form-group"> <div><label>File Name / Title</label><input type="text" className="form-control" value={codeTitle} onChange={(e) => setCodeTitle(e.target.value)} /></div> </div> <div className="form-group"><label>Code Snippet</label><textarea rows="8" className="form-control" style={{fontFamily:'monospace'}} value={codeSnippet} onChange={(e) => setCodeSnippet(e.target.value)} /></div> <button onClick={generateCodeImage} className="btn btn-primary form-group"><Code size={18}/> Render Image</button> {codeImgUrl && ( <div style={{textAlign:'center', marginTop:'20px'}}> <img src={codeImgUrl} alt="Rendered Code" style={{maxWidth:'100%', borderRadius:'16px', boxShadow:'var(--shadow-lg)', marginBottom:'20px'}} /> <br/><a href={codeImgUrl} download="code-snippet.png" className="btn btn-secondary"><Download size={16}/> Download PNG</a> </div> )} </div> )}
              {activeTab === 'contrast-checker' && ( <div> <div className="responsive-grid form-group"> <div><label>Foreground / Text Color</label><input type="color" className="form-control" style={{padding:'2px', height:'50px'}} value={fgColor} onChange={(e) => setFgColor(e.target.value)} /><input type="text" className="form-control" style={{marginTop:'5px'}} value={fgColor} onChange={(e) => setFgColor(e.target.value)} /></div> <div><label>Background Color</label><input type="color" className="form-control" style={{padding:'2px', height:'50px'}} value={bgColor} onChange={(e) => setBgColor(e.target.value)} /><input type="text" className="form-control" style={{marginTop:'5px'}} value={bgColor} onChange={(e) => setBgColor(e.target.value)} /></div> </div> <div style={{padding:'40px', borderRadius:'16px', background:bgColor, color:fgColor, border:'1px solid var(--border)', textAlign:'center', margin:'30px 0', boxShadow:'var(--shadow-md)'}}> <h2 style={{color:fgColor, margin:'0 0 10px 0'}}>Sample Headline</h2> <p style={{color:fgColor, margin:0, fontSize:'1.1rem'}}>This is a live text preview demonstrating the accessibility contrast ratio.</p> </div> <div className="results-grid"> <div className="stat-box"><h4>Contrast Ratio</h4><p>{contrastFormatted} : 1</p></div> <div className="stat-box"><h4>WCAG AA (Normal)</h4><p style={{color: contrastRatio >= 4.5 ? 'var(--success)' : 'var(--error)'}}>{contrastRatio >= 4.5 ? 'PASS' : 'FAIL'}</p></div> <div className="stat-box"><h4>WCAG AAA (Enhanced)</h4><p style={{color: contrastRatio >= 7.0 ? 'var(--success)' : 'var(--error)'}}>{contrastRatio >= 7.0 ? 'PASS' : 'FAIL'}</p></div> </div> </div> )}
              {activeTab === 'data-uri' && ( <div> <div className="file-input-wrapper"><input type="file" onChange={handleDataUriUpload} className="file-input" /></div> {dataUriOut && ( <> <div className="form-group"><label>Raw Data URI</label><textarea rows="4" readOnly className="form-control readonly-area" value={dataUriOut} /></div> <div className="form-group"><label>CSS Background Usage</label><textarea rows="2" readOnly className="form-control readonly-area" value={`background-image: url("${dataUriOut}");`} /></div> </> )} </div> )}
              {activeTab === 'excel-json' && ( <div> <div className="file-input-wrapper"><input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelUpload} className="file-input" /></div> {excelJsonOut && ( <> <div className="results-grid" style={{marginBottom:'20px'}}> <div className="stat-box"><h4>Parsed Records</h4><p>{excelRowCount}</p></div> <div className="stat-box"><h4>Format</h4><p style={{color:'var(--success)'}}>JSON Array</p></div> </div> <div className="form-group"><label>JSON Output</label><textarea rows="10" readOnly className="form-control readonly-area" value={excelJsonOut} /></div> </> )} </div> )}
              {activeTab === 'json-ts' && ( <div> <div className="form-group"><label>JSON Input</label><textarea rows="5" className="form-control" value={jsonToTsInput} onChange={(e) => setJsonToTsInput(e.target.value)} /></div> <button onClick={convertJsonToTs} className="btn btn-primary form-group"><Brackets size={18}/> Convert to TS</button> <div className="form-group"><label>TypeScript Output</label><textarea rows="7" readOnly className="form-control readonly-area" value={tsOutput} /></div> </div> )}
              {activeTab === 'json' && ( <div> <div className="form-group"><label>JSON Input</label><textarea rows="4" className="form-control" placeholder='{"example":"paste code here"}' value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} /></div> <button onClick={formatJson} className="btn btn-primary form-group"><Code size={18}/> Format JSON</button> <div className="form-group"><label>Formatted Output</label><textarea rows="8" readOnly className="form-control readonly-area" value={jsonOutput} /></div> </div> )}
              {activeTab === 'json-csv' && ( <div> <div className="btn-group form-group"> <button className={`btn ${j2cMode === 'json2csv' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setJ2cMode('json2csv')}>JSON to CSV</button> <button className={`btn ${j2cMode === 'csv2json' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setJ2cMode('csv2json')}>CSV to JSON</button> </div> <div className="form-group"><label>Input</label><textarea rows="6" className="form-control" placeholder={j2cMode === 'json2csv' ? 'Paste JSON array here...' : 'Paste CSV text here...'} value={j2cInput} onChange={(e) => setJ2cInput(e.target.value)} /></div> <button onClick={runJ2c} className="btn btn-primary form-group"><FileJson size={18}/> Convert Format</button> {j2cOutput && <div className="form-group"><label>Output</label><textarea rows="8" readOnly className="form-control readonly-area" value={j2cOutput} /></div>} </div> )}
              {activeTab === 'sql-format' && ( <div> <div className="form-group"><label>SQL Input</label><textarea rows="6" className="form-control" placeholder="Paste unformatted SQL query..." value={sqlInput} onChange={(e) => setSqlInput(e.target.value)} /></div> <button onClick={formatSql} className="btn btn-primary form-group"><Database size={18}/> Format SQL</button> {sqlOutput && <div className="form-group"><label>Formatted SQL</label><textarea rows="8" readOnly className="form-control readonly-area" value={sqlOutput} /></div>} </div> )}
              {activeTab === 'beautify' && ( <div> <div className="form-group"><label>Messy Code</label><textarea rows="4" className="form-control" value={messyCode} onChange={(e) => setMessyCode(e.target.value)} /></div> <button onClick={formatSnippet} className="btn btn-primary form-group"><Code2 size={18}/> Format Code</button> <div className="form-group"><label>Clean Code</label><textarea rows="10" readOnly className="form-control readonly-area" value={cleanCode} /></div> </div> )}
              {activeTab === 'diff-check' && ( <div> <div className="responsive-grid form-group"> <div><label>Original Text</label><textarea className="form-control" rows="6" value={diffA} onChange={(e) => setDiffA(e.target.value)} /></div> <div><label>New Text</label><textarea className="form-control" rows="6" value={diffB} onChange={(e) => setDiffB(e.target.value)} /></div> </div> <button onClick={runDiff} className="btn btn-primary form-group"><GitCompare size={18}/> Compare Differences</button> {diffResult.length > 0 && ( <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: 'var(--bg-surface-hover)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'left' }}> {diffResult.map((part, i) => ( <span key={i} style={{ backgroundColor: part.added ? 'rgba(16, 185, 129, 0.15)' : part.removed ? 'rgba(239, 68, 68, 0.15)' : 'transparent', color: part.added ? 'var(--success)' : part.removed ? 'var(--error)' : 'inherit', borderRadius:'4px' }}> {part.value} </span> ))} </div> )} </div> )}
              {activeTab === 'url-encode' && ( <div> <div className="btn-group form-group"> <button className={`btn ${urlMode === 'encode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setUrlMode('encode')}>Encode</button> <button className={`btn ${urlMode === 'decode' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setUrlMode('decode')}>Decode</button> </div> <div className="form-group"><label>Input</label><textarea rows="4" className="form-control" placeholder="Enter URL or string..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} /></div> <button onClick={handleUrlTransform} className="btn btn-primary form-group"><Link size={18}/> {urlMode === 'encode' ? 'Encode URL' : 'Decode URL'}</button> {urlOutput && <div className="form-group"><label>Output</label><textarea rows="4" readOnly className="form-control readonly-area" value={urlOutput} /></div>} </div> )}
              {activeTab === 'uuid-gen' && ( <div> <div className="form-group"><label>Count (1 - 1000): {uuidCount}</label><input type="range" min="1" max="1000" value={uuidCount} onChange={(e) => setUuidCount(e.target.value)} /></div> <button onClick={generateUuids} className="btn btn-primary form-group"><Key size={18}/> Generate UUIDs</button> {uuidOutput && <div className="form-group"><label>Generated UUIDs</label><textarea rows="8" readOnly className="form-control readonly-area" value={uuidOutput} /></div>} </div> )}
              {activeTab === 'mongo' && ( <div> <div className="form-group"><label>MongoDB ObjectId</label><input type="text" className="form-control" placeholder="e.g. 507f1f77bcf86cd799439011" value={mongoId} onChange={(e) => setMongoId(e.target.value)} /></div> <button onClick={extractMongoDate} className="btn btn-primary form-group"><Database size={18}/> Extract Date</button> {mongoResult && <div className="form-group"><label>Extraction Result</label><div className="form-control readonly-area">{mongoResult}</div></div>} </div> )}
              {activeTab === 'jwt' && ( <div> <div className="form-group"><label>JSON Web Token</label><textarea rows="4" className="form-control" placeholder="Paste JWT here..." value={jwt} onChange={(e) => setJwt(e.target.value)} /></div> <button onClick={decodeJwt} className="btn btn-primary form-group"><LockOpen size={18}/> Decode Token</button> {jwtData && ( <div style={{padding:'16px', background:'rgba(245, 158, 11, 0.1)', border:'1px solid var(--warning)', color:'#b45309', borderRadius:'12px', marginBottom:'20px', fontSize:'0.9rem'}}> ⚠️ <strong>Security Notice:</strong> Decoding a JWT only reveals its payload. It does <strong>not</strong> verify the signature, validate the issuer, or ensure the token's authenticity. </div> )} <div className="form-group"><label>Decoded Payload</label><textarea rows="6" readOnly className="form-control readonly-area" value={jwtData} /></div> </div> )}
              {activeTab === 'box-shadow' && ( <div> <div className="responsive-grid form-group"> <div><label>Horizontal ({boxH}px)</label><input type="range" min="-50" max="50" value={boxH} onChange={(e) => setBoxH(Number(e.target.value))} /></div> <div><label>Vertical ({boxV}px)</label><input type="range" min="-50" max="50" value={boxV} onChange={(e) => setBoxV(Number(e.target.value))} /></div> <div><label>Blur ({boxBlur}px)</label><input type="range" min="0" max="100" value={boxBlur} onChange={(e) => setBoxBlur(Number(e.target.value))} /></div> <div><label>Spread ({boxSpread}px)</label><input type="range" min="-50" max="50" value={boxSpread} onChange={(e) => setBoxSpread(Number(e.target.value))} /></div> <div><label>Shadow Color</label><input type="color" className="form-control" style={{ padding: '2px', height: '50px' }} value={boxColor} onChange={(e) => setBoxColor(e.target.value)} /></div> <div><label>Opacity ({boxOpacity})</label><input type="range" min="0" max="1" step="0.05" value={boxOpacity} onChange={(e) => setBoxOpacity(Number(e.target.value))} /></div> </div> <div style={{ padding: '50px', background: 'var(--bg-surface-hover)', borderRadius: '16px', marginBottom: '30px', display: 'flex', justifyContent: 'center', border:'1px solid var(--border)' }}> <div style={{ width: '150px', height: '150px', background: '#fff', borderRadius: '16px', boxShadow: `${boxH}px ${boxV}px ${boxBlur}px ${boxSpread}px ${hexToRgba(boxColor, boxOpacity)}` }}></div> </div> <div className="form-group"><label>CSS Code</label><textarea rows="2" readOnly className="form-control readonly-area" value={boxShadowCSS} /></div> </div> )}
              {activeTab === 'glass' && ( <div> <div className="responsive-grid form-group"> <div><label>Blur ({blur}px)</label><input type="range" min="0" max="30" value={blur} onChange={(e) => setBlur(e.target.value)} /></div> <div><label>Opacity ({opacity})</label><input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} /></div> </div> <div style={{padding:'60px', background:'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85") center/cover', borderRadius:'16px', marginBottom:'30px'}}> <div style={{padding:'40px', borderRadius:'16px', background:`rgba(255,255,255,${opacity})`, backdropFilter:`blur(${blur}px)`, border:'1px solid rgba(255,255,255,0.4)', boxShadow:'var(--shadow-lg)'}}> <h3 style={{color:'#fff', margin:0, fontSize:'1.5rem'}}>Glassmorphism Preview</h3> </div> </div> <div className="form-group"><label>CSS Code</label><textarea rows="5" readOnly className="form-control readonly-area" value={glassCss} /></div> </div> )}
              {activeTab === 'cron' && ( <div> <div className="form-group"><label>Cron Expression</label><input type="text" className="form-control" placeholder="e.g. 0 12 * * 1-5" value={cronInput} onChange={(e) => setCronInput(e.target.value)} /></div> <button onClick={translateCron} className="btn btn-primary form-group"><Calendar size={18}/> Translate</button> {cronResult && <div className="form-group"><label>Human Readable Result</label><div className="form-control readonly-area" style={{fontSize: '1.2rem', fontWeight:'600', color:'var(--primary)'}}>{cronResult}</div></div>} </div> )}
              {activeTab === 'regex' && ( <div> <div className="form-group"><label>Regex Pattern</label><input type="text" maxLength="200" className="form-control" placeholder="[a-z]+" value={regexPattern} onChange={(e) => setRegexPattern(e.target.value)} /></div> <div className="form-group"><label>Test String</label><textarea rows="3" maxLength="10000" className="form-control" value={regexText} onChange={(e) => setRegexText(e.target.value)} /></div> <button onClick={testRegex} className="btn btn-primary form-group"><FileSearch size={18}/> Test Matches</button> <div className="form-group"><label>Match Results</label><div className="form-control readonly-area">{regexResult}</div></div> </div> )}
              {activeTab === 'keys' && ( <div> <div className="form-group"><label>Press any key inside this box:</label><input type="text" className="form-control" style={{textAlign: 'center', fontSize: '1.8rem', padding:'40px', background:'var(--bg-surface-hover)'}} placeholder="Press a key here..." onKeyDown={handleKeyDown} readOnly /></div> <div className="results-grid"> <div className="stat-box"><h4>event.key</h4><p>{keyData.key}</p></div> <div className="stat-box"><h4>event.keyCode</h4><p>{keyData.keyCode}</p></div> <div className="stat-box"><h4>event.code</h4><p>{keyData.code}</p></div> </div> </div> )}
              {activeTab === 'viewport' && ( <div style={{textAlign: 'center'}}> <div className="results-grid"> <div className="stat-box"><h4>Resolution</h4><p>{viewport.w} x {viewport.h}</p></div> <div className="stat-box"><h4>Pixel Ratio</h4><p>{viewport.ratio}x</p></div> </div> </div> )}
              
              {/* WRITING & TEXT */}
              {activeTab === 'counter' && ( <div> <div className="form-group"><textarea rows="8" className="form-control" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here..."/></div> <div className="results-grid"> <div className="stat-box"><h4>Words</h4><p>{words}</p></div> <div className="stat-box"><h4>Characters</h4><p>{chars}</p></div> </div> </div> )}
              {activeTab === 'case' && ( <div> <div className="form-group"><textarea rows="8" className="form-control" value={caseText} onChange={(e) => setCaseText(e.target.value)} placeholder="Paste your text..." /></div> <div className="btn-group"> <button className="btn btn-primary" onClick={() => setCaseText(caseText.toUpperCase())}>UPPERCASE</button> <button className="btn btn-primary" onClick={() => setCaseText(caseText.toLowerCase())}>lowercase</button> <button className="btn btn-primary" onClick={() => setCaseText(caseText.replace(/\b\w/g, c => c.toUpperCase()))}>Title Case</button> </div> </div> )}
              {activeTab === 'spell' && ( <div> <div className="form-group"><textarea rows="10" className="form-control" value={spellText} onChange={(e) => setSpellText(e.target.value)} spellCheck="true" placeholder="Start typing... any misspelled words will have a red underline."/></div> <button onClick={cleanSpaces} className="btn btn-secondary">Clean Extra Spaces</button> </div> )}
              {activeTab === 'lorem' && ( <div> <div className="form-group"> <label>Paragraphs: {paragraphs}</label> <input type="range" min="1" max="10" value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /> </div> <div className="form-group"><textarea rows="10" readOnly className="form-control readonly-area" value={generatedLorem} /></div> </div> )}
              {activeTab === 'md' && ( <div> <div className="form-group"><label>Markdown Input</label><textarea rows="8" className="form-control" value={mdInput} onChange={(e) => setMdInput(e.target.value)} /></div> <div className="form-group"><label>Live Preview (Sanitized for Security)</label> <div style={{padding:'30px', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'16px', boxShadow:'var(--shadow-sm)'}} dangerouslySetInnerHTML={{ __html: mdOutput }} /> </div> </div> )}

              {/* BUSINESS & UTILITIES */}
              {activeTab === 'freelance' && ( <div> <div className="responsive-grid form-group"> <div><label>Hours: {hours}</label><input type="range" min="1" max="160" value={hours} onChange={(e) => setHours(e.target.value)} /></div> <div><label>Rate ($): {rate}</label><input type="range" min="10" max="200" value={rate} onChange={(e) => setRate(e.target.value)} /></div> <div><label>Tax (%): {tax}</label><input type="range" min="0" max="50" value={tax} onChange={(e) => setTax(e.target.value)} /></div> </div> <div className="results-grid"> <div className="stat-box"><h4>Gross Total</h4><p style={{color:'var(--text-main)'}}>${gross}</p></div> <div className="stat-box"><h4>Net Earnings</h4><p style={{color:'var(--success)'}}>${net.toFixed(2)}</p></div> </div> </div> )}
              {activeTab === 'invoice' && ( <div> <div className="form-group"><label>Client Name</label><input type="text" className="form-control" placeholder="John Doe" value={client} onChange={(e) => setClient(e.target.value)} /></div> <button onClick={generateInvoice} className="btn btn-primary"><Download size={18}/> Download PDF Invoice</button> </div> )}
              {activeTab === 'dummy-data' && ( <div> <div className="form-group"><label>Records Count (1 - 50): {dummyCount}</label><input type="range" min="1" max="50" value={dummyCount} onChange={(e) => setDummyCount(e.target.value)} /></div> <div className="btn-group form-group"> <button className={`btn ${dummyFormat === 'json' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDummyFormat('json')}>JSON</button> <button className={`btn ${dummyFormat === 'csv' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setDummyFormat('csv')}>CSV</button> </div> <button onClick={generateMockData} className="btn btn-primary form-group"><Layers size={18}/> Generate Records</button> {dummyOutput && <div className="form-group"><label>Output</label><textarea rows="8" readOnly className="form-control readonly-area" value={dummyOutput} /></div>} </div> )}
              {activeTab === 'seo' && ( <div> <div className="form-group"><label>Page Title</label><input type="text" className="form-control" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div> <div className="form-group"><label>Page Description</label><textarea rows="2" className="form-control" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} /></div> <div className="form-group"><label>OG Image URL</label><input type="text" className="form-control" value={seoImg} onChange={(e) => setSeoImg(e.target.value)} /></div> <div className="form-group"><label>Generated HTML Meta Tags</label><textarea rows="7" readOnly className="form-control readonly-area" value={seoTags} /></div> </div> )}
              {activeTab === 'utm' && ( <div> <div className="form-group"><label>Website URL</label><input type="text" className="form-control" value={utmUrl} onChange={(e) => setUtmUrl(e.target.value)} /></div> <div className="responsive-grid form-group"> <div><label>Source</label><input type="text" className="form-control" value={utmSrc} onChange={(e) => setUtmSrc(e.target.value)} /></div> <div><label>Medium</label><input type="text" className="form-control" value={utmMed} onChange={(e) => setUtmMed(e.target.value)} /></div> <div><label>Campaign</label><input type="text" className="form-control" value={utmCamp} onChange={(e) => setUtmCamp(e.target.value)} /></div> </div> <div className="form-group"><label>Generated UTM Link</label><div className="form-control readonly-area" style={{padding:'20px', wordBreak:'break-all'}}>{utmResult}</div></div> </div> )}
              {activeTab === 'qr' && ( <div> <div className="form-group"><label>URL or Text</label><input type="text" className="form-control" value={qrText} onChange={(e) => setQrText(e.target.value)} /></div> <div style={{background:'#fff', padding:'30px', borderRadius:'16px', display:'inline-block', boxShadow:'var(--shadow-md)'}}><QRCodeCanvas value={qrText} size={250} level={"H"} /></div> </div> )}

              {activeTab === 'zip' && ( <div> <div className="file-input-wrapper"><input type="file" multiple onChange={(e) => { setZipFiles(Array.from(e.target.files)); }} className="file-input" /></div> <button onClick={compressDocs} disabled={zipFiles.length === 0 || zipping} className="btn btn-primary form-group"><FileArchive size={18}/> {zipping ? 'Compressing...' : 'Create Secure ZIP Archive'}</button> {zipUrl && <div style={{marginTop: '20px'}}><a href={zipUrl} download="archive.zip" className="btn btn-secondary"><Download size={18}/> Download ZIP</a></div>} </div> )}
              {activeTab === 'voicememo' && ( <div> <div className="btn-group"> {!isRecordingMemo ? ( <button onClick={startMemo} className="btn btn-primary"><MicVocal size={18}/> Start Recording</button> ) : ( <button onClick={stopMemo} className="btn btn-danger"><Square size={18}/> Stop Recording</button> )} </div> {isRecordingMemo && ( <div style={{ marginTop: '20px', color: 'var(--error)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize:'1.1rem' }}> <div style={{ width: '14px', height: '14px', background: 'var(--error)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div> Recording Audio... </div> )} {memoUrl && !isRecordingMemo && ( <div style={{ marginTop: '30px', background:'var(--bg-surface-hover)', padding:'20px', borderRadius:'16px' }}> <audio src={memoUrl} controls style={{ width: '100%', marginBottom: '20px' }} /> <a href={memoUrl} download="voice-memo.webm" className="btn btn-primary"><Download size={18}/> Download Audio</a> </div> )} </div> )}
              {activeTab === 'timer' && ( <div style={{textAlign: 'center', padding:'40px 0'}}> <div style={{fontSize: '6rem', fontWeight: '800', margin: '0 0 40px 0', fontVariantNumeric:'tabular-nums', letterSpacing:'-2px'}}>{formatTime(time)}</div> <div className="btn-group" style={{justifyContent: 'center'}}> {!timerOn && <button onClick={() => setTimerOn(true)} className="btn btn-primary"><Play size={18}/> Start Timer</button>} {timerOn && <button onClick={() => setTimerOn(false)} className="btn btn-danger"><Pause size={18}/> Pause</button>} <button onClick={() => { setTimerOn(false); setTime(0); }} className="btn btn-secondary"><Square size={18}/> Reset</button> </div> </div> )}
              {activeTab === 'pomo' && ( <div style={{textAlign: 'center', padding:'40px 0'}}> <div style={{fontSize: '7rem', fontWeight: '800', margin: '0 0 40px 0', fontVariantNumeric:'tabular-nums', letterSpacing:'-3px'}}>{formatPomo(pomoTime)}</div> <div className="btn-group" style={{justifyContent: 'center'}}> {!pomoActive ? <button onClick={() => setPomoActive(true)} className="btn btn-primary"><Play size={18}/> Start Focus</button> : <button onClick={() => setPomoActive(false)} className="btn btn-danger"><Pause size={18}/> Pause</button>} <button onClick={() => { setPomoActive(false); setPomoTime(25 * 60); }} className="btn btn-secondary"><Square size={18}/> Reset</button> </div> </div> )}

              <RelatedTools currentTool={currentTool} navigate={navigate} />
            </div>
          )}

          {activeTab !== 'home' && currentTool && (
            <div className="seo-content" style={{ marginTop: '40px', padding: '30px', borderTop: '2px solid var(--border)', color: 'var(--text-main)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>About the {currentTool.name} Tool</h2>
              <p style={{ marginBottom: '15px', color:'var(--text-muted)' }}>{currentTool.description}</p>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Privacy First Guarantee</h3>
              <p style={{ color:'var(--text-muted)' }}>
                Unlike traditional online utilities, our {currentTool.name} runs 100% locally within your browser. Your data is never collected, stored, or transmitted to external servers. Enjoy lightning-fast, secure processing without compromising your privacy.
              </p>
            </div>
          )}
        </main>
      </div>

      <footer style={{ textAlign: 'center', padding: '60px 20px 40px 20px', color: 'var(--text-muted)', fontSize: '0.95rem', borderTop: '1px solid var(--border)', background:'var(--bg-surface)' }}>
        <p style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px', fontSize:'1.2rem' }}>I Love Tools &copy; {new Date().getFullYear()}</p>
        <p style={{ marginBottom: '10px' }}>Engineered for developers, designers, and creators.</p>
        <p style={{ marginBottom: '30px' }}>
          Have a suggestion for a new tool or found a bug? Let us know! <br/>
          Email: <a href="mailto:software.index.si@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>software.index.si@gmail.com</a>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
          <button onClick={() => setActiveModal('privacy')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none', padding: 0, fontWeight:'500' }}>Privacy Policy</button>
          <span>•</span>
          <button onClick={() => setActiveModal('terms')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'none', padding: 0, fontWeight:'500' }}>Terms of Service</button>
        </div>
      </footer>

      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', animation:'fadeIn 0.2s ease-out' }} onClick={() => setActiveModal(null)}>
          <div style={{ background: '#ffffff', padding: '50px', borderRadius: '24px', maxWidth: '650px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-base)', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition:'all 0.2s' }}>&times;</button>
            {activeModal === 'privacy' && ( <> <h2 style={{ marginBottom: '20px', fontSize: '2.2rem', fontWeight:'800', letterSpacing:'-0.5px' }}>Privacy Policy</h2> <p style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize:'1.1rem', lineHeight:'1.7' }}>At I Love Tools, your privacy is our extreme priority. Most tools and utilities provided on this website operate 100% client-side. We do not upload, process, or store your local files on external servers.</p> </> )}
            {activeModal === 'terms' && ( <> <h2 style={{ marginBottom: '20px', fontSize: '2.2rem', fontWeight:'800', letterSpacing:'-0.5px' }}>Terms of Service</h2> <p style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize:'1.1rem', lineHeight:'1.7' }}>All tools provided on this website are free to use and run primarily locally in your browser. We provide these utilities "as is" without any warranties of any kind.</p> </> )}
          </div>
        </div>
      )}

      <Analytics />
      <SpeedInsights />
    </div>
  );
}