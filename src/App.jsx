import React, { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { marked } from 'marked';
import cronstrue from 'cronstrue';
import bcrypt from 'bcryptjs';
import { diffLines } from 'diff';
import gifshot from 'gifshot';
import { 
  Image, FileText, Type, Key, Download, QrCode, Binary, AlignLeft, 
  CheckSquare, Code, Palette, FileUp, FileArchive, Music, Code2, 
  Maximize, Hash, Timer, Play, Pause, Square, LockOpen, Database, 
  FileCode2, Droplet, FileSpreadsheet, Calculator, Clock, Video, 
  Monitor, RefreshCw, Brackets, Calendar, FileSearch, Keyboard, 
  Crop, Globe, Link, Search, ChevronDown, ShieldCheck, Layers, 
  Sparkles, Film, Scissors, Wand2, Mic, Volume2, CameraOff, 
  KeyRound, Fingerprint, FileJson, GitCompare, ImagePlus, 
  Clapperboard, AppWindow, MicVocal, Home
} from 'lucide-react';
import AdBanner from './AdBanner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

// --- PURE JS WAV ENCODER HELPER ---
const encodeWAV = (audioBuffer) => {
  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let sampleRate = audioBuffer.sampleRate;
  let offset = 0;
  let pos = 0;

  const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
  const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); 
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); 
  setUint16(1); 
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); 
  setUint16(numOfChan * 2); 
  setUint16(16); 
  setUint32(0x61746164); // "data" chunk
  setUint32(length - pos - 4); 

  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }
  return new Blob([buffer], { type: "audio/wav" });
};

// --- ENRICHED CATEGORY STRUCTURE FOR SEO ---
const categories = {
  "Security & Privacy": [
    { id: 'aes-encrypt', name: 'AES Encryption', icon: ShieldCheck, description: 'Securely encrypt and decrypt sensitive text using AES-GCM directly in your browser. 100% private.' },
    { id: 'rsa-gen', name: 'RSA Key Generator', icon: KeyRound, description: 'Generate highly secure Public and Private RSA key pairs locally for your SSH or application needs.' },
    { id: 'hash', name: 'SHA-256 Hash', icon: Hash, description: 'Instantly generate secure SHA-256 cryptographic hashes from any text input.' },
    { id: 'bcrypt', name: 'Bcrypt Hash', icon: Fingerprint, description: 'Generate strong Bcrypt hashes securely inside the browser for your backend development testing.' },
    { id: 'base64', name: 'Base64 Encode', icon: Binary, description: 'Encode or decode standard text to and from Base64 format instantly.' },
    { id: 'password', name: 'Password Gen', icon: Key, description: 'Create highly secure, randomized passwords with customizable lengths and characters.' },
    { id: 'exif-strip', name: 'EXIF Stripper', icon: CameraOff, description: 'Remove hidden GPS coordinates, camera models, and metadata from your photos before sharing.' },
  ],
  "Media & Graphics": [
    { id: 'image', name: 'Compress Image', icon: Image, description: 'Compress PNG, JPG, and WebP images locally without losing quality. Set an exact target file size in KB or MB.' },
    { id: 'videditor', name: 'Video Editor', icon: Film, description: 'A lightweight browser editor to trim clips, adjust playback speed, crop aspect ratios, and apply color filters locally.' },
    { id: 'audioedit', name: 'Audio Editor', icon: Mic, description: 'Trim, adjust volume, apply fades, shift speed, and reverse audio to export as a high-quality WAV.' },
    { id: 'resize', name: 'Resize Image', icon: Maximize, description: 'Resize the pixel dimensions of any image instantly right in your browser.' },
    { id: 'pdfgen', name: 'Photos to PDF', icon: FileUp, description: 'Convert multiple images and photos into a single, cohesive PDF document.' },
    { id: 'audio', name: 'Extract Audio', icon: Music, description: 'Perfectly rip and extract the raw audio track from any video into a high-quality WAV file.' },
    { id: 'screen', name: 'Screen Record', icon: Video, description: 'Record your screen natively without external software and download the video locally.' },
    { id: 'vid2gif', name: 'Video to GIF', icon: Clapperboard, description: 'Convert short video clips into lightweight, animated GIFs natively in your browser.' },
    { id: 'palette-extract', name: 'Color Palette', icon: Palette, description: 'Upload any image to extract its dominant color scheme and hex codes instantly.' },
    { id: 'svg', name: 'SVG to PNG', icon: Image, description: 'Convert raw SVG code or files into standard, usable PNG images.' },
    { id: 'svg-minify', name: 'SVG Minifier', icon: FileCode2, description: 'Reduce the file size of your SVG graphics by stripping unnecessary code and tags.' },
    { id: 'ratio', name: 'Aspect Ratio', icon: Crop, description: 'Calculate exact pixel dimensions based on standard or custom aspect ratios.' },
    { id: 'color', name: 'Color Pick', icon: Droplet, description: 'Convert HEX color codes into standard RGB values for your CSS stylesheets.' },
    { id: 'dummyimg', name: 'Dummy Image', icon: ImagePlus, description: 'Generate custom-sized placeholder images with custom background colors and text.' },
  ],
  "Developer & Code": [
    { id: 'json-ts', name: 'JSON to TS', icon: Brackets, description: 'Instantly convert any JSON object into strict TypeScript interfaces for your frontend code.' },
    { id: 'json', name: 'JSON Format', icon: Code, description: 'Beautify, format, and validate ugly JSON strings into readable, indented code.' },
    { id: 'json-csv', name: 'JSON ↔ CSV', icon: FileJson, description: 'Convert JSON arrays to tabular CSVs or parse CSV data back into JSON objects.' },
    { id: 'sql-format', name: 'SQL Format', icon: Database, description: 'Format and beautify messy, single-line SQL queries into readable, multi-line statements.' },
    { id: 'beautify', name: 'Code Beautify', icon: Code2, description: 'Format messy C++, Java, or JavaScript code into properly indented blocks.' },
    { id: 'diff-check', name: 'Diff Checker', icon: GitCompare, description: 'Compare two text blocks side-by-side to highlight exact insertions and deletions.' },
    { id: 'url-encode', name: 'URL Encoder', icon: Link, description: 'Encode complex strings into URL-safe formats, or decode URL strings back into readable text.' },
    { id: 'uuid-gen', name: 'UUID Generator', icon: Key, description: 'Generate secure, randomized bulk UUIDs/GUIDs for your database testing.' },
    { id: 'mongo', name: 'MongoDB ID', icon: Database, description: 'Extract the exact creation timestamp hidden inside a standard MongoDB ObjectId.' },
    { id: 'jwt', name: 'JWT Decode', icon: LockOpen, description: 'Decode JSON Web Tokens instantly to view their payload and header data securely.' },
    { id: 'box-shadow', name: 'CSS Shadow Gen', icon: AppWindow, description: 'Visual UI to tweak complex CSS box-shadow properties and copy the generated code.' },
    { id: 'glass', name: 'Glass CSS', icon: Sparkles, description: 'Generate modern Glassmorphism UI CSS using blur and opacity sliders.' },
    { id: 'cron', name: 'Cron Parse', icon: Calendar, description: 'Translate complex Cron scheduling expressions into readable human language.' },
    { id: 'regex', name: 'Regex Test', icon: FileSearch, description: 'Test and validate your Regular Expressions against custom text strings.' },
    { id: 'keys', name: 'Keycodes', icon: Keyboard, description: 'Press any key on your keyboard to reveal its native JavaScript keyCode and event data.' },
    { id: 'viewport', name: 'Viewport', icon: Monitor, description: 'Instantly check your current screen resolution, viewport size, and pixel ratio.' },
  ],
  "Writing & Text": [
    { id: 'counter', name: 'Word Counter', icon: FileText, description: 'Count exact words, characters, and spaces in your essays or articles.' },
    { id: 'case', name: 'Case Convert', icon: Type, description: 'Easily toggle text blocks between UPPERCASE, lowercase, and Title Case.' },
    { id: 'spell', name: 'Writing Pad', icon: CheckSquare, description: 'A distraction-free writing pad utilizing your browsers native spellcheck.' },
    { id: 'lorem', name: 'Lorem Ipsum', icon: AlignLeft, description: 'Generate paragraphs of standard Lorem Ipsum dummy text for your wireframes.' },
    { id: 'md', name: 'Markdown', icon: FileCode2, description: 'Write Markdown syntax and preview the rendered HTML live in real-time.' },
  ],
  "Marketing & Business": [
    { id: 'freelance', name: 'Freelance Calc', icon: Calculator, description: 'Calculate gross and net freelance income based on hours, hourly rate, and tax deductions.' },
    { id: 'invoice', name: 'PDF Invoice', icon: FileSpreadsheet, description: 'Generate a clean, printable PDF client invoice based on your billing hours.' },
    { id: 'dummy-data', name: 'Mock Data Gen', icon: Layers, description: 'Generate dozens of realistic dummy user records in JSON or CSV format.' },
    { id: 'seo', name: 'SEO Meta', icon: Globe, description: 'Input your page details to instantly generate standard SEO and Open Graph HTML meta tags.' },
    { id: 'utm', name: 'UTM Builder', icon: Link, description: 'Build trackable UTM campaign links for your Google Analytics marketing efforts.' },
    { id: 'qr', name: 'QR Code', icon: QrCode, description: 'Turn any URL or string of text into a scannable QR Code image.' },
  ],
  "General Utilities": [
    { id: 'zip', name: 'Zip Docs', icon: FileArchive, description: 'Compress multiple documents and files into a single downloadable .zip archive.' },
    { id: 'voicememo', name: 'Voice Memo', icon: MicVocal, description: 'Record quick voice notes and test your microphone using the native Web Audio API.' },
    { id: 'timer', name: 'Stopwatch', icon: Timer, description: 'A highly accurate, client-side browser stopwatch and timer.' },
    { id: 'pomo', name: 'Pomodoro', icon: Clock, description: 'Use the standard 25-minute Pomodoro technique timer to stay focused and productive.' },
  ]
};

// Flatten tools for easy lookup
const flatTools = Object.values(categories).flat();

export default function App() {
  // --- CUSTOM VANILLA ROUTING ENGINE ---
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setSearchQuery('');
    setActiveDropdown(null);
  };

  // Derive active tab from URL
  const activeTab = currentPath === '/' ? 'home' : currentPath.replace('/tool/', '');
  const currentTool = flatTools.find(t => t.id === activeTab);

  // --- DYNAMIC SEO ENGINE ---
  useEffect(() => {
    const isHome = activeTab === 'home';
    const siteName = 'I Love Tools';
    
    // 1. Generate Metadata values
    const title = isHome 
      ? `${siteName} | 100% Free & Private Web Utilities` 
      : `${currentTool?.name} - Free Client-Side Tool | ${siteName}`;
      
    const description = isHome
      ? 'An all-in-one hub of 52+ free, private web utilities. Edit videos, convert audio, format code, and compress images directly in your browser with zero server uploads.'
      : currentTool?.description || `Use our free ${currentTool?.name} tool directly in your browser. 100% secure, client-side processing.`;
      
    const canonical = `https://ilovetools.dev${currentPath}`;
    const defaultImage = 'https://ilovetools.dev/og-image.jpg'; // Make sure this image exists in your /public folder!

    // 2. Update Document Title
    document.title = title;

    // 3. Helper to inject/update meta tags safely
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 4. Set Standard & Open Graph Tags
    setMeta('description', description);
    setMeta('og:type', isHome ? 'website' : 'WebApplication', true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonical, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:image', defaultImage, true);
    setMeta('og:image:alt', 'I Love Tools Promotional Graphic', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', defaultImage);

    // 5. Update Canonical Link
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    // 6. Inject Schema.org Structured Data
    let script = document.querySelector('#seo-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    const schema = isHome ? {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": canonical,
      "description": description
    } : {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": currentTool?.name,
      "url": canonical,
      "description": description,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };
    script.textContent = JSON.stringify(schema);

  }, [activeTab, currentPath, currentTool]);


  // --- UI STATE LOGIC ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const handleMouseEnter = (category) => {
    if (window.innerWidth > 900) setActiveDropdown(category);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth > 900) setActiveDropdown(null);
  };
  const handleMobileClick = (category) => {
    if (window.innerWidth <= 900) {
      setActiveDropdown(activeDropdown === category ? null : category);
    }
  };

  // --- PRE-EXISTING TOOL STATE LOGIC ---
  const [jsonToTsInput, setJsonToTsInput] = useState('{"id": 1, "name": "Tool", "active": true}'); 
  const [tsOutput, setTsOutput] = useState(''); 
  const convertJsonToTs = () => { try { const obj = JSON.parse(jsonToTsInput); let ts = 'export interface GeneratedInterface {\n'; for (let k in obj) ts += `  ${k}: ${Array.isArray(obj[k]) ? 'any[]' : typeof obj[k]};\n`; setTsOutput(ts + '}'); } catch (e) { setTsOutput('Error: Invalid JSON format'); } };
  const [cronInput, setCronInput] = useState('0 12 * * 1-5'); 
  const [cronResult, setCronResult] = useState(''); 
  const translateCron = () => { try { setCronResult(cronstrue.toString(cronInput)); } catch (e) { setCronResult('Error: Invalid Cron Expression'); } };
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z]+'); 
  const [regexText, setRegexText] = useState('Test 123 string'); 
  const [regexResult, setRegexResult] = useState(''); 
  const testRegex = () => { try { const re = new RegExp(regexPattern, 'g'); const matches = regexText.match(re); setRegexResult(matches ? matches.join(', ') : 'No matches found.'); } catch(e) { setRegexResult('Error: Invalid Regex Pattern'); } };
  const [keyData, setKeyData] = useState({ key: '-', code: '-', keyCode: '-' }); 
  const handleKeyDown = (e) => { e.preventDefault(); setKeyData({ key: e.key === ' ' ? 'Space' : e.key, code: e.code, keyCode: e.keyCode }); };
  const [arW1, setArW1] = useState(1920); const [arH1, setArH1] = useState(1080); const [arW2, setArW2] = useState(1280); const arH2 = Math.round((arH1 / arW1) * arW2) || 0;
  const [seoTitle, setSeoTitle] = useState('My Awesome Page'); const [seoDesc, setSeoDesc] = useState('A brief description.'); const [seoImg, setSeoImg] = useState('https://example.com/image.jpg'); 
  const seoTags = `<title>${seoTitle}</title>\n<meta name="description" content="${seoDesc}">\n<meta property="og:title" content="${seoTitle}">\n<meta property="og:description" content="${seoDesc}">\n<meta property="og:image" content="${seoImg}">\n<meta name="twitter:card" content="summary_large_image">`;
  const [utmUrl, setUtmUrl] = useState('https://example.com'); const [utmSrc, setUtmSrc] = useState('newsletter'); const [utmMed, setUtmMed] = useState('email'); const [utmCamp, setUtmCamp] = useState('summer_sale'); 
  const utmResult = `${utmUrl}?utm_source=${encodeURIComponent(utmSrc)}&utm_medium=${encodeURIComponent(utmMed)}&utm_campaign=${encodeURIComponent(utmCamp)}`;
  const [originalImage, setOriginalImage] = useState(null); const [compressedImage, setCompressedImage] = useState(null); const [compressing, setCompressing] = useState(false); const [targetSize, setTargetSize] = useState(''); const [targetUnit, setTargetUnit] = useState('KB'); const [compressError, setCompressError] = useState('');
  const handleImageUpload = (e) => { const file = e.target.files[0]; if (file) { setOriginalImage(file); setCompressedImage(null); setCompressError(''); } };
  const handleCompressImage = async () => { if (!originalImage || !targetSize || targetSize <= 0) { setCompressError('Please upload an image and enter a valid target size.'); return; } setCompressing(true); setCompressError(''); try { const sizeInMB = targetUnit === 'KB' ? targetSize / 1024 : Number(targetSize); const options = { maxSizeMB: sizeInMB, maxWidthOrHeight: 4000, useWebWorker: true }; const compressedFile = await imageCompression(originalImage, options); setCompressedImage(compressedFile); } catch (error) { setCompressError('Failed to compress image. Try a slightly larger target size.'); } finally { setCompressing(false); } };
  const [text, setText] = useState(''); const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length;
  const [caseText, setCaseText] = useState('');
  const [password, setPassword] = useState(''); const [length, setLength] = useState(16); 
  const generatePassword = () => { const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'; let r = ''; for (let i = 0; i < length; i++) r += c.charAt(Math.floor(Math.random() * c.length)); setPassword(r); };
  const [qrText, setQrText] = useState('https://example.com');
  const [baseInput, setBaseInput] = useState(''); const [baseMode, setBaseMode] = useState('encode'); 
  const getBase64Result = () => { if (!baseInput) return ''; try { return baseMode === 'encode' ? btoa(baseInput) : atob(baseInput); } catch (e) { return 'Error: Invalid String'; } };
  const [paragraphs, setParagraphs] = useState(3); const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."; const generatedLorem = Array(Number(paragraphs)).fill(loremText).join('\n\n');
  const [spellText, setSpellText] = useState(''); const cleanSpaces = () => setSpellText(spellText.replace(/\s+/g, ' ').trim());
  const [jsonInput, setJsonInput] = useState(''); const [jsonOutput, setJsonOutput] = useState(''); const formatJson = () => { try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); } catch (e) { setJsonOutput('Error: Invalid JSON'); } };
  const [colorInput, setColorInput] = useState('#2563eb'); const [rgbOutput, setRgbOutput] = useState('rgb(37, 99, 235)'); 
  const handleColorChange = (e) => { const hex = e.target.value; setColorInput(hex); let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (r) setRgbOutput(`rgb(${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)})`); else setRgbOutput('Invalid HEX'); };
  const [pdfImages, setPdfImages] = useState([]); const [generatingPdf, setGeneratingPdf] = useState(false); 
  const generatePdf = async () => { if (pdfImages.length === 0) return; setGeneratingPdf(true); const doc = new jsPDF(); for (let i = 0; i < pdfImages.length; i++) { const imgData = await new Promise((res) => { const reader = new FileReader(); reader.onload = (e) => res(e.target.result); reader.readAsDataURL(pdfImages[i]); }); if (i > 0) doc.addPage(); const imgProps = doc.getImageProperties(imgData); const pdfW = doc.internal.pageSize.getWidth(); doc.addImage(imgData, 'JPEG', 0, 0, pdfW, (imgProps.height * pdfW) / imgProps.width); } doc.save('Generated.pdf'); setGeneratingPdf(false); };
  const [zipFiles, setZipFiles] = useState([]); const [zipping, setZipping] = useState(false); const [zipUrl, setZipUrl] = useState(null); 
  const compressDocs = async () => { if (zipFiles.length === 0) return; setZipping(true); const zip = new JSZip(); zipFiles.forEach(file => zip.file(file.name, file)); const content = await zip.generateAsync({ type: 'blob' }); setZipUrl(URL.createObjectURL(content)); setZipping(false); };
  const [messyCode, setMessyCode] = useState(`#include <iostream>\nusing namespace std;int main(){cout<<"Hello";return 0;}`); const [cleanCode, setCleanCode] = useState(''); 
  const formatSnippet = () => { let indent = 0; let result = ''; const lines = messyCode.replace(/{/g, '{\n').replace(/}/g, '\n}\n').replace(/;/g, ';\n').split('\n'); lines.forEach(line => { let trimmed = line.trim(); if (!trimmed) return; if (trimmed.includes('}')) indent = Math.max(0, indent - 1); result += '  '.repeat(indent) + trimmed + '\n'; if (trimmed.includes('{')) indent++; }); setCleanCode(result); };
  const [resizeSource, setResizeSource] = useState(null); const [targetWidth, setTargetWidth] = useState(800); const [resizedDataUrl, setResizedDataUrl] = useState(null); 
  const handleResize = () => { if (!resizeSource) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = targetWidth; canvas.height = img.height * (targetWidth / img.width); canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height); setResizedDataUrl(canvas.toDataURL('image/jpeg', 0.9)); }; img.src = URL.createObjectURL(resizeSource); };
  const [hashData, setHashData] = useState(''); const [hashResult, setHashResult] = useState(''); 
  const generateHash = async () => { const msgBuffer = new TextEncoder().encode(hashData); const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); setHashResult(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')); };
  const [time, setTime] = useState(0); const [timerOn, setTimerOn] = useState(false); 
  useEffect(() => { let interval = null; if (timerOn) interval = setInterval(() => setTime(prev => prev + 10), 10); else clearInterval(interval); return () => clearInterval(interval); }, [timerOn]); 
  const formatTime = (t) => { const ms = ("0" + ((t / 10) % 100)).slice(-2); const s = ("0" + Math.floor((t / 1000) % 60)).slice(-2); const m = ("0" + Math.floor((t / 60000) % 60)).slice(-2); return `${m}:${s}.${ms}`; };
  const [mongoId, setMongoId] = useState(''); const [mongoResult, setMongoResult] = useState(''); const extractMongoDate = () => { if (mongoId.length === 24) setMongoResult(new Date(parseInt(mongoId.substring(0, 8), 16) * 1000).toLocaleString()); else setMongoResult('Invalid ObjectId length.'); };
  const [jwt, setJwt] = useState(''); const [jwtData, setJwtData] = useState(''); 
  const decodeJwt = () => { try { setJwtData(JSON.stringify(JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2)); } catch (e) { setJwtData('Invalid JWT Format'); } };
  const [mdInput, setMdInput] = useState('# Hello World\n\n**Bold Text**'); const mdOutput = marked.parse(mdInput);
  const [blur, setBlur] = useState(10); const [opacity, setOpacity] = useState(0.5); const glassCss = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.3);`;
  const [hours, setHours] = useState(10); const [rate, setRate] = useState(50); const [tax, setTax] = useState(20); const [client, setClient] = useState(''); const gross = hours * rate; const net = gross - (gross * (tax / 100)); 
  const generateInvoice = () => { const doc = new jsPDF(); doc.setFontSize(22); doc.text('INVOICE', 20, 20); doc.setFontSize(12); doc.text(`Client: ${client}`, 20, 40); doc.text(`Total Hours: ${hours}`, 20, 50); doc.text(`Hourly Rate: $${rate}`, 20, 60); doc.text(`Gross Total: $${gross}`, 20, 70); doc.text(`Net (After ${tax}% Tax): $${net}`, 20, 80); doc.save(`Invoice-${client || 'Client'}.pdf`); };
  const [pomoTime, setPomoTime] = useState(25 * 60); const [pomoActive, setPomoActive] = useState(false); 
  useEffect(() => { let int = null; if (pomoActive && pomoTime > 0) int = setInterval(() => setPomoTime(p => p - 1), 1000); else clearInterval(int); return () => clearInterval(int); }, [pomoActive, pomoTime]); 
  const formatPomo = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const [recordedChunks, setRecordedChunks] = useState([]); const [isRecording, setIsRecording] = useState(false); const mediaRecorderRef = useRef(null); 
  const startRecording = async () => { try { const stream = await navigator.mediaDevices.getDisplayMedia({ video: true }); mediaRecorderRef.current = new MediaRecorder(stream); mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]); }; mediaRecorderRef.current.start(); setIsRecording(true); stream.getVideoTracks()[0].onended = () => stopRecording(); } catch (err) {} }; 
  const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); }; 
  const downloadVideo = () => { const blob = new Blob(recordedChunks, { type: 'video/webm' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'screen-recording.webm'; a.click(); setRecordedChunks([]); };
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); 
  useEffect(() => { const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
  const [svgInput, setSvgInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>'); const [pngUrl, setPngUrl] = useState(null); 
  const convertSvg = () => { const blob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' }); const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; canvas.getContext('2d').drawImage(img, 0, 0); setPngUrl(canvas.toDataURL('image/png')); }; img.src = URL.createObjectURL(blob); };
  const [sqlInput, setSqlInput] = useState('SELECT id, name, email FROM users WHERE active = 1 AND age > 21 ORDER BY created_at DESC;'); const [sqlOutput, setSqlOutput] = useState('');
  const formatSql = () => { try { const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'UNION', 'CREATE TABLE']; let formatted = sqlInput.trim(); keywords.forEach(kw => { const regex = new RegExp(`\\b${kw}\\b`, 'gi'); formatted = formatted.replace(regex, `\n${kw}`); }); formatted = formatted.replace(/,/g, ',\n  '); setSqlOutput(formatted.trim()); } catch (e) { setSqlOutput('Error formatting SQL'); } };
  const [uuidCount, setUuidCount] = useState(10); const [uuidOutput, setUuidOutput] = useState(''); const generateUuids = () => { const count = Math.min(Math.max(1, Number(uuidCount) || 10), 100); const list = Array.from({ length: count }, () => crypto.randomUUID()); setUuidOutput(list.join('\n')); };
  const [urlInput, setUrlInput] = useState('https://ilovetools.dev/search?q=developer tools&category=web dev'); const [urlOutput, setUrlOutput] = useState(''); const [urlMode, setUrlMode] = useState('encode');
  const handleUrlTransform = () => { try { if (urlMode === 'encode') setUrlOutput(encodeURIComponent(urlInput)); else setUrlOutput(decodeURIComponent(urlInput)); } catch (e) { setUrlOutput('Error: Malformed URL sequence'); } };
  const [paletteColors, setPaletteColors] = useState([]);
  const handlePaletteUpload = (e) => { const file = e.target.files[0]; if (!file) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); canvas.width = 100; canvas.height = 100; ctx.drawImage(img, 0, 0, 100, 100); const data = ctx.getImageData(0, 0, 100, 100).data; const sampled = []; for (let i = 0; i < data.length; i += 400) { const r = data[i].toString(16).padStart(2, '0'); const g = data[i+1].toString(16).padStart(2, '0'); const b = data[i+2].toString(16).padStart(2, '0'); sampled.push(`#${r}${g}${b}`); } const unique = [...new Set(sampled)].slice(0, 6); setPaletteColors(unique); }; img.src = URL.createObjectURL(file); };
  const [svgMinInput, setSvgMinInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <!-- Circle Graphic -->\n  <circle cx="50" cy="50" r="40" fill="#e94057" />\n</svg>'); const [svgMinOutput, setSvgMinOutput] = useState(''); const [svgSavings, setSvgSavings] = useState('');
  const minifySvg = () => { const originalLength = svgMinInput.length; let minified = svgMinInput.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(); setSvgMinOutput(minified); const saved = Math.round(((originalLength - minified.length) / (originalLength || 1)) * 100); setSvgSavings(`Reduced from ${originalLength} bytes to ${minified.length} bytes (${Math.max(0, saved)}% reduction)`); };
  const [aesText, setAesText] = useState('My Top Secret Message'); const [aesPass, setAesPass] = useState('securePassword123'); const [aesMode, setAesMode] = useState('encrypt'); const [aesResult, setAesResult] = useState(''); const [aesError, setAesError] = useState('');
  const handleAesProcess = async () => { setAesError(''); try { const enc = new TextEncoder(); if (aesMode === 'encrypt') { const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]); const salt = crypto.getRandomValues(new Uint8Array(16)); const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]); const iv = crypto.getRandomValues(new Uint8Array(12)); const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(aesText)); const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength); combined.set(salt, 0); combined.set(iv, salt.length); combined.set(new Uint8Array(encrypted), salt.length + iv.length); setAesResult(btoa(String.fromCharCode(...combined))); } else { const combined = Uint8Array.from(atob(aesText), c => c.charCodeAt(0)); const salt = combined.slice(0, 16); const iv = combined.slice(16, 28); const data = combined.slice(28); const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]); const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]); const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data); setAesResult(new TextDecoder().decode(decrypted)); } } catch (e) { setAesError('Decryption failed. Please verify your ciphertext and passphrase.'); } };
  const [dummyCount, setDummyCount] = useState(5); const [dummyFormat, setDummyFormat] = useState('json'); const [dummyOutput, setDummyOutput] = useState('');
  const generateMockData = () => { const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Saif', 'Elena']; const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Khan', 'Taylor']; const roles = ['Frontend Developer', 'UI/UX Designer', 'Backend Engineer', 'Product Manager', 'DevOps Engineer']; const countries = ['United States', 'Pakistan', 'United Kingdom', 'Canada', 'Germany', 'Australia']; const count = Math.min(Math.max(1, Number(dummyCount) || 5), 50); const rows = Array.from({ length: count }, (_, i) => { const fn = firstNames[Math.floor(Math.random() * firstNames.length)]; const ln = lastNames[Math.floor(Math.random() * lastNames.length)]; return { id: i + 1, fullName: `${fn} ${ln}`, email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`, role: roles[Math.floor(Math.random() * roles.length)], country: countries[Math.floor(Math.random() * countries.length)] }; }); if (dummyFormat === 'json') { setDummyOutput(JSON.stringify(rows, null, 2)); } else { const csvHeaders = 'id,fullName,email,role,country\n'; const csvRows = rows.map(r => `${r.id},"${r.fullName}","${r.email}","${r.role}","${r.country}"`).join('\n'); setDummyOutput(csvHeaders + csvRows); } };
  const [extractVideo, setExtractVideo] = useState(null); const [extractingAudio, setExtractingAudio] = useState(false); const [extractedAudioUrl, setExtractedAudioUrl] = useState(null);
  const handleExtractAudio = async () => { if (!extractVideo) return; setExtractingAudio(true); setExtractedAudioUrl(null); try { const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const arrayBuffer = await extractVideo.arrayBuffer(); const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer); const wavBlob = encodeWAV(decodedBuffer); setExtractedAudioUrl(URL.createObjectURL(wavBlob)); } catch (e) { alert('Error extracting audio.'); } setExtractingAudio(false); };
  const [audioEditFile, setAudioEditFile] = useState(null); const [audioBuffer, setAudioBuffer] = useState(null); const [audioStart, setAudioStart] = useState(0); const [audioEnd, setAudioEnd] = useState(0); const [audioVolume, setAudioVolume] = useState(100); const [audioFadeIn, setAudioFadeIn] = useState(0); const [audioFadeOut, setAudioFadeOut] = useState(0); const [audioSpeed, setAudioSpeed] = useState(1); const [audioReverse, setAudioReverse] = useState(false); const [processingAudio, setProcessingAudio] = useState(false); const [exportedAudioUrl, setExportedAudioUrl] = useState(null);
  const handleAudioLoad = async (e) => { const file = e.target.files[0]; if (file) { setAudioEditFile(file); setExportedAudioUrl(null); setAudioBuffer(null); try { const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const arrayBuffer = await file.arrayBuffer(); const buffer = await audioCtx.decodeAudioData(arrayBuffer); setAudioBuffer(buffer); setAudioStart(0); setAudioEnd(buffer.duration); } catch(err) { alert("Failed to decode audio file."); } } };
  const handleExportAudio = async () => { if (!audioBuffer) return; if (audioStart >= audioEnd) { alert("Start time must be before end time."); return; } setProcessingAudio(true); try { const startOffset = audioStart; const endOffset = audioEnd; const duration = (endOffset - startOffset) / audioSpeed; const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, Math.max(1, duration * audioBuffer.sampleRate), audioBuffer.sampleRate); const sourceNode = offlineCtx.createBufferSource(); if (audioReverse) { const reversedBuffer = offlineCtx.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate); for (let i = 0; i < audioBuffer.numberOfChannels; i++) { const destData = reversedBuffer.getChannelData(i); const srcData = audioBuffer.getChannelData(i); for (let j = 0; j < audioBuffer.length; j++) { destData[j] = srcData[audioBuffer.length - 1 - j]; } } sourceNode.buffer = reversedBuffer; } else { sourceNode.buffer = audioBuffer; } sourceNode.playbackRate.value = audioSpeed; const gainNode = offlineCtx.createGain(); gainNode.gain.value = audioVolume / 100; if (audioFadeIn > 0) { gainNode.gain.setValueAtTime(0, 0); gainNode.gain.linearRampToValueAtTime(audioVolume / 100, audioFadeIn); } if (audioFadeOut > 0) { gainNode.gain.setValueAtTime(audioVolume / 100, Math.max(0, duration - audioFadeOut)); gainNode.gain.linearRampToValueAtTime(0, duration); } sourceNode.connect(gainNode); gainNode.connect(offlineCtx.destination); let actualStart = audioReverse ? (audioBuffer.duration - endOffset) : startOffset; sourceNode.start(0, actualStart, duration * audioSpeed); const renderedBuffer = await offlineCtx.startRendering(); const wavBlob = encodeWAV(renderedBuffer); setExportedAudioUrl(URL.createObjectURL(wavBlob)); } catch (e) { alert('Error processing audio layout.'); } setProcessingAudio(false); };
  const [videoEditFile, setVideoEditFile] = useState(null); const [videoEditUrl, setVideoEditUrl] = useState(null); const [vidDuration, setVidDuration] = useState(0); const [trimStart, setTrimStart] = useState(0); const [trimEnd, setTrimEnd] = useState(0); const [vidSpeed, setVidSpeed] = useState(1); const [brightness, setBrightness] = useState(100); const [contrast, setContrast] = useState(100); const [saturation, setSaturation] = useState(100); const [sepia, setSepia] = useState(0); const [invert, setInvert] = useState(0); const [vidAspect, setVidAspect] = useState('original'); const [vidMuted, setVidMuted] = useState(false); const [vidText, setVidText] = useState(''); const [vidTextColor, setVidTextColor] = useState('#ffffff'); const [vidTextSize, setVidTextSize] = useState(48); const [vidTextPos, setVidTextPos] = useState('center'); const [videoProcessing, setVideoProcessing] = useState(false); const [videoProgress, setVideoProgress] = useState(0); const [exportedVideoUrl, setExportedVideoUrl] = useState(null); const [exportedVideoSize, setExportedVideoSize] = useState(0); const videoRef = useRef(null);
  const handleVideoLoad = (e) => { const file = e.target.files[0]; if (file) { setVideoEditFile(file); setExportedVideoUrl(null); setVideoProgress(0); const url = URL.createObjectURL(file); setVideoEditUrl(url); const tempVid = document.createElement('video'); tempVid.src = url; tempVid.onloadedmetadata = () => { setVidDuration(tempVid.duration); setTrimStart(0); setTrimEnd(tempVid.duration); }; } };
  useEffect(() => { if (videoRef.current) { videoRef.current.playbackRate = vidSpeed; } }, [vidSpeed]);
  const handleVideoExport = () => { if (!videoEditFile || !videoRef.current) return; setVideoProcessing(true); setVideoProgress(0); setExportedVideoUrl(null); const video = videoRef.current; video.currentTime = trimStart; video.playbackRate = vidSpeed; video.muted = true; const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); let sourceW = video.videoWidth; let sourceH = video.videoHeight; let sX = 0, sY = 0, sW = sourceW, sH = sourceH; if (vidAspect !== 'original') { let targetRatio = vidAspect === '16:9' ? 16/9 : (vidAspect === '9:16' ? 9/16 : 1); let vidRatio = sourceW / sourceH; if (vidRatio > targetRatio) { sW = sourceH * targetRatio; sX = (sourceW - sW) / 2; } else { sH = sourceW / targetRatio; sY = (sourceH - sH) / 2; } } let targetCanvasW = 1280; let targetCanvasH = 720; if (vidAspect === 'original') { targetCanvasW = sourceW; targetCanvasH = sourceH; } else if (vidAspect === '16:9') { targetCanvasW = 1280; targetCanvasH = 720; } else if (vidAspect === '9:16') { targetCanvasW = 720; targetCanvasH = 1280; } else if (vidAspect === '1:1') { targetCanvasW = 1080; targetCanvasH = 1080; } canvas.width = targetCanvasW; canvas.height = targetCanvasH; let combinedStream; const canvasStream = canvas.captureStream(30); try { const origStream = video.captureStream ? video.captureStream() : video.mozCaptureStream ? video.mozCaptureStream() : null; if (!vidMuted && origStream && origStream.getAudioTracks().length > 0) { combinedStream = new MediaStream([canvasStream.getVideoTracks()[0], origStream.getAudioTracks()[0]]); } else { combinedStream = canvasStream; } } catch(e) { combinedStream = canvasStream; } let recorder; try { recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: 2500000 }); } catch(e) { recorder = new MediaRecorder(combinedStream, { videoBitsPerSecond: 2500000 }); } const chunks = []; recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); }; recorder.onstop = () => { const blob = new Blob(chunks, { type: 'video/webm' }); setExportedVideoUrl(URL.createObjectURL(blob)); setExportedVideoSize(blob.size); setVideoProcessing(false); }; const drawFrame = () => { if (video.paused || video.ended || video.currentTime >= trimEnd) { recorder.stop(); video.pause(); return; } ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) invert(${invert}%)`; ctx.drawImage(video, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height); ctx.filter = 'none'; if (vidText) { ctx.fillStyle = vidTextColor; ctx.font = `bold ${vidTextSize}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; let tx = canvas.width / 2; let ty = canvas.height / 2; if (vidTextPos === 'top') ty = 50 + vidTextSize; if (vidTextPos === 'bottom') ty = canvas.height - 50 - vidTextSize; ctx.fillText(vidText, tx, ty); } const totalDuration = trimEnd - trimStart; const currentProgress = video.currentTime - trimStart; setVideoProgress(Math.max(0, Math.min(100, Math.round((currentProgress / totalDuration) * 100)))); requestAnimationFrame(drawFrame); }; video.onplay = () => { recorder.start(); drawFrame(); }; video.play().catch(e => { setVideoProcessing(false); }); };
  const [rsaPublic, setRsaPublic] = useState(''); const [rsaPrivate, setRsaPrivate] = useState('');
  const generateRSA = async () => { try { const keyPair = await window.crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]); const exportedPubKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey); const exportedPrivKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey); const exportToPem = (buffer, type) => { const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer))); return `-----BEGIN ${type}-----\n${b64.match(/.{1,64}/g).join('\n')}\n-----END ${type}-----\n`; }; setRsaPublic(exportToPem(exportedPubKey, "PUBLIC KEY")); setRsaPrivate(exportToPem(exportedPrivKey, "PRIVATE KEY")); } catch(e) { setRsaPublic('Error generating keys.'); } };
  const [exifImgSrc, setExifImgSrc] = useState(null); const [strippedImgUrl, setStrippedImgUrl] = useState(null);
  const handleExifUpload = (e) => { const file = e.target.files[0]; if(file){ const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); setStrippedImgUrl(canvas.toDataURL('image/jpeg', 1.0)); }; img.src = URL.createObjectURL(file); setExifImgSrc(img.src); } };
  const [bcryptPassInput, setBcryptPassInput] = useState(''); const [bcryptHashOut, setBcryptHashOut] = useState('');
  const generateBcrypt = () => { if(!bcryptPassInput) return; const salt = bcrypt.genSaltSync(10); setBcryptHashOut(bcrypt.hashSync(bcryptPassInput, salt)); };
  const [j2cInput, setJ2cInput] = useState('[{"name":"John","age":30}]'); const [j2cOutput, setJ2cOutput] = useState(''); const [j2cMode, setJ2cMode] = useState('json2csv');
  const runJ2c = () => { try { if (j2cMode === 'json2csv') { const obj = JSON.parse(j2cInput); const array = Array.isArray(obj) ? obj : [obj]; if(array.length === 0) return setJ2cOutput(''); const keys = Object.keys(array[0]); const csv = [keys.join(','), ...array.map(item => keys.map(k => `"${(item[k]||'').toString().replace(/"/g, '""')}"`).join(','))].join('\n'); setJ2cOutput(csv); } else { const lines = j2cInput.split('\n').filter(l => l.trim()); const headers = lines[0].split(',').map(h => h.replace(/(^"|"$)/g, '').trim()); const result = lines.slice(1).map(line => { const values = line.split(','); const obj = {}; headers.forEach((h, i) => { obj[h] = values[i] ? values[i].replace(/(^"|"$)/g, '') : ''; }); return obj; }); setJ2cOutput(JSON.stringify(result, null, 2)); } } catch (e) { setJ2cOutput('Error formatting data.'); } };
  const [diffA, setDiffA] = useState('Line 1\nLine 2'); const [diffB, setDiffB] = useState('Line 1\nLine 2 changed'); const [diffResult, setDiffResult] = useState([]);
  const runDiff = () => { setDiffResult(diffLines(diffA, diffB)); };
  const [dummyW, setDummyW] = useState(800); const [dummyH, setDummyH] = useState(600); const [dummyBg, setDummyBg] = useState('#cccccc'); const [dummyColor, setDummyColor] = useState('#666666'); const [dummyText, setDummyText] = useState(''); const [dummyImgUrl, setDummyImgUrl] = useState('');
  const genDummy = () => { const canvas = document.createElement('canvas'); canvas.width = dummyW; canvas.height = dummyH; const ctx = canvas.getContext('2d'); ctx.fillStyle = dummyBg; ctx.fillRect(0, 0, dummyW, dummyH); ctx.fillStyle = dummyColor; ctx.font = `bold ${Math.max(20, Math.floor(dummyW/10))}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(dummyText || `${dummyW} x ${dummyH}`, dummyW/2, dummyH/2); setDummyImgUrl(canvas.toDataURL('image/png')); };
  const [gifVideo, setGifVideo] = useState(null); const [gifGenerating, setGifGenerating] = useState(false); const [gifResult, setGifResult] = useState(null); const [gifW, setGifW] = useState(320); const [gifFrames, setGifFrames] = useState(30);
  const createGif = () => { if(!gifVideo) return; setGifGenerating(true); gifshot.createGIF({ 'video': [URL.createObjectURL(gifVideo)], 'numFrames': gifFrames, 'gifWidth': gifW }, function(obj) { if(!obj.error) { setGifResult(obj.image); } setGifGenerating(false); }); };
  const [boxH, setBoxH] = useState(10); const [boxV, setBoxV] = useState(10); const [boxBlur, setBoxBlur] = useState(15); const [boxSpread, setBoxSpread] = useState(0); const [boxColor, setBoxColor] = useState('#000000'); const [boxOpacity, setBoxOpacity] = useState(0.25);
  const hexToRgba = (hex, opacity) => { const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16); return `rgba(${r}, ${g}, ${b}, ${opacity})`; };
  const boxShadowCSS = `box-shadow: ${boxH}px ${boxV}px ${boxBlur}px ${boxSpread}px ${hexToRgba(boxColor, boxOpacity)};`;
  const [memoStream, setMemoStream] = useState(null); const [isRecordingMemo, setIsRecordingMemo] = useState(false); const memoChunks = useRef([]); const [memoUrl, setMemoUrl] = useState(null); const memoRecorderRef = useRef(null);
  const startMemo = async () => { try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); setMemoStream(stream); memoRecorderRef.current = new MediaRecorder(stream); memoChunks.current = []; memoRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) memoChunks.current.push(e.data); }; memoRecorderRef.current.onstop = () => { const blob = new Blob(memoChunks.current, { type: 'audio/webm' }); setMemoUrl(URL.createObjectURL(blob)); }; memoRecorderRef.current.start(); setIsRecordingMemo(true); } catch (err) { alert('Microphone access denied.'); } };
  const stopMemo = () => { if(memoRecorderRef.current) { memoRecorderRef.current.stop(); if (memoStream) { memoStream.getTracks().forEach(track => track.stop()); } } setIsRecordingMemo(false); };

  // --- SEARCH FILTER LOGIC ---
  const getFilteredCategories = () => {
    if (!searchQuery) return categories;
    const filtered = {};
    const query = searchQuery.toLowerCase();
    Object.keys(categories).forEach(cat => {
      const matchingTools = categories[cat].filter(tool => tool.name.toLowerCase().includes(query));
      if (matchingTools.length > 0) filtered[cat] = matchingTools;
    });
    return filtered;
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="container">
      <header className="header">
        
        {/* SEMANTIC HTML: Dynamic Main Heading for SEO */}
        {activeTab === 'home' ? (
          <h1>⚡ I Love Tools</h1>
        ) : (
          <div className="site-logo" style={{fontSize: '2rem', fontWeight: 'bold', margin: '0 0 10px 0'}}>⚡ I Love Tools</div>
        )}
        
        <p>100% Free, Private, Client-Side Web Utilities</p>

        {/* SEARCH BAR */}
        <div className="search-container" style={{ marginBottom: '20px' }}>
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for a tool (e.g. Video Editor, RSA, Diff, CSV)..." 
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* TOP HEADER NAVIGATION WITH DROPDOWNS */}
        <nav className="header-nav">
          {Object.keys(filteredCategories).map(category => (
            <div 
              key={category} 
              className="header-nav-item"
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="nav-category-btn"
                onClick={() => handleMobileClick(category)}
              >
                {category}
                <ChevronDown size={16} className={`chevron ${activeDropdown === category || searchQuery ? 'open' : ''}`} />
              </button>

              <div className={`header-dropdown ${activeDropdown === category || searchQuery ? 'show' : ''}`}>
                {filteredCategories[category].map(tool => (
                  // SEO UPGRADE: Replaced buttons with native <a> tags for indexable internal linking
                   <a 
                     key={tool.id} 
                     href={`/tool/${tool.id}`}
                     className={activeTab === tool.id ? 'active nav-link' : 'nav-link'} 
                     onClick={(e) => { 
                       e.preventDefault();
                       navigate(`/tool/${tool.id}`); 
                     }}
                     style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', textDecoration: 'none', color: '#1e293b' }}
                   >
                     <tool.icon size={16} /> {tool.name}
                   </a>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(filteredCategories).length === 0 && (
            <p style={{color: '#64748b', textAlign: 'center', width: '100%'}}>No tools found.</p>
          )}
        </nav>
      </header>

      {/* APP LAYOUT */}
      <div className="app-layout">
        <main className="main-content">
          <AdBanner />
          
          <div className="tool-card">

            {/* DYNAMIC HOMEPAGE GRID FOR INTERNAL LINKING & CRAWLABILITY */}
            {activeTab === 'home' && (
              <div className="home-dashboard">
                <h2 style={{fontSize: '1.8rem', marginBottom: '10px'}}>All Privacy-First Web Utilities</h2>
                <p style={{marginBottom: '30px', color: '#64748b'}}>Select a tool below. All processing happens locally on your device for absolute privacy.</p>
                
                {Object.keys(categories).map(cat => (
                  <div key={cat} style={{marginBottom: '30px'}}>
                    <h3 style={{borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px'}}>{cat}</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px'}}>
                      {categories[cat].map(tool => (
                        <a 
                          key={tool.id} 
                          href={`/tool/${tool.id}`} 
                          onClick={(e) => { e.preventDefault(); navigate(`/tool/${tool.id}`); }}
                          style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: '#f8fafc', borderRadius: '12px', textDecoration: 'none', color: '#1e293b', border: '1px solid #e2e8f0', transition: 'all 0.2s'}}
                          onMouseOver={(e) => e.currentTarget.style.borderColor = '#e94057'}
                          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                          <tool.icon size={20} color="#e94057" />
                          <span style={{fontWeight: '600'}}>{tool.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SEO UPGRADE: All tool titles changed from <h2> to <h1> */}
            
            {activeTab === 'rsa-gen' && (
              <div>
                <h1>RSA Key Pair Generator</h1>
                <button onClick={generateRSA} className="btn" style={{ marginBottom: '15px' }}><KeyRound size={16}/> Generate Secure Keys</button>
                {rsaPublic && (
                  <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                    <div>
                      <h4 style={{ marginBottom: '5px' }}>Public Key</h4>
                      <textarea rows="6" readOnly className="readonly-area" value={rsaPublic} />
                    </div>
                    <div>
                      <h4 style={{ marginBottom: '5px' }}>Private Key</h4>
                      <textarea rows="6" readOnly className="readonly-area" value={rsaPrivate} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bcrypt' && (
              <div>
                <h1>Bcrypt Password Hasher</h1>
                <input type="text" className="text-input" placeholder="Enter string to hash..." value={bcryptPassInput} onChange={(e) => setBcryptPassInput(e.target.value)} />
                <button onClick={generateBcrypt} className="btn" style={{ marginBottom: '15px' }}><Fingerprint size={16}/> Hash Password</button>
                {bcryptHashOut && <textarea rows="3" readOnly className="readonly-area" value={bcryptHashOut} />}
              </div>
            )}

            {activeTab === 'exif-strip' && (
              <div>
                <h1>EXIF Metadata Stripper</h1>
                <p className="subtitle">Remove hidden GPS coordinates, camera models, and timestamps from your photos before sharing them online.</p>
                <input type="file" accept="image/*" onChange={handleExifUpload} className="file-input" />
                {strippedImgUrl && (
                  <div className="results-grid" style={{ marginTop: '20px' }}> 
                    <div><h4>Status</h4><p>Metadata stripped successfully.</p></div> 
                    <div><h4>Safe Image</h4><p>Ready to share</p> 
                      <a href={strippedImgUrl} download="clean-image.jpg" className="btn">
                        <Download size={16} /> Download
                      </a> 
                    </div> 
                  </div> 
                )}
              </div>
            )}

            {activeTab === 'json-csv' && (
              <div>
                <h1>JSON ↔ CSV Bi-directional Converter</h1>
                <div className="button-group" style={{ marginBottom: '15px' }}>
                  <button className={j2cMode === 'json2csv' ? '' : 'inactive-btn'} onClick={() => setJ2cMode('json2csv')}>JSON to CSV</button>
                  <button className={j2cMode === 'csv2json' ? '' : 'inactive-btn'} onClick={() => setJ2cMode('csv2json')}>CSV to JSON</button>
                </div>
                <textarea rows="6" placeholder={j2cMode === 'json2csv' ? 'Paste JSON array here...' : 'Paste CSV text here...'} value={j2cInput} onChange={(e) => setJ2cInput(e.target.value)} />
                <button onClick={runJ2c} className="btn" style={{ marginBottom: '15px' }}><FileJson size={16}/> Convert Format</button>
                {j2cOutput && <textarea rows="8" readOnly className="readonly-area" value={j2cOutput} />}
              </div>
            )}

            {activeTab === 'diff-check' && (
              <div>
                <h1>Code / Text Diff Checker</h1>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', flexDirection: window.innerWidth > 768 ? 'row' : 'column' }}>
                  <textarea style={{flex: 1}} rows="6" placeholder="Original Text..." value={diffA} onChange={(e) => setDiffA(e.target.value)} />
                  <textarea style={{flex: 1}} rows="6" placeholder="New Text..." value={diffB} onChange={(e) => setDiffB(e.target.value)} />
                </div>
                <button onClick={runDiff} className="btn" style={{ marginBottom: '15px' }}><GitCompare size={16}/> Compare Differences</button>
                {diffResult.length > 0 && (
                  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left' }}>
                    {diffResult.map((part, i) => (
                      <span key={i} style={{ backgroundColor: part.added ? '#dcfce7' : part.removed ? '#fee2e2' : 'transparent', color: part.added ? '#166534' : part.removed ? '#991b1b' : '#334155' }}>
                        {part.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'box-shadow' && (
              <div>
                <h1>CSS Box Shadow Generator</h1>
                <div className="controls">
                  <label>Horizontal Offset ({boxH}px)</label>
                  <input type="range" min="-50" max="50" value={boxH} onChange={(e) => setBoxH(Number(e.target.value))} />
                  <label>Vertical Offset ({boxV}px)</label>
                  <input type="range" min="-50" max="50" value={boxV} onChange={(e) => setBoxV(Number(e.target.value))} />
                  <label>Blur Radius ({boxBlur}px)</label>
                  <input type="range" min="0" max="100" value={boxBlur} onChange={(e) => setBoxBlur(Number(e.target.value))} />
                  <label>Spread Radius ({boxSpread}px)</label>
                  <input type="range" min="-50" max="50" value={boxSpread} onChange={(e) => setBoxSpread(Number(e.target.value))} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Color</label>
                      <input type="color" className="text-input" style={{ padding: '2px', height: '42px' }} value={boxColor} onChange={(e) => setBoxColor(e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Opacity ({boxOpacity})</label>
                      <input type="range" min="0" max="1" step="0.05" value={boxOpacity} onChange={(e) => setBoxOpacity(Number(e.target.value))} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '40px', background: '#f1f5f9', borderRadius: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '150px', height: '150px', background: '#fff', borderRadius: '12px', boxShadow: `${boxH}px ${boxV}px ${boxBlur}px ${boxSpread}px ${hexToRgba(boxColor, boxOpacity)}` }}></div>
                </div>
                <textarea rows="2" readOnly className="readonly-area" value={boxShadowCSS} />
              </div>
            )}

            {activeTab === 'dummyimg' && (
              <div>
                <h1>Dummy Image Placeholder</h1>
                <div className="controls">
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Width</label>
                      <input type="number" className="text-input" value={dummyW} onChange={(e) => setDummyW(Number(e.target.value))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Height</label>
                      <input type="number" className="text-input" value={dummyH} onChange={(e) => setDummyH(Number(e.target.value))} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Background Color</label>
                      <input type="color" className="text-input" style={{ padding: '2px', height: '42px' }} value={dummyBg} onChange={(e) => setDummyBg(e.target.value)} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Text Color</label>
                      <input type="color" className="text-input" style={{ padding: '2px', height: '42px' }} value={dummyColor} onChange={(e) => setDummyColor(e.target.value)} />
                    </div>
                  </div>
                  <label>Custom Text (Optional)</label>
                  <input type="text" className="text-input" value={dummyText} onChange={(e) => setDummyText(e.target.value)} />
                </div>
                <button onClick={genDummy} className="btn" style={{ marginBottom: '15px' }}><ImagePlus size={16}/> Generate Image</button>
                {dummyImgUrl && (
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <img src={dummyImgUrl} alt="Dummy Placeholder" style={{ maxWidth: '100%', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }} />
                    <br/><a href={dummyImgUrl} download={`${dummyW}x${dummyH}.png`} className="btn"><Download size={16}/> Download PNG</a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vid2gif' && (
              <div>
                <h1>Video to GIF Converter</h1>
                <p className="subtitle" style={{marginBottom: '15px'}}>Convert short video clips into animated GIFs natively in your browser.</p>
                <input type="file" accept="video/*" onChange={(e) => { setGifVideo(e.target.files[0]); setGifResult(null); }} className="file-input" />
                <div className="controls">
                  <label>GIF Width ({gifW}px)</label>
                  <input type="range" min="100" max="800" step="10" value={gifW} onChange={(e) => setGifW(Number(e.target.value))} />
                  <label>Max Frames ({gifFrames})</label>
                  <input type="range" min="10" max="60" value={gifFrames} onChange={(e) => setGifFrames(Number(e.target.value))} />
                </div>
                <button onClick={createGif} disabled={gifGenerating || !gifVideo} className="btn" style={{ marginBottom: '15px' }}>
                  <Clapperboard size={16}/> {gifGenerating ? 'Generating GIF...' : 'Create GIF'}
                </button>
                {gifResult && (
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <img src={gifResult} alt="Generated GIF" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '15px' }} />
                    <br/><a href={gifResult} download="animated.gif" className="btn"><Download size={16}/> Download GIF</a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'voicememo' && (
              <div>
                <h1>Voice Memo / Mic Tester</h1>
                <div className="button-group">
                  {!isRecordingMemo ? (
                    <button onClick={startMemo} className="btn"><MicVocal size={16}/> Start Recording</button>
                  ) : (
                    <button onClick={stopMemo} className="btn" style={{background:'#ef4444'}}><Square size={16}/> Stop Recording</button>
                  )}
                </div>
                {isRecordingMemo && (
                  <div style={{ marginTop: '20px', color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                    Recording...
                  </div>
                )}
                {memoUrl && !isRecordingMemo && (
                  <div style={{ marginTop: '20px' }}>
                    <audio src={memoUrl} controls style={{ width: '100%', marginBottom: '15px' }} />
                    <a href={memoUrl} download="voice-memo.webm" className="btn"><Download size={16}/> Download Audio</a>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'videditor' && (
              <div>
                <h1>Mini Video Editor</h1>
                <p className="subtitle" style={{marginBottom: '15px'}}>Trim, adjust speed, crop aspect ratios, add text, and apply color grading entirely in your browser.</p>
                <input type="file" accept="video/*" onChange={handleVideoLoad} className="file-input" />
                
                {videoEditUrl && ( 
                  <>
                    <video 
                      ref={videoRef} 
                      src={videoEditUrl} 
                      controls 
                      style={{ 
                        width: '100%', 
                        maxHeight: '400px',
                        backgroundColor: '#000',
                        borderRadius: '12px', 
                        marginBottom: '10px', 
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) invert(${invert}%)`
                      }} 
                    />
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', textAlign: 'center' }}>
                      * Note: Text overlay and crop aspect ratio will be applied directly to the final exported video.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                      <div className="controls" style={{ margin: 0 }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Scissors size={16}/> Trimming & Speed</h4>
                        <label>Start Time: {trimStart}s</label>
                        <input type="range" min="0" max={vidDuration} step="0.1" value={trimStart} onChange={(e) => setTrimStart(Number(e.target.value))} />
                        <label>End Time: {trimEnd}s</label>
                        <input type="range" min="0" max={vidDuration} step="0.1" value={trimEnd} onChange={(e) => setTrimEnd(Number(e.target.value))} />
                        <label>Playback Speed ({vidSpeed}x)</label>
                        <input type="range" min="0.5" max="2" step="0.25" value={vidSpeed} onChange={(e) => setVidSpeed(Number(e.target.value))} />
                      </div>

                      <div className="controls" style={{ margin: 0 }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Crop size={16}/> Canvas & Audio</h4>
                        <label>Crop Aspect Ratio Preset</label>
                        <select className="text-input" value={vidAspect} onChange={(e) => setVidAspect(e.target.value)}>
                          <option value="original">Original Aspect Ratio</option>
                          <option value="16:9">Widescreen (16:9)</option>
                          <option value="9:16">Vertical / Reels (9:16)</option>
                          <option value="1:1">Square (1:1)</option>
                        </select>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}>
                          <input type="checkbox" checked={vidMuted} onChange={(e) => setVidMuted(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                          Mute Video Audio
                        </label>
                      </div>

                      <div className="controls" style={{ margin: 0 }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Type size={16}/> Text Overlay</h4>
                        <label>Watermark Text</label>
                        <input type="text" className="text-input" placeholder="Enter text..." value={vidText} onChange={(e) => setVidText(e.target.value)} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <label>Color</label>
                            <input type="color" className="text-input" style={{ padding: '2px', height: '42px' }} value={vidTextColor} onChange={(e) => setVidTextColor(e.target.value)} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label>Size ({vidTextSize}px)</label>
                            <input type="range" min="12" max="120" value={vidTextSize} onChange={(e) => setVidTextSize(Number(e.target.value))} />
                          </div>
                        </div>
                        <label>Position</label>
                        <select className="text-input" value={vidTextPos} onChange={(e) => setVidTextPos(e.target.value)}>
                          <option value="top">Top</option>
                          <option value="center">Center</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>

                      <div className="controls" style={{ margin: 0 }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Wand2 size={16}/> Color Filters</h4>
                        <label>Brightness ({brightness}%)</label>
                        <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
                        <label>Contrast ({contrast}%)</label>
                        <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
                        <label>Saturation ({saturation}%)</label>
                        <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
                        <label>Sepia ({sepia}%)</label>
                        <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(e.target.value)} />
                      </div>
                    </div>

                    <button onClick={handleVideoExport} disabled={videoProcessing} className="btn" style={{ marginBottom: '15px', width: '100%' }}>
                      <Film size={16}/> {videoProcessing ? `Exporting... ${videoProgress}%` : 'Export Edited Video (WebM)'}
                    </button>
                  </>
                )}

                {exportedVideoUrl && (
                  <div className="results-grid" style={{ marginTop: '20px' }}> 
                    <div><h4>Original Size</h4><p>{(videoEditFile.size / 1024 / 1024).toFixed(2)} MB</p></div> 
                    <div><h4>Exported Size</h4><p>{(exportedVideoSize / 1024 / 1024).toFixed(2)} MB</p> 
                      <a href={exportedVideoUrl} download={`edited-${videoEditFile.name.split('.')[0]}.webm`} className="btn">
                        <Download size={16} /> Download Video
                      </a> 
                    </div> 
                  </div> 
                )}
              </div>
            )}

            {activeTab === 'audioedit' && (
              <div>
                <h1>Client-Side Audio Editor</h1>
                <p className="subtitle" style={{marginBottom: '15px'}}>Trim, adjust volume, apply fades, shift speed, and reverse audio to export as a high-quality WAV.</p>
                <input type="file" accept="audio/*, video/*" onChange={handleAudioLoad} className="file-input" />
                
                {audioBuffer && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
                      <div className="controls" style={{ margin: 0 }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Scissors size={16}/> Trimming</h4>
                        <label>Start Time: {audioStart.toFixed(1)}s</label>
                        <input type="range" min="0" max={audioBuffer.duration} step="0.1" value={audioStart} onChange={(e) => setAudioStart(Number(e.target.value))} />
                        <label>End Time: {audioEnd.toFixed(1)}s (Total: {audioBuffer.duration.toFixed(1)}s)</label>
                        <input type="range" min="0" max={audioBuffer.duration} step="0.1" value={audioEnd} onChange={(e) => setAudioEnd(Number(e.target.value))} />
                      </div>

                      <div className="controls" style={{ margin: 0 }}>
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Volume2 size={16}/> Volume & Effects</h4>
                        <label>Volume ({audioVolume}%)</label>
                        <input type="range" min="0" max="200" value={audioVolume} onChange={(e) => setAudioVolume(Number(e.target.value))} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <label>Fade In (s)</label>
                            <input type="number" className="text-input" min="0" step="0.5" value={audioFadeIn} onChange={(e) => setAudioFadeIn(Number(e.target.value))} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label>Fade Out (s)</label>
                            <input type="number" className="text-input" min="0" step="0.5" value={audioFadeOut} onChange={(e) => setAudioFadeOut(Number(e.target.value))} />
                          </div>
                        </div>
                        <label>Playback Speed ({audioSpeed}x)</label>
                        <input type="range" min="0.5" max="2" step="0.25" value={audioSpeed} onChange={(e) => setAudioSpeed(Number(e.target.value))} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={audioReverse} onChange={(e) => setAudioReverse(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                          Reverse Audio
                        </label>
                      </div>
                    </div>

                    <button onClick={handleExportAudio} disabled={processingAudio} className="btn" style={{ marginBottom: '15px', width: '100%' }}>
                      <Mic size={16}/> {processingAudio ? `Processing Audio...` : 'Export Edited Audio (WAV)'}
                    </button>
                  </>
                )}

                {exportedAudioUrl && (
                  <div className="results-grid" style={{ marginTop: '20px' }}> 
                    <div><h4>Original Status</h4><p>Loaded successfully.</p></div> 
                    <div><h4>Export Ready</h4><p>WAV Format</p> 
                      <a href={exportedAudioUrl} download={`edited-${audioEditFile.name.split('.')[0]}.wav`} className="btn">
                        <Download size={16} /> Download Audio
                      </a> 
                    </div> 
                  </div> 
                )}
              </div>
            )}

            {activeTab === 'audio' && (
              <div>
                <h1>Extract Audio from Video</h1>
                <p className="subtitle" style={{marginBottom: '15px'}}>Upload any video file to perfectly rip and extract the raw audio into a high-quality WAV file. 100% Client-Side.</p>
                <input type="file" accept="video/*" onChange={(e) => { setExtractVideo(e.target.files[0]); setExtractedAudioUrl(null); }} className="file-input" />
                
                <button onClick={handleExtractAudio} disabled={extractingAudio || !extractVideo} className="btn" style={{ marginBottom: '15px' }}>
                  <Music size={16}/> {extractingAudio ? `Extracting...` : 'Extract Audio to WAV'}
                </button>

                {extractedAudioUrl && (
                  <div className="results-grid" style={{ marginTop: '20px' }}> 
                    <div><h4>Original File</h4><p>{extractVideo.name}</p></div> 
                    <div><h4>Extracted</h4><p>WAV Format</p> 
                      <a href={extractedAudioUrl} download={`extracted-${extractVideo.name.split('.')[0]}.wav`} className="btn">
                        <Download size={16} /> Download Audio
                      </a> 
                    </div> 
                  </div> 
                )}
              </div>
            )}

            {activeTab === 'json-ts' && ( <div> <h1>JSON to TypeScript Interface</h1> <textarea rows="5" value={jsonToTsInput} onChange={(e) => setJsonToTsInput(e.target.value)} /> <button onClick={convertJsonToTs} className="btn" style={{marginBottom: '15px'}}><Brackets size={16}/> Convert to TS</button> <textarea rows="7" readOnly className="readonly-area" value={tsOutput} /> </div> )}
            {activeTab === 'cron' && ( <div> <h1>Cron Expression Translator</h1> <input type="text" className="text-input" placeholder="e.g. 0 12 * * 1-5" value={cronInput} onChange={(e) => setCronInput(e.target.value)} /> <button onClick={translateCron} className="btn"><Calendar size={16}/> Translate</button> {cronResult && <div className="output-box" style={{fontSize: '1.2rem'}}>{cronResult}</div>} </div> )}
            {activeTab === 'regex' && ( <div> <h1>Regex Tester</h1> <input type="text" className="text-input" placeholder="Regex pattern (e.g. [a-z]+)" value={regexPattern} onChange={(e) => setRegexPattern(e.target.value)} /> <textarea rows="3" placeholder="Test string..." value={regexText} onChange={(e) => setRegexText(e.target.value)} /> <button onClick={testRegex} className="btn" style={{marginBottom: '15px'}}><FileSearch size={16}/> Test Matches</button> <div className="output-box" style={{fontSize: '1rem', textAlign: 'left', padding: '15px'}}>{regexResult}</div> </div> )}
            {activeTab === 'keys' && ( <div style={{textAlign: 'center'}}> <h1>JavaScript Keycode Finder</h1> <p className="subtitle">Click the input below and press any key on your keyboard.</p> <input type="text" className="text-input" style={{textAlign: 'center', fontSize: '1.5rem'}} placeholder="Press a key here..." onKeyDown={handleKeyDown} readOnly /> <div className="stats"> <div className="stat-box"><h3>{keyData.key}</h3><p>event.key</p></div> <div className="stat-box"><h3>{keyData.keyCode}</h3><p>event.keyCode</p></div> <div className="stat-box"><h3 style={{fontSize: '1.5rem', marginTop: '10px'}}>{keyData.code}</h3><p>event.code</p></div> </div> </div> )}
            {activeTab === 'ratio' && ( <div> <h1>Aspect Ratio Calculator</h1> <div className="stats"> <div className="stat-box"> <label>Original Width</label> <input type="number" className="text-input" value={arW1} onChange={(e) => setArW1(e.target.value)} /> </div> <div className="stat-box"> <label>Original Height</label> <input type="number" className="text-input" value={arH1} onChange={(e) => setArH1(e.target.value)} /> </div> </div> <div className="stats"> <div className="stat-box"> <label>New Width</label> <input type="number" className="text-input" value={arW2} onChange={(e) => setArW2(e.target.value)} /> </div> <div className="stat-box" style={{background: '#f8fafc'}}> <label>New Height (Calculated)</label> <h3 style={{marginTop: '10px'}}>{arH2} px</h3> </div> </div> </div> )}
            {activeTab === 'seo' && ( <div> <h1>SEO Meta Tag Generator</h1> <input type="text" className="text-input" placeholder="Page Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /> <textarea rows="2" placeholder="Page Description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} /> <input type="text" className="text-input" placeholder="Image URL (e.g. https://...)" value={seoImg} onChange={(e) => setSeoImg(e.target.value)} /> <h4 style={{marginBottom: '10px'}}>Generated HTML Tags:</h4> <textarea rows="7" readOnly className="readonly-area" value={seoTags} /> </div> )}
            {activeTab === 'utm' && ( <div> <h1>UTM Link Builder</h1> <input type="text" className="text-input" placeholder="Website URL" value={utmUrl} onChange={(e) => setUtmUrl(e.target.value)} /> <div className="stats" style={{marginTop: 0, marginBottom: '20px'}}> <input type="text" className="text-input" placeholder="Source (e.g. google)" value={utmSrc} onChange={(e) => setUtmSrc(e.target.value)} /> <input type="text" className="text-input" placeholder="Medium (e.g. cpc)" value={utmMed} onChange={(e) => setUtmMed(e.target.value)} /> <input type="text" className="text-input" placeholder="Campaign (e.g. sale)" value={utmCamp} onChange={(e) => setUtmCamp(e.target.value)} /> </div> <h4 style={{marginBottom: '10px'}}>Generated UTM Link:</h4> <div className="output-box" style={{fontSize: '1.1rem', padding: '15px'}}>{utmResult}</div> </div> )}
            
            {activeTab === 'image' && ( 
              <div> 
                <h1>Precise Photo Compressor</h1> 
                <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" /> 
                {originalImage && (
                  <p style={{ fontSize: '0.9rem', margin: '10px 0', color: '#64748b' }}>
                    Original Size: {(originalImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
                  <input 
                    type="number" 
                    className="text-input" 
                    style={{ flex: 1, marginBottom: 0 }} 
                    placeholder="Target size (e.g. 500)" 
                    value={targetSize} 
                    onChange={(e) => setTargetSize(e.target.value)} 
                  />
                  <select 
                    className="text-input" 
                    style={{ width: '100px', marginBottom: 0 }} 
                    value={targetUnit} 
                    onChange={(e) => setTargetUnit(e.target.value)}
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
                {compressError && <p style={{ color: '#ef4444', marginBottom: '15px' }}>{compressError}</p>}
                <button 
                  onClick={handleCompressImage} 
                  disabled={compressing || !originalImage} 
                  className="btn" 
                  style={{ marginBottom: '15px' }}
                >
                  {compressing ? 'Compressing...' : 'Compress Image'}
                </button>
                {compressedImage && ( 
                  <div className="results-grid"> 
                    <div><h4>Original</h4><p>{(originalImage.size / 1024 / 1024).toFixed(2)} MB</p></div> 
                    <div><h4>Compressed</h4><p>{(compressedImage.size / 1024 / 1024).toFixed(2)} MB</p> 
                      <a href={URL.createObjectURL(compressedImage)} download={`compressed-${originalImage.name}`} className="btn">
                        <Download size={16} /> Download
                      </a> 
                    </div> 
                  </div> 
                )} 
              </div> 
            )}

            {activeTab === 'counter' && ( <div> <h1>Word & Character Counter</h1> <textarea rows="6" value={text} onChange={(e) => setText(e.target.value)} /> <div className="stats"> <div className="stat-box"><h3>{words}</h3><p>Words</p></div> <div className="stat-box"><h3>{chars}</h3><p>Characters</p></div> </div> </div> )}
            {activeTab === 'case' && ( <div> <h1>Text Case Converter</h1> <textarea rows="5" value={caseText} onChange={(e) => setCaseText(e.target.value)} /> <div className="button-group"> <button onClick={() => setCaseText(caseText.toUpperCase())}>UPPERCASE</button> <button onClick={() => setCaseText(caseText.toLowerCase())}>lowercase</button> <button onClick={() => setCaseText(caseText.replace(/\b\w/g, c => c.toUpperCase()))}>Title Case</button> </div> </div> )}
            {activeTab === 'password' && ( <div> <h1>Secure Password Generator</h1> <div className="controls"> <label>Length: {length}</label> <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(e.target.value)} /> </div> <button onClick={generatePassword} className="btn"><RefreshCw size={16} /> Generate</button> {password && <div className="output-box"><code>{password}</code></div>} </div> )}
            {activeTab === 'qr' && ( <div> <h1>QR Code Generator</h1> <input type="text" className="text-input" value={qrText} onChange={(e) => setQrText(e.target.value)} /> <div className="qr-container"> <QRCodeCanvas value={qrText} size={200} level={"H"} /> </div> </div> )}
            {activeTab === 'base64' && ( <div> <h1>Base64 Encoder / Decoder</h1> <div className="button-group" style={{marginBottom: '15px'}}> <button className={baseMode === 'encode' ? '' : 'inactive-btn'} onClick={() => {setBaseMode('encode'); setBaseInput('');}}>Encode</button> <button className={baseMode === 'decode' ? '' : 'inactive-btn'} onClick={() => {setBaseMode('decode'); setBaseInput('');}}>Decode</button> </div> <textarea rows="4" placeholder="Input text..." value={baseInput} onChange={(e) => setBaseInput(e.target.value)} /> <h4>Result:</h4> <textarea rows="4" readOnly className="readonly-area" value={getBase64Result()} /> </div> )}
            {activeTab === 'lorem' && ( <div> <h1>Lorem Ipsum Generator</h1> <div className="controls"> <label>Paragraphs: {paragraphs}</label> <input type="range" min="1" max="10" value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /> </div> <textarea rows="8" readOnly className="readonly-area" value={generatedLorem} /> </div> )}
            {activeTab === 'spell' && ( <div> <h1>Writing Pad (Browser Spellcheck)</h1> <textarea rows="8" value={spellText} onChange={(e) => setSpellText(e.target.value)} spellCheck="true" /> <button onClick={cleanSpaces} className="btn">Clean Extra Spaces</button> </div> )}
            {activeTab === 'json' && ( <div> <h1>JSON Code Formatter</h1> <textarea rows="4" placeholder='{"example":"paste code here"}' value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} /> <button onClick={formatJson} className="btn" style={{marginBottom: '15px'}}>Format JSON</button> <textarea rows="8" readOnly className="readonly-area" value={jsonOutput} /> </div> )}
            {activeTab === 'color' && ( <div> <h1>Color Code Converter</h1> <div className="stats"> <div className="stat-box"><input type="text" className="text-input" style={{marginBottom: 0}} value={colorInput} onChange={handleColorChange} placeholder="#000000" /></div> <div className="stat-box"><h3 style={{fontSize: '1.2rem'}}>{rgbOutput}</h3></div> </div> <div style={{ marginTop: '20px', height: '100px', borderRadius: '12px', backgroundColor: rgbOutput !== 'Invalid HEX' ? colorInput : '#f1f5f9' }}></div> </div> )}
            {activeTab === 'pdfgen' && ( <div> <h1>Photos to PDF Generator</h1> <input type="file" accept="image/*" multiple onChange={(e) => setPdfImages(Array.from(e.target.files))} className="file-input" /><br/><button onClick={generatePdf} disabled={pdfImages.length === 0 || generatingPdf} className="btn">{generatingPdf ? 'Generating...' : 'Download PDF'}</button> </div> )}
            {activeTab === 'zip' && ( <div> <h1>Document Zip Compressor</h1> <input type="file" multiple onChange={(e) => { setZipFiles(Array.from(e.target.files)); setZipUrl(null); }} className="file-input" /><br/><button onClick={compressDocs} disabled={zipFiles.length === 0 || zipping} className="btn">{zipping ? 'Compressing...' : 'Create ZIP'}</button> {zipUrl && <div style={{marginTop: '20px'}}><a href={zipUrl} download="archive.zip" className="btn">Download ZIP</a></div>} </div> )}
            {activeTab === 'beautify' && ( <div> <h1>Code Beautifier</h1> <textarea rows="4" value={messyCode} onChange={(e) => setMessyCode(e.target.value)} /> <button onClick={formatSnippet} className="btn" style={{marginBottom: '15px'}}><Code2 size={16}/> Format Code</button> <textarea rows="10" readOnly className="readonly-area" value={cleanCode} /> </div> )}
            {activeTab === 'resize' && ( <div> <h1>Image Resizer</h1> <input type="file" accept="image/*" onChange={(e) => { setResizeSource(e.target.files[0]); setResizedDataUrl(null); }} className="file-input" /> <div className="controls"> <label>Width: {targetWidth}px</label> <input type="range" min="100" max="3000" value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)} /> </div> <button onClick={handleResize} disabled={!resizeSource} className="btn">Resize Image</button> {resizedDataUrl && <div style={{marginTop: '20px'}}><a href={resizedDataUrl} download="resized.jpg" className="btn">Download Resized</a></div>} </div> )}
            {activeTab === 'hash' && ( <div> <h1>SHA-256 Hash Generator</h1> <textarea rows="4" value={hashData} onChange={(e) => setHashData(e.target.value)} /> <button onClick={generateHash} className="btn">Generate Hash</button> {hashResult && <div className="output-box" style={{fontSize: '1rem'}}><code>{hashResult}</code></div>} </div> )}
            {activeTab === 'timer' && ( <div style={{textAlign: 'center'}}> <h1>Stopwatch</h1> <div style={{fontSize: '4.5rem', fontWeight: '700', margin: '30px 0'}}>{formatTime(time)}</div> <div className="button-group" style={{justifyContent: 'center'}}> {!timerOn && <button onClick={() => setTimerOn(true)} className="btn"><Play size={16}/> Start</button>} {timerOn && <button onClick={() => setTimerOn(false)} className="btn" style={{background: '#ef4444'}}><Pause size={16}/> Pause</button>} <button onClick={() => { setTimerOn(false); setTime(0); }} className="btn inactive-btn"><Square size={16}/> Reset</button> </div> </div> )}
            {activeTab === 'mongo' && ( <div> <h1>MongoDB ObjectId Extractor</h1> <input type="text" className="text-input" placeholder="e.g. 507f1f77bcf86cd799439011" value={mongoId} onChange={(e) => setMongoId(e.target.value)} /> <button onClick={extractMongoDate} className="btn"><Database size={16}/> Extract Date</button> {mongoResult && <div className="output-box">{mongoResult}</div>} </div> )}
            {activeTab === 'jwt' && ( <div> <h1>JWT Decoder</h1> <textarea rows="4" placeholder="Paste JSON Web Token..." value={jwt} onChange={(e) => setJwt(e.target.value)} /> <button onClick={decodeJwt} className="btn" style={{marginBottom:'15px'}}><LockOpen size={16}/> Decode</button> <textarea rows="6" readOnly className="readonly-area" value={jwtData} /> </div> )}
            {activeTab === 'md' && ( <div> <h1>Markdown to HTML</h1> <textarea rows="6" value={mdInput} onChange={(e) => setMdInput(e.target.value)} /> <h4 style={{marginTop:'15px'}}>Live Preview:</h4> <div style={{padding:'20px', background:'#fff', border:'1px solid #ccc', borderRadius:'12px'}} dangerouslySetInnerHTML={{ __html: mdOutput }} /> </div> )}
            {activeTab === 'glass' && ( <div> <h1>Glassmorphism CSS</h1> <div className="controls"> <label>Blur ({blur}px)</label> <input type="range" min="0" max="30" value={blur} onChange={(e) => setBlur(e.target.value)} /> <label>Opacity ({opacity})</label> <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} /> </div> <div style={{padding:'40px', background:'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85") center/cover', borderRadius:'14px', marginBottom:'20px'}}> <div style={{padding:'40px', borderRadius:'12px', background:`rgba(255,255,255,${opacity})`, backdropFilter:`blur(${blur}px)`}}> <h3 style={{color:'#fff'}}>Preview</h3> </div> </div> <textarea rows="5" readOnly className="readonly-area" value={glassCss} /> </div> )}
            {activeTab === 'freelance' && ( <div> <h1>Freelance Calculator</h1> <div className="controls"> <label>Hours: {hours}</label> <input type="range" min="1" max="160" value={hours} onChange={(e) => setHours(e.target.value)} /> <label>Rate ($): {rate}</label> <input type="range" min="10" max="200" value={rate} onChange={(e) => setRate(e.target.value)} /> <label>Tax (%): {tax}</label> <input type="range" min="0" max="50" value={tax} onChange={(e) => setTax(e.target.value)} /> </div> <div className="stats"> <div className="stat-box"><h3>${gross}</h3><p>Gross</p></div> <div className="stat-box"><h3>${net.toFixed(2)}</h3><p>Net</p></div> </div> </div> )}
            {activeTab === 'invoice' && ( <div> <h1>PDF Invoice</h1> <input type="text" className="text-input" placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} /> <button onClick={generateInvoice} className="btn"><Download size={16}/> Download PDF</button> </div> )}
            {activeTab === 'pomo' && ( <div style={{textAlign: 'center'}}> <h1>Pomodoro Timer</h1> <div style={{fontSize: '5rem', fontWeight: '700', margin: '30px 0'}}>{formatPomo(pomoTime)}</div> <div className="button-group" style={{justifyContent: 'center'}}> {!pomoActive ? <button onClick={() => setPomoActive(true)} className="btn"><Play size={16}/> Start</button> : <button onClick={() => setPomoActive(false)} className="btn" style={{background:'#ef4444'}}><Pause size={16}/> Pause</button>} <button onClick={() => { setPomoActive(false); setTime(0); }} className="btn inactive-btn"><Square size={16}/> Reset</button> </div> </div> )}
            {activeTab === 'screen' && ( <div> <h1>Screen Recorder</h1> <div className="button-group"> {!isRecording ? <button onClick={startRecording} className="btn"><Video size={16}/> Start</button> : <button onClick={stopRecording} className="btn" style={{background:'#ef4444'}}><Square size={16}/> Stop</button>} {recordedChunks.length > 0 && !isRecording && <button onClick={downloadVideo} className="btn"><Download size={16}/> Download</button>} </div> </div> )}
            {activeTab === 'viewport' && ( <div style={{textAlign: 'center'}}> <h1>Viewport Checker</h1> <div className="stats" style={{marginTop:'30px'}}> <div className="stat-box"><h3>{viewport.w} x {viewport.h}</h3><p>Resolution</p></div> <div className="stat-box"><h3>{viewport.ratio}x</h3><p>Pixel Ratio</p></div> </div> </div> )}
            {activeTab === 'svg' && ( <div> <h1>SVG to PNG</h1> <textarea rows="6" value={svgInput} onChange={(e) => setSvgInput(e.target.value)} /> <button onClick={convertSvg} className="btn" style={{marginBottom:'15px'}}><RefreshCw size={16}/> Convert</button> {pngUrl && <div><img src={pngUrl} alt="Converted PNG" style={{display:'block', marginBottom:'15px', borderRadius:'8px'}}/><a href={pngUrl} download="converted.png" className="btn"><Download size={16}/> Download PNG</a></div>} </div> )}

          </div>

          {/* DYNAMIC SEO TOOL CONTENT BLOCK */}
          {activeTab !== 'home' && currentTool && (
            <div className="seo-content" style={{ marginTop: '40px', padding: '30px', borderTop: '2px solid rgba(233, 64, 87, 0.1)', color: '#334155' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '15px' }}>About the {currentTool.name} Tool</h2>
              <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>{currentTool.description}</p>
              <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '10px' }}>Privacy First Guarantee</h3>
              <p style={{ lineHeight: '1.6' }}>
                Unlike traditional online utilities, our {currentTool.name} runs 100% locally within your browser. Your data is never collected, stored, or transmitted to external servers. Enjoy lightning-fast, secure processing without compromising your privacy.
              </p>
            </div>
          )}

          {/* HOMEPAGE SEO CONTENT BLOCK */}
          {activeTab === 'home' && (
            <div className="seo-content" style={{ marginTop: '40px', padding: '30px', borderTop: '2px solid rgba(233, 64, 87, 0.1)', color: '#334155' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '15px' }}>Why Use Client-Side Web Tools?</h2>
              <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
                When working with code, formatting data, or compressing personal media, privacy and speed are the two most important factors. Traditional online utilities force you to upload your files to remote, third-party servers. This not only risks exposing your sensitive data but also wastes time waiting for uploads and downloads.
              </p>
              <p style={{ lineHeight: '1.6' }}>
                <strong>I Love Tools</strong> is engineered differently. By utilizing modern web technologies, all 52 of our utilities run 100% locally in your browser. Whether you are generating RSA key pairs, checking a code diff, or building complex mock data layers, the processing happens directly on your device CPU. Your data is never collected, stored, or transmitted across the internet, ensuring maximum security and zero latency.
              </p>
            </div>
          )}

        </main>
      </div>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', fontSize: '0.95rem' }}>
        <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>I Love Tools &copy; {new Date().getFullYear()}</p>
        <p style={{ marginBottom: '8px' }}>Engineered for developers and designers.</p>
        <p style={{ marginBottom: '20px' }}>
          Have a suggestion for a new tool or found a bug? Let us know! <br/>
          Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=software.index.si@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e94057', textDecoration: 'none', fontWeight: '600' }}>software.index.si@gmail.com</a>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveModal('privacy')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Privacy Policy</button>
          <span>•</span>
          <button onClick={() => setActiveModal('terms')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Terms of Service</button>
          <span>•</span>
          <button onClick={() => setActiveModal('about')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>About Us</button>
        </div>
      </footer>

      {activeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setActiveModal(null)}>
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            {activeModal === 'privacy' && ( <> <h2 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '2rem' }}>Privacy Policy</h2> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>At I Love Tools (ilovetools.dev), the privacy of our visitors is our extreme priority. This Privacy Policy document outlines the types of personal information that is received and collected and how it is used.</p> <h3 style={{ margin: '20px 0 10px', fontSize: '1.2rem', color: '#1e293b' }}>Data Processing & Privacy</h3> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>All tools and utilities provided on this website operate 100% client-side. We do not upload, process, or store any of your files, images, code, or text on external servers. Everything stays on your local device.</p> <h3 style={{ margin: '20px 0 10px', fontSize: '1.2rem', color: '#1e293b' }}>Cookies and Web Beacons</h3> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>We use third-party services, including Google Analytics and Google AdSense, which may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p> <p style={{ lineHeight: '1.6', color: '#475569' }}>Users may opt-out of personalized advertising by visiting Google's Ads Settings.</p> </> )}
            {activeModal === 'terms' && ( <> <h2 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '2rem' }}>Terms of Service</h2> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>By accessing and using I Love Tools, you accept and agree to be bound by the terms and provision of this agreement.</p> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>All tools provided on this website are free to use and run entirely locally in your browser. We provide these utilities "as is" without any warranties of any kind. We are not responsible for any data loss, miscalculations, or issues that arise from using these tools.</p> <p style={{ lineHeight: '1.6', color: '#475569' }}>You agree not to use this service for any illegal or unauthorized purpose.</p> </> )}
            {activeModal === 'about' && ( <> <h2 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '2rem' }}>About Us</h2> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>I Love Tools is a centralized hub designed to help developers, designers, and everyday web users perform quick tasks without sacrificing privacy.</p> <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>Built with modern web technologies, our mission is to eliminate the need to upload sensitive files to third-party servers just to compress an image, format some code, or generate a hash.</p> <p style={{ lineHeight: '1.6', color: '#475569' }}>If you have feedback or want to request a new tool, reach out to us at <strong style={{ color: '#e94057' }}>software.index.si@gmail.com</strong>.</p> </> )}
          </div>
        </div>
      )}

      <Analytics />
      <SpeedInsights />
    </div>
  );
}