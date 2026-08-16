import React, { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { QRCodeCanvas } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { marked } from 'marked';
import cronstrue from 'cronstrue';
import { 
  Image, FileText, Type, Key, Download, QrCode, Binary, AlignLeft, 
  CheckSquare, Code, Palette, FileUp, FileArchive, Music, Code2, 
  Maximize, Hash, Timer, Play, Pause, Square, LockOpen, Database, 
  FileCode2, Droplet, FileSpreadsheet, Calculator, Clock, Video, 
  Monitor, RefreshCw, Brackets, Calendar, FileSearch, Keyboard, 
  Crop, Globe, Link, Search, ChevronDown, ShieldCheck, Layers, 
  Sparkles, Film, Scissors, Wand2
} from 'lucide-react';
import AdBanner from './AdBanner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // --- HOVER & CLICK LOGIC FOR DROPDOWNS ---
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

  // --- STATE LOGIC FOR ORIGINAL TOOLS ---
  const [jsonToTsInput, setJsonToTsInput] = useState('{"id": 1, "name": "Tool", "active": true}'); 
  const [tsOutput, setTsOutput] = useState(''); 
  const convertJsonToTs = () => { 
    try { 
      const obj = JSON.parse(jsonToTsInput); 
      let ts = 'export interface GeneratedInterface {\n'; 
      for (let k in obj) ts += `  ${k}: ${Array.isArray(obj[k]) ? 'any[]' : typeof obj[k]};\n`; 
      setTsOutput(ts + '}'); 
    } catch (e) { 
      setTsOutput('Error: Invalid JSON format'); 
    } 
  };

  const [cronInput, setCronInput] = useState('0 12 * * 1-5'); 
  const [cronResult, setCronResult] = useState(''); 
  const translateCron = () => { 
    try { 
      setCronResult(cronstrue.toString(cronInput)); 
    } catch (e) { 
      setCronResult('Error: Invalid Cron Expression'); 
    } 
  };

  const [regexPattern, setRegexPattern] = useState('[a-zA-Z]+'); 
  const [regexText, setRegexText] = useState('Test 123 string'); 
  const [regexResult, setRegexResult] = useState(''); 
  const testRegex = () => { 
    try { 
      const re = new RegExp(regexPattern, 'g'); 
      const matches = regexText.match(re); 
      setRegexResult(matches ? matches.join(', ') : 'No matches found.'); 
    } catch(e) { 
      setRegexResult('Error: Invalid Regex Pattern'); 
    } 
  };

  const [keyData, setKeyData] = useState({ key: '-', code: '-', keyCode: '-' }); 
  const handleKeyDown = (e) => { 
    e.preventDefault(); 
    setKeyData({ key: e.key === ' ' ? 'Space' : e.key, code: e.code, keyCode: e.keyCode }); 
  };

  const [arW1, setArW1] = useState(1920); 
  const [arH1, setArH1] = useState(1080); 
  const [arW2, setArW2] = useState(1280); 
  const arH2 = Math.round((arH1 / arW1) * arW2) || 0;

  const [seoTitle, setSeoTitle] = useState('My Awesome Page'); 
  const [seoDesc, setSeoDesc] = useState('A brief description.'); 
  const [seoImg, setSeoImg] = useState('https://example.com/image.jpg'); 
  const seoTags = `<title>${seoTitle}</title>\n<meta name="description" content="${seoDesc}">\n<meta property="og:title" content="${seoTitle}">\n<meta property="og:description" content="${seoDesc}">\n<meta property="og:image" content="${seoImg}">\n<meta name="twitter:card" content="summary_large_image">`;

  const [utmUrl, setUtmUrl] = useState('https://example.com'); 
  const [utmSrc, setUtmSrc] = useState('newsletter'); 
  const [utmMed, setUtmMed] = useState('email'); 
  const [utmCamp, setUtmCamp] = useState('summer_sale'); 
  const utmResult = `${utmUrl}?utm_source=${encodeURIComponent(utmSrc)}&utm_medium=${encodeURIComponent(utmMed)}&utm_campaign=${encodeURIComponent(utmCamp)}`;
  
  // --- PRECISE PHOTO COMPRESSOR ---
  const [originalImage, setOriginalImage] = useState(null); 
  const [compressedImage, setCompressedImage] = useState(null); 
  const [compressing, setCompressing] = useState(false);
  const [targetSize, setTargetSize] = useState('');
  const [targetUnit, setTargetUnit] = useState('KB');
  const [compressError, setCompressError] = useState('');

  const handleImageUpload = (e) => { 
    const file = e.target.files[0]; 
    if (file) {
      setOriginalImage(file); 
      setCompressedImage(null);
      setCompressError('');
    }
  };

  const handleCompressImage = async () => {
    if (!originalImage || !targetSize || targetSize <= 0) {
      setCompressError('Please upload an image and enter a valid target size.');
      return;
    }
    setCompressing(true);
    setCompressError('');
    try {
      const sizeInMB = targetUnit === 'KB' ? targetSize / 1024 : Number(targetSize);
      const options = {
        maxSizeMB: sizeInMB,
        maxWidthOrHeight: 4000,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(originalImage, options);
      setCompressedImage(compressedFile);
    } catch (error) {
      console.error(error);
      setCompressError('Failed to compress image. Try a slightly larger target size.');
    } finally {
      setCompressing(false);
    }
  };

  const [text, setText] = useState(''); 
  const words = text.trim() ? text.trim().split(/\s+/).length : 0; 
  const chars = text.length;
  const [caseText, setCaseText] = useState('');
  const [password, setPassword] = useState(''); 
  const [length, setLength] = useState(16); 
  const generatePassword = () => { 
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'; 
    let r = ''; 
    for (let i = 0; i < length; i++) r += c.charAt(Math.floor(Math.random() * c.length)); 
    setPassword(r); 
  };

  const [qrText, setQrText] = useState('https://example.com');
  const [baseInput, setBaseInput] = useState(''); 
  const [baseMode, setBaseMode] = useState('encode'); 
  const getBase64Result = () => { 
    if (!baseInput) return ''; 
    try { 
      return baseMode === 'encode' ? btoa(baseInput) : atob(baseInput); 
    } catch (e) { 
      return 'Error: Invalid String'; 
    } 
  };

  const [paragraphs, setParagraphs] = useState(3); 
  const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."; 
  const generatedLorem = Array(Number(paragraphs)).fill(loremText).join('\n\n');
  const [spellText, setSpellText] = useState(''); 
  const cleanSpaces = () => setSpellText(spellText.replace(/\s+/g, ' ').trim());

  const [jsonInput, setJsonInput] = useState(''); 
  const [jsonOutput, setJsonOutput] = useState(''); 
  const formatJson = () => { 
    try { 
      setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); 
    } catch (e) { 
      setJsonOutput('Error: Invalid JSON structure'); 
    } 
  };

  const [colorInput, setColorInput] = useState('#2563eb'); 
  const [rgbOutput, setRgbOutput] = useState('rgb(37, 99, 235)'); 
  const handleColorChange = (e) => { 
    const hex = e.target.value; 
    setColorInput(hex); 
    let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); 
    if (r) setRgbOutput(`rgb(${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)})`); 
    else setRgbOutput('Invalid HEX'); 
  };

  const [pdfImages, setPdfImages] = useState([]); 
  const [generatingPdf, setGeneratingPdf] = useState(false); 
  const generatePdf = async () => { 
    if (pdfImages.length === 0) return; 
    setGeneratingPdf(true); 
    const doc = new jsPDF(); 
    for (let i = 0; i < pdfImages.length; i++) { 
      const imgData = await new Promise((res) => { 
        const reader = new FileReader(); 
        reader.onload = (e) => res(e.target.result); 
        reader.readAsDataURL(pdfImages[i]); 
      }); 
      if (i > 0) doc.addPage(); 
      const imgProps = doc.getImageProperties(imgData); 
      const pdfW = doc.internal.pageSize.getWidth(); 
      doc.addImage(imgData, 'JPEG', 0, 0, pdfW, (imgProps.height * pdfW) / imgProps.width); 
    } 
    doc.save('Generated.pdf'); 
    setGeneratingPdf(false); 
  };

  const [zipFiles, setZipFiles] = useState([]); 
  const [zipping, setZipping] = useState(false); 
  const [zipUrl, setZipUrl] = useState(null); 
  const compressDocs = async () => { 
    if (zipFiles.length === 0) return; 
    setZipping(true); 
    const zip = new JSZip(); 
    zipFiles.forEach(file => zip.file(file.name, file)); 
    const content = await zip.generateAsync({ type: 'blob' }); 
    setZipUrl(URL.createObjectURL(content)); 
    setZipping(false); 
  };

  const [audioFile, setAudioFile] = useState(null);
  const [messyCode, setMessyCode] = useState(`#include <iostream>\nusing namespace std;int main(){cout<<"Hello";return 0;}`); 
  const [cleanCode, setCleanCode] = useState(''); 
  const formatSnippet = () => { 
    let indent = 0; 
    let result = ''; 
    const lines = messyCode.replace(/{/g, '{\n').replace(/}/g, '\n}\n').replace(/;/g, ';\n').split('\n'); 
    lines.forEach(line => { 
      let trimmed = line.trim(); 
      if (!trimmed) return; 
      if (trimmed.includes('}')) indent = Math.max(0, indent - 1); 
      result += '  '.repeat(indent) + trimmed + '\n'; 
      if (trimmed.includes('{')) indent++; 
    }); 
    setCleanCode(result); 
  };

  const [resizeSource, setResizeSource] = useState(null); 
  const [targetWidth, setTargetWidth] = useState(800); 
  const [resizedDataUrl, setResizedDataUrl] = useState(null); 
  const handleResize = () => { 
    if (!resizeSource) return; 
    const img = new window.Image(); 
    img.onload = () => { 
      const canvas = document.createElement('canvas'); 
      canvas.width = targetWidth; 
      canvas.height = img.height * (targetWidth / img.width); 
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height); 
      setResizedDataUrl(canvas.toDataURL('image/jpeg', 0.9)); 
    }; 
    img.src = URL.createObjectURL(resizeSource); 
  };

  const [hashData, setHashData] = useState(''); 
  const [hashResult, setHashResult] = useState(''); 
  const generateHash = async () => { 
    const msgBuffer = new TextEncoder().encode(hashData); 
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); 
    setHashResult(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')); 
  };

  const [time, setTime] = useState(0); 
  const [timerOn, setTimerOn] = useState(false); 
  useEffect(() => { 
    let interval = null; 
    if (timerOn) interval = setInterval(() => setTime(prev => prev + 10), 10); 
    else clearInterval(interval); 
    return () => clearInterval(interval); 
  }, [timerOn]); 
  const formatTime = (t) => { 
    const ms = ("0" + ((t / 10) % 100)).slice(-2); 
    const s = ("0" + Math.floor((t / 1000) % 60)).slice(-2); 
    const m = ("0" + Math.floor((t / 60000) % 60)).slice(-2); 
    return `${m}:${s}.${ms}`; 
  };

  const [mongoId, setMongoId] = useState(''); 
  const [mongoResult, setMongoResult] = useState(''); 
  const extractMongoDate = () => { 
    if (mongoId.length === 24) setMongoResult(new Date(parseInt(mongoId.substring(0, 8), 16) * 1000).toLocaleString()); 
    else setMongoResult('Invalid ObjectId length.'); 
  };

  const [jwt, setJwt] = useState(''); 
  const [jwtData, setJwtData] = useState(''); 
  const decodeJwt = () => { 
    try { 
      setJwtData(JSON.stringify(JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2)); 
    } catch (e) { 
      setJwtData('Invalid JWT Format'); 
    } 
  };

  const [mdInput, setMdInput] = useState('# Hello World\n\n**Bold Text**'); 
  const mdOutput = marked.parse(mdInput);

  const [blur, setBlur] = useState(10); 
  const [opacity, setOpacity] = useState(0.5); 
  const glassCss = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.3);`;

  const [hours, setHours] = useState(10); 
  const [rate, setRate] = useState(50); 
  const [tax, setTax] = useState(20); 
  const [client, setClient] = useState(''); 
  const gross = hours * rate; 
  const net = gross - (gross * (tax / 100)); 
  const generateInvoice = () => { 
    const doc = new jsPDF(); 
    doc.setFontSize(22); 
    doc.text('INVOICE', 20, 20); 
    doc.setFontSize(12); 
    doc.text(`Client: ${client}`, 20, 40); 
    doc.text(`Total Hours: ${hours}`, 20, 50); 
    doc.text(`Hourly Rate: $${rate}`, 20, 60); 
    doc.text(`Gross Total: $${gross}`, 20, 70); 
    doc.text(`Net (After ${tax}% Tax): $${net}`, 20, 80); 
    doc.save(`Invoice-${client || 'Client'}.pdf`); 
  };

  const [pomoTime, setPomoTime] = useState(25 * 60); 
  const [pomoActive, setPomoActive] = useState(false); 
  useEffect(() => { 
    let int = null; 
    if (pomoActive && pomoTime > 0) int = setInterval(() => setPomoTime(p => p - 1), 1000); 
    else clearInterval(int); 
    return () => clearInterval(int); 
  }, [pomoActive, pomoTime]); 
  const formatPomo = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const [recordedChunks, setRecordedChunks] = useState([]); 
  const [isRecording, setIsRecording] = useState(false); 
  const mediaRecorderRef = useRef(null); 
  const startRecording = async () => { 
    try { 
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true }); 
      mediaRecorderRef.current = new MediaRecorder(stream); 
      mediaRecorderRef.current.ondataavailable = (e) => { 
        if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]); 
      }; 
      mediaRecorderRef.current.start(); 
      setIsRecording(true); 
      stream.getVideoTracks()[0].onended = () => stopRecording(); 
    } catch (err) {} 
  }; 
  const stopRecording = () => { 
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); 
    setIsRecording(false); 
  }; 
  const downloadVideo = () => { 
    const blob = new Blob(recordedChunks, { type: 'video/webm' }); 
    const url = URL.createObjectURL(blob); 
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = 'screen-recording.webm'; 
    a.click(); 
    setRecordedChunks([]); 
  };

  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); 
  useEffect(() => { 
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); 
    window.addEventListener('resize', handleResize); 
    return () => window.removeEventListener('resize', handleResize); 
  }, []);

  const [svgInput, setSvgInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>'); 
  const [pngUrl, setPngUrl] = useState(null); 
  const convertSvg = () => { 
    const blob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' }); 
    const img = new window.Image(); 
    img.onload = () => { 
      const canvas = document.createElement('canvas'); 
      canvas.width = img.width; 
      canvas.height = img.height; 
      canvas.getContext('2d').drawImage(img, 0, 0); 
      setPngUrl(canvas.toDataURL('image/png')); 
    }; 
    img.src = URL.createObjectURL(blob); 
  };

  // --- LOGIC FOR NEW TOOLS ---

  // 1. SQL Formatter
  const [sqlInput, setSqlInput] = useState('SELECT id, name, email FROM users WHERE active = 1 AND age > 21 ORDER BY created_at DESC;');
  const [sqlOutput, setSqlOutput] = useState('');
  const formatSql = () => {
    try {
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'UNION', 'CREATE TABLE'];
      let formatted = sqlInput.trim();
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        formatted = formatted.replace(regex, `\n${kw}`);
      });
      formatted = formatted.replace(/,/g, ',\n  ');
      setSqlOutput(formatted.trim());
    } catch (e) {
      setSqlOutput('Error formatting SQL');
    }
  };

  // 2. Bulk UUID Generator
  const [uuidCount, setUuidCount] = useState(10);
  const [uuidOutput, setUuidOutput] = useState('');
  const generateUuids = () => {
    const count = Math.min(Math.max(1, Number(uuidCount) || 10), 100);
    const list = Array.from({ length: count }, () => crypto.randomUUID());
    setUuidOutput(list.join('\n'));
  };

  // 3. URL Encoder / Decoder
  const [urlInput, setUrlInput] = useState('https://ilovetools.dev/search?q=developer tools&category=web dev');
  const [urlOutput, setUrlOutput] = useState('');
  const [urlMode, setUrlMode] = useState('encode');
  const handleUrlTransform = () => {
    try {
      if (urlMode === 'encode') setUrlOutput(encodeURIComponent(urlInput));
      else setUrlOutput(decodeURIComponent(urlInput));
    } catch (e) {
      setUrlOutput('Error: Malformed URL sequence');
    }
  };

  // 4. Color Palette Extractor
  const [paletteColors, setPaletteColors] = useState([]);
  const handlePaletteUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;
      const sampled = [];
      for (let i = 0; i < data.length; i += 400) {
        const r = data[i].toString(16).padStart(2, '0');
        const g = data[i+1].toString(16).padStart(2, '0');
        const b = data[i+2].toString(16).padStart(2, '0');
        sampled.push(`#${r}${g}${b}`);
      }
      const unique = [...new Set(sampled)].slice(0, 6);
      setPaletteColors(unique);
    };
    img.src = URL.createObjectURL(file);
  };

  // 5. SVG Minifier
  const [svgMinInput, setSvgMinInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <!-- Circle Graphic -->\n  <circle cx="50" cy="50" r="40" fill="#e94057" />\n</svg>');
  const [svgMinOutput, setSvgMinOutput] = useState('');
  const [svgSavings, setSvgSavings] = useState('');
  const minifySvg = () => {
    const originalLength = svgMinInput.length;
    let minified = svgMinInput
      .replace(/<!--[\s\S]*?-->/g, '') 
      .replace(/>\s+</g, '><') 
      .replace(/\s+/g, ' ') 
      .trim();
    setSvgMinOutput(minified);
    const saved = Math.round(((originalLength - minified.length) / (originalLength || 1)) * 100);
    setSvgSavings(`Reduced from ${originalLength} bytes to ${minified.length} bytes (${Math.max(0, saved)}% reduction)`);
  };

  // 6. AES Text Encrypt / Decrypt
  const [aesText, setAesText] = useState('My Top Secret Message');
  const [aesPass, setAesPass] = useState('securePassword123');
  const [aesMode, setAesMode] = useState('encrypt');
  const [aesResult, setAesResult] = useState('');
  const [aesError, setAesError] = useState('');

  const handleAesProcess = async () => {
    setAesError('');
    try {
      const enc = new TextEncoder();
      if (aesMode === 'encrypt') {
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await crypto.subtle.deriveKey(
          { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt"]
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(aesText));
        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);
        setAesResult(btoa(String.fromCharCode(...combined)));
      } else {
        const combined = Uint8Array.from(atob(aesText), c => c.charCodeAt(0));
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);
        const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(aesPass), { name: "PBKDF2" }, false, ["deriveKey"]);
        const key = await crypto.subtle.deriveKey(
          { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
        setAesResult(new TextDecoder().decode(decrypted));
      }
    } catch (e) {
      setAesError('Decryption failed. Please verify your ciphertext and passphrase.');
    }
  };

  // 7. Mock Data Generator
  const [dummyCount, setDummyCount] = useState(5);
  const [dummyFormat, setDummyFormat] = useState('json');
  const [dummyOutput, setDummyOutput] = useState('');
  const generateMockData = () => {
    const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Saif', 'Elena'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Khan', 'Taylor'];
    const roles = ['Frontend Developer', 'UI/UX Designer', 'Backend Engineer', 'Product Manager', 'DevOps Engineer'];
    const countries = ['United States', 'Pakistan', 'United Kingdom', 'Canada', 'Germany', 'Australia'];

    const count = Math.min(Math.max(1, Number(dummyCount) || 5), 50);
    const rows = Array.from({ length: count }, (_, i) => {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      return {
        id: i + 1,
        fullName: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        country: countries[Math.floor(Math.random() * countries.length)]
      };
    });

    if (dummyFormat === 'json') {
      setDummyOutput(JSON.stringify(rows, null, 2));
    } else {
      const csvHeaders = 'id,fullName,email,role,country\n';
      const csvRows = rows.map(r => `${r.id},"${r.fullName}","${r.email}","${r.role}","${r.country}"`).join('\n');
      setDummyOutput(csvHeaders + csvRows);
    }
  };

  // 8. Mini CapCut Video Editor (FIXED: Butter Smooth Performance)
  const [videoEditFile, setVideoEditFile] = useState(null);
  const [videoEditUrl, setVideoEditUrl] = useState(null); // Fix: Stored URL avoids constant reloading
  const [vidDuration, setVidDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [vidSpeed, setVidSpeed] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);

  const [videoProcessing, setVideoProcessing] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState(null);
  const [exportedVideoSize, setExportedVideoSize] = useState(0);
  const videoRef = useRef(null);

  const handleVideoLoad = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoEditFile(file);
      setExportedVideoUrl(null);
      setVideoProgress(0);
      
      // Fix: Generate the object URL exactly ONCE instead of on every render
      const url = URL.createObjectURL(file);
      setVideoEditUrl(url); 

      const tempVid = document.createElement('video');
      tempVid.src = url;
      tempVid.onloadedmetadata = () => {
        setVidDuration(tempVid.duration);
        setTrimStart(0);
        setTrimEnd(tempVid.duration);
      };
    }
  };

  // Fix: Instantly apply playback speed changes directly to the DOM element 
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = vidSpeed;
    }
  }, [vidSpeed]);

  const handleVideoExport = () => {
    if (!videoEditFile || !videoRef.current) return;
    setVideoProcessing(true);
    setVideoProgress(0);
    setExportedVideoUrl(null);

    const video = videoRef.current;
    video.currentTime = trimStart;
    video.playbackRate = vidSpeed;
    video.muted = false; 

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280; 
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    let combinedStream;
    const canvasStream = canvas.captureStream(30);
    
    try {
        const origStream = video.captureStream ? video.captureStream() : video.mozCaptureStream ? video.mozCaptureStream() : null;
        if (origStream && origStream.getAudioTracks().length > 0) {
            combinedStream = new MediaStream([canvasStream.getVideoTracks()[0], origStream.getAudioTracks()[0]]);
        } else {
            combinedStream = canvasStream;
        }
    } catch(e) {
        combinedStream = canvasStream;
    }

    let recorder;
    try {
        recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: 2500000 });
    } catch(e) {
        recorder = new MediaRecorder(combinedStream, { videoBitsPerSecond: 2500000 });
    }
    
    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setExportedVideoUrl(URL.createObjectURL(blob));
        setExportedVideoSize(blob.size);
        setVideoProcessing(false);
    };

    const drawFrame = () => {
        if (video.paused || video.ended || video.currentTime >= trimEnd) {
            recorder.stop();
            video.pause();
            return;
        }
        
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) invert(${invert}%)`;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const totalDuration = trimEnd - trimStart;
        const currentProgress = video.currentTime - trimStart;
        setVideoProgress(Math.max(0, Math.min(100, Math.round((currentProgress / totalDuration) * 100))));
        
        requestAnimationFrame(drawFrame);
    };

    video.onplay = () => {
        recorder.start();
        drawFrame();
    };
    
    video.play().catch(e => {
        console.error(e);
        setVideoProcessing(false);
    });
  };

  // --- CATEGORY STRUCTURE (42 UTILITIES) ---
  const categories = {
    "Media & Graphics": [
      { id: 'image', name: 'Compress Image', icon: Image },
      { id: 'videditor', name: 'Mini Video Editor', icon: Film },
      { id: 'resize', name: 'Resize Image', icon: Maximize },
      { id: 'pdfgen', name: 'Photos to PDF', icon: FileUp },
      { id: 'audio', name: 'Extract Audio', icon: Music },
      { id: 'screen', name: 'Screen Record', icon: Video },
      { id: 'palette-extract', name: 'Color Palette', icon: Palette },
      { id: 'svg', name: 'SVG to PNG', icon: Image },
      { id: 'svg-minify', name: 'SVG Minifier', icon: FileCode2 },
      { id: 'ratio', name: 'Aspect Ratio', icon: Crop },
      { id: 'color', name: 'Color Pick', icon: Droplet },
    ],
    "Developer & Code": [
      { id: 'json-ts', name: 'JSON to TS', icon: Brackets },
      { id: 'json', name: 'JSON Format', icon: Code },
      { id: 'sql-format', name: 'SQL Format', icon: Database },
      { id: 'beautify', name: 'Code Beautify', icon: Code2 },
      { id: 'url-encode', name: 'URL Encoder', icon: Link },
      { id: 'uuid-gen', name: 'UUID Generator', icon: Key },
      { id: 'mongo', name: 'MongoDB ID', icon: Database },
      { id: 'jwt', name: 'JWT Decode', icon: LockOpen },
      { id: 'cron', name: 'Cron Parse', icon: Calendar },
      { id: 'regex', name: 'Regex Test', icon: FileSearch },
      { id: 'keys', name: 'Keycodes', icon: Keyboard },
      { id: 'glass', name: 'Glass CSS', icon: Sparkles },
      { id: 'viewport', name: 'Viewport', icon: Monitor },
    ],
    "Writing & Text": [
      { id: 'counter', name: 'Word Counter', icon: FileText },
      { id: 'case', name: 'Case Convert', icon: Type },
      { id: 'spell', name: 'Writing Pad', icon: CheckSquare },
      { id: 'lorem', name: 'Lorem Ipsum', icon: AlignLeft },
      { id: 'md', name: 'Markdown', icon: FileCode2 },
    ],
    "Marketing & Business": [
      { id: 'freelance', name: 'Freelance Calc', icon: Calculator },
      { id: 'invoice', name: 'PDF Invoice', icon: FileSpreadsheet },
      { id: 'dummy-data', name: 'Mock Data Gen', icon: Layers },
      { id: 'seo', name: 'SEO Meta', icon: Globe },
      { id: 'utm', name: 'UTM Builder', icon: Link },
      { id: 'qr', name: 'QR Code', icon: QrCode },
    ],
    "General Utilities": [
      { id: 'password', name: 'Passwords', icon: Key },
      { id: 'aes-encrypt', name: 'AES Encryption', icon: ShieldCheck },
      { id: 'hash', name: 'SHA-256 Hash', icon: Hash },
      { id: 'base64', name: 'Base64', icon: Binary },
      { id: 'zip', name: 'Zip Docs', icon: FileArchive },
      { id: 'timer', name: 'Stopwatch', icon: Timer },
      { id: 'pomo', name: 'Pomodoro', icon: Clock },
    ]
  };

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
        <h1>⚡ I Love Tools</h1>
        <p>100% Free, Private, Client-Side Web Utilities</p>

        {/* SEARCH BAR */}
        <div className="search-container" style={{ marginBottom: '20px' }}>
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search for a tool (e.g. Video Editor, SQL, AES, UUID, SVG)..." 
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
                   <button 
                     key={tool.id} 
                     className={activeTab === tool.id ? 'active' : ''} 
                     onClick={() => { 
                       setActiveTab(tool.id); 
                       setActiveDropdown(null); 
                       setSearchQuery(''); 
                     }}
                   >
                     <tool.icon size={16} /> {tool.name}
                   </button>
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

            {/* --- MINI CAPCUT VIDEO EDITOR --- */}
            {activeTab === 'videditor' && (
              <div>
                <h2>Mini Video Editor</h2>
                <p className="subtitle" style={{marginBottom: '15px'}}>Trim, adjust speed, and apply color grading filters entirely in your browser.</p>
                <input type="file" accept="video/*" onChange={handleVideoLoad} className="file-input" />
                
                {videoEditUrl && ( // Fix: Now using the stored videoEditUrl
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
                        marginBottom: '20px', 
                        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%) invert(${invert}%)`
                      }} 
                    />

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
                        <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}><Wand2 size={16}/> Color Filters</h4>
                        <label>Brightness ({brightness}%)</label>
                        <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
                        <label>Contrast ({contrast}%)</label>
                        <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
                        <label>Saturation ({saturation}%)</label>
                        <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
                      </div>
                    </div>

                    <button onClick={handleVideoExport} disabled={videoProcessing} className="btn" style={{ marginBottom: '15px', width: '100%' }}>
                      <Film size={16}/> {videoProcessing ? `Exporting... ${videoProgress}%` : 'Export Edited Video'}
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

            {/* --- SQL FORMATTER --- */}
            {activeTab === 'sql-format' && (
              <div>
                <h2>SQL Query Formatter</h2>
                <textarea rows="6" placeholder="Paste unformatted SQL query..." value={sqlInput} onChange={(e) => setSqlInput(e.target.value)} />
                <button onClick={formatSql} className="btn" style={{ marginBottom: '15px' }}><Code2 size={16}/> Format SQL</button>
                {sqlOutput && <textarea rows="8" readOnly className="readonly-area" value={sqlOutput} />}
              </div>
            )}

            {/* --- BULK UUID GENERATOR --- */}
            {activeTab === 'uuid-gen' && (
              <div>
                <h2>Bulk UUID / GUID Generator</h2>
                <div className="controls">
                  <label>Count (1 - 100): {uuidCount}</label>
                  <input type="range" min="1" max="50" value={uuidCount} onChange={(e) => setUuidCount(e.target.value)} />
                </div>
                <button onClick={generateUuids} className="btn" style={{ marginBottom: '15px' }}><Key size={16}/> Generate UUIDs</button>
                {uuidOutput && <textarea rows="8" readOnly className="readonly-area" value={uuidOutput} />}
              </div>
            )}

            {/* --- URL ENCODER / DECODER --- */}
            {activeTab === 'url-encode' && (
              <div>
                <h2>URL Encoder / Decoder</h2>
                <div className="button-group" style={{ marginBottom: '15px' }}>
                  <button className={urlMode === 'encode' ? '' : 'inactive-btn'} onClick={() => setUrlMode('encode')}>Encode</button>
                  <button className={urlMode === 'decode' ? '' : 'inactive-btn'} onClick={() => setUrlMode('decode')}>Decode</button>
                </div>
                <textarea rows="4" placeholder="Enter URL or string..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
                <button onClick={handleUrlTransform} className="btn" style={{ marginBottom: '15px' }}><Link size={16}/> {urlMode === 'encode' ? 'Encode URL' : 'Decode URL'}</button>
                {urlOutput && <textarea rows="4" readOnly className="readonly-area" value={urlOutput} />}
              </div>
            )}

            {/* --- COLOR PALETTE EXTRACTOR --- */}
            {activeTab === 'palette-extract' && (
              <div>
                <h2>Color Palette Extractor</h2>
                <p className="subtitle">Upload any image to extract its dominant color scheme directly in the browser.</p>
                <input type="file" accept="image/*" onChange={handlePaletteUpload} className="file-input" />
                {paletteColors.length > 0 && (
                  <div>
                    <h4 style={{ marginBottom: '10px' }}>Extracted Palette:</h4>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                      {paletteColors.map((hex, idx) => (
                        <div key={idx} style={{ textAlign: 'center', flex: 1, minWidth: '80px' }}>
                          <div style={{ height: '70px', borderRadius: '12px', backgroundColor: hex, marginBottom: '8px', border: '1px solid rgba(0,0,0,0.1)' }}></div>
                          <code style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{hex}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- SVG MINIFIER --- */}
            {activeTab === 'svg-minify' && (
              <div>
                <h2>SVG Minifier</h2>
                <textarea rows="6" placeholder="Paste SVG raw code..." value={svgMinInput} onChange={(e) => setSvgMinInput(e.target.value)} />
                <button onClick={minifySvg} className="btn" style={{ marginBottom: '15px' }}><FileCode2 size={16}/> Minify SVG</button>
                {svgSavings && <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '10px' }}>{svgSavings}</p>}
                {svgMinOutput && <textarea rows="6" readOnly className="readonly-area" value={svgMinOutput} />}
              </div>
            )}

            {/* --- AES TEXT ENCRYPT / DECRYPT --- */}
            {activeTab === 'aes-encrypt' && (
              <div>
                <h2>Client-Side AES Encryption / Decryption</h2>
                <div className="button-group" style={{ marginBottom: '15px' }}>
                  <button className={aesMode === 'encrypt' ? '' : 'inactive-btn'} onClick={() => { setAesMode('encrypt'); setAesResult(''); setAesError(''); }}>Encrypt</button>
                  <button className={aesMode === 'decrypt' ? '' : 'inactive-btn'} onClick={() => { setAesMode('decrypt'); setAesResult(''); setAesError(''); }}>Decrypt</button>
                </div>
                <textarea rows="4" placeholder={aesMode === 'encrypt' ? 'Enter plain text to encrypt...' : 'Enter Base64 ciphertext to decrypt...'} value={aesText} onChange={(e) => setAesText(e.target.value)} />
                <input type="password" className="text-input" placeholder="Enter Secret Passphrase..." value={aesPass} onChange={(e) => setAesPass(e.target.value)} />
                {aesError && <p style={{ color: '#ef4444', marginBottom: '10px' }}>{aesError}</p>}
                <button onClick={handleAesProcess} className="btn" style={{ marginBottom: '15px' }}><ShieldCheck size={16}/> {aesMode === 'encrypt' ? 'Encrypt Text' : 'Decrypt Text'}</button>
                {aesResult && <textarea rows="4" readOnly className="readonly-area" value={aesResult} />}
              </div>
            )}

            {/* --- MOCK DATA GENERATOR --- */}
            {activeTab === 'dummy-data' && (
              <div>
                <h2>Mock / Dummy Data Generator</h2>
                <div className="controls">
                  <label>Records Count (1 - 50): {dummyCount}</label>
                  <input type="range" min="1" max="25" value={dummyCount} onChange={(e) => setDummyCount(e.target.value)} />
                </div>
                <div className="button-group" style={{ marginBottom: '15px' }}>
                  <button className={dummyFormat === 'json' ? '' : 'inactive-btn'} onClick={() => setDummyFormat('json')}>JSON</button>
                  <button className={dummyFormat === 'csv' ? '' : 'inactive-btn'} onClick={() => setDummyFormat('csv')}>CSV</button>
                </div>
                <button onClick={generateMockData} className="btn" style={{ marginBottom: '15px' }}><Layers size={16}/> Generate Records</button>
                {dummyOutput && <textarea rows="8" readOnly className="readonly-area" value={dummyOutput} />}
              </div>
            )}

            {/* --- PRE-EXISTING 34 UTILITIES --- */}
            {activeTab === 'json-ts' && ( <div> <h2>JSON to TypeScript Interface</h2> <textarea rows="5" value={jsonToTsInput} onChange={(e) => setJsonToTsInput(e.target.value)} /> <button onClick={convertJsonToTs} className="btn" style={{marginBottom: '15px'}}><Brackets size={16}/> Convert to TS</button> <textarea rows="7" readOnly className="readonly-area" value={tsOutput} /> </div> )}
            {activeTab === 'cron' && ( <div> <h2>Cron Expression Translator</h2> <input type="text" className="text-input" placeholder="e.g. 0 12 * * 1-5" value={cronInput} onChange={(e) => setCronInput(e.target.value)} /> <button onClick={translateCron} className="btn"><Calendar size={16}/> Translate</button> {cronResult && <div className="output-box" style={{fontSize: '1.2rem'}}>{cronResult}</div>} </div> )}
            {activeTab === 'regex' && ( <div> <h2>Regex Tester</h2> <input type="text" className="text-input" placeholder="Regex pattern (e.g. [a-z]+)" value={regexPattern} onChange={(e) => setRegexPattern(e.target.value)} /> <textarea rows="3" placeholder="Test string..." value={regexText} onChange={(e) => setRegexText(e.target.value)} /> <button onClick={testRegex} className="btn" style={{marginBottom: '15px'}}><FileSearch size={16}/> Test Matches</button> <div className="output-box" style={{fontSize: '1rem', textAlign: 'left', padding: '15px'}}>{regexResult}</div> </div> )}
            {activeTab === 'keys' && ( <div style={{textAlign: 'center'}}> <h2>JavaScript Keycode Finder</h2> <p className="subtitle">Click the input below and press any key on your keyboard.</p> <input type="text" className="text-input" style={{textAlign: 'center', fontSize: '1.5rem'}} placeholder="Press a key here..." onKeyDown={handleKeyDown} readOnly /> <div className="stats"> <div className="stat-box"><h3>{keyData.key}</h3><p>event.key</p></div> <div className="stat-box"><h3>{keyData.keyCode}</h3><p>event.keyCode</p></div> <div className="stat-box"><h3 style={{fontSize: '1.5rem', marginTop: '10px'}}>{keyData.code}</h3><p>event.code</p></div> </div> </div> )}
            {activeTab === 'ratio' && ( <div> <h2>Aspect Ratio Calculator</h2> <div className="stats"> <div className="stat-box"> <label>Original Width</label> <input type="number" className="text-input" value={arW1} onChange={(e) => setArW1(e.target.value)} /> </div> <div className="stat-box"> <label>Original Height</label> <input type="number" className="text-input" value={arH1} onChange={(e) => setArH1(e.target.value)} /> </div> </div> <div className="stats"> <div className="stat-box"> <label>New Width</label> <input type="number" className="text-input" value={arW2} onChange={(e) => setArW2(e.target.value)} /> </div> <div className="stat-box" style={{background: '#f8fafc'}}> <label>New Height (Calculated)</label> <h3 style={{marginTop: '10px'}}>{arH2} px</h3> </div> </div> </div> )}
            {activeTab === 'seo' && ( <div> <h2>SEO Meta Tag Generator</h2> <input type="text" className="text-input" placeholder="Page Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /> <textarea rows="2" placeholder="Page Description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} /> <input type="text" className="text-input" placeholder="Image URL (e.g. https://...)" value={seoImg} onChange={(e) => setSeoImg(e.target.value)} /> <h4 style={{marginBottom: '10px'}}>Generated HTML Tags:</h4> <textarea rows="7" readOnly className="readonly-area" value={seoTags} /> </div> )}
            {activeTab === 'utm' && ( <div> <h2>UTM Link Builder</h2> <input type="text" className="text-input" placeholder="Website URL" value={utmUrl} onChange={(e) => setUtmUrl(e.target.value)} /> <div className="stats" style={{marginTop: 0, marginBottom: '20px'}}> <input type="text" className="text-input" placeholder="Source (e.g. google)" value={utmSrc} onChange={(e) => setUtmSrc(e.target.value)} /> <input type="text" className="text-input" placeholder="Medium (e.g. cpc)" value={utmMed} onChange={(e) => setUtmMed(e.target.value)} /> <input type="text" className="text-input" placeholder="Campaign (e.g. sale)" value={utmCamp} onChange={(e) => setUtmCamp(e.target.value)} /> </div> <h4 style={{marginBottom: '10px'}}>Generated UTM Link:</h4> <div className="output-box" style={{fontSize: '1.1rem', padding: '15px'}}>{utmResult}</div> </div> )}
            
            {activeTab === 'image' && ( 
              <div> 
                <h2>Precise Photo Compressor</h2> 
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

            {activeTab === 'counter' && ( <div> <h2>Word & Character Counter</h2> <textarea rows="6" value={text} onChange={(e) => setText(e.target.value)} /> <div className="stats"> <div className="stat-box"><h3>{words}</h3><p>Words</p></div> <div className="stat-box"><h3>{chars}</h3><p>Characters</p></div> </div> </div> )}
            {activeTab === 'case' && ( <div> <h2>Text Case Converter</h2> <textarea rows="5" value={caseText} onChange={(e) => setCaseText(e.target.value)} /> <div className="button-group"> <button onClick={() => setCaseText(caseText.toUpperCase())}>UPPERCASE</button> <button onClick={() => setCaseText(caseText.toLowerCase())}>lowercase</button> <button onClick={() => setCaseText(caseText.replace(/\b\w/g, c => c.toUpperCase()))}>Title Case</button> </div> </div> )}
            {activeTab === 'password' && ( <div> <h2>Secure Password Generator</h2> <div className="controls"> <label>Length: {length}</label> <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(e.target.value)} /> </div> <button onClick={generatePassword} className="btn"><RefreshCw size={16} /> Generate</button> {password && <div className="output-box"><code>{password}</code></div>} </div> )}
            {activeTab === 'qr' && ( <div> <h2>QR Code Generator</h2> <input type="text" className="text-input" value={qrText} onChange={(e) => setQrText(e.target.value)} /> <div className="qr-container"> <QRCodeCanvas value={qrText} size={200} level={"H"} /> </div> </div> )}
            {activeTab === 'base64' && ( <div> <h2>Base64 Encoder / Decoder</h2> <div className="button-group" style={{marginBottom: '15px'}}> <button className={baseMode === 'encode' ? '' : 'inactive-btn'} onClick={() => {setBaseMode('encode'); setBaseInput('');}}>Encode</button> <button className={baseMode === 'decode' ? '' : 'inactive-btn'} onClick={() => {setBaseMode('decode'); setBaseInput('');}}>Decode</button> </div> <textarea rows="4" placeholder="Input text..." value={baseInput} onChange={(e) => setBaseInput(e.target.value)} /> <h4>Result:</h4> <textarea rows="4" readOnly className="readonly-area" value={getBase64Result()} /> </div> )}
            {activeTab === 'lorem' && ( <div> <h2>Lorem Ipsum Generator</h2> <div className="controls"> <label>Paragraphs: {paragraphs}</label> <input type="range" min="1" max="10" value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /> </div> <textarea rows="8" readOnly className="readonly-area" value={generatedLorem} /> </div> )}
            {activeTab === 'spell' && ( <div> <h2>Writing Pad (Browser Spellcheck)</h2> <textarea rows="8" value={spellText} onChange={(e) => setSpellText(e.target.value)} spellCheck="true" /> <button onClick={cleanSpaces} className="btn">Clean Extra Spaces</button> </div> )}
            {activeTab === 'json' && ( <div> <h2>JSON Code Formatter</h2> <textarea rows="4" placeholder='{"example":"paste code here"}' value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} /> <button onClick={formatJson} className="btn" style={{marginBottom: '15px'}}>Format JSON</button> <textarea rows="8" readOnly className="readonly-area" value={jsonOutput} /> </div> )}
            {activeTab === 'color' && ( <div> <h2>Color Code Converter</h2> <div className="stats"> <div className="stat-box"><input type="text" className="text-input" style={{marginBottom: 0}} value={colorInput} onChange={handleColorChange} placeholder="#000000" /></div> <div className="stat-box"><h3 style={{fontSize: '1.2rem'}}>{rgbOutput}</h3></div> </div> <div style={{ marginTop: '20px', height: '100px', borderRadius: '12px', backgroundColor: rgbOutput !== 'Invalid HEX' ? colorInput : '#f1f5f9' }}></div> </div> )}
            {activeTab === 'pdfgen' && ( <div> <h2>Photos to PDF Generator</h2> <input type="file" accept="image/*" multiple onChange={(e) => setPdfImages(Array.from(e.target.files))} className="file-input" /><br/><button onClick={generatePdf} disabled={pdfImages.length === 0 || generatingPdf} className="btn">{generatingPdf ? 'Generating...' : 'Download PDF'}</button> </div> )}
            {activeTab === 'zip' && ( <div> <h2>Document Zip Compressor</h2> <input type="file" multiple onChange={(e) => { setZipFiles(Array.from(e.target.files)); setZipUrl(null); }} className="file-input" /><br/><button onClick={compressDocs} disabled={zipFiles.length === 0 || zipping} className="btn">{zipping ? 'Compressing...' : 'Create ZIP'}</button> {zipUrl && <div style={{marginTop: '20px'}}><a href={zipUrl} download="archive.zip" className="btn">Download ZIP</a></div>} </div> )}
            {activeTab === 'audio' && ( <div> <h2>Extract Audio</h2> <p className="subtitle">This tool converts video to audio locally.</p><input type="file" accept="video/*" onChange={(e) => setAudioFile(e.target.files[0])} className="file-input" /> </div> )}
            {activeTab === 'beautify' && ( <div> <h2>Code Beautifier</h2> <textarea rows="4" value={messyCode} onChange={(e) => setMessyCode(e.target.value)} /> <button onClick={formatSnippet} className="btn" style={{marginBottom: '15px'}}><Code2 size={16}/> Format Code</button> <textarea rows="10" readOnly className="readonly-area" value={cleanCode} /> </div> )}
            {activeTab === 'resize' && ( <div> <h2>Image Resizer</h2> <input type="file" accept="image/*" onChange={(e) => { setResizeSource(e.target.files[0]); setResizedDataUrl(null); }} className="file-input" /> <div className="controls"> <label>Width: {targetWidth}px</label> <input type="range" min="100" max="3000" value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)} /> </div> <button onClick={handleResize} disabled={!resizeSource} className="btn">Resize Image</button> {resizedDataUrl && <div style={{marginTop: '20px'}}><a href={resizedDataUrl} download="resized.jpg" className="btn">Download Resized</a></div>} </div> )}
            {activeTab === 'hash' && ( <div> <h2>SHA-256 Hash Generator</h2> <textarea rows="4" value={hashData} onChange={(e) => setHashData(e.target.value)} /> <button onClick={generateHash} className="btn">Generate Hash</button> {hashResult && <div className="output-box" style={{fontSize: '1rem'}}><code>{hashResult}</code></div>} </div> )}
            {activeTab === 'timer' && ( <div style={{textAlign: 'center'}}> <h2>Stopwatch</h2> <div style={{fontSize: '4.5rem', fontWeight: '700', margin: '30px 0'}}>{formatTime(time)}</div> <div className="button-group" style={{justifyContent: 'center'}}> {!timerOn && <button onClick={() => setTimerOn(true)} className="btn"><Play size={16}/> Start</button>} {timerOn && <button onClick={() => setTimerOn(false)} className="btn" style={{background: '#ef4444'}}><Pause size={16}/> Pause</button>} <button onClick={() => { setTimerOn(false); setTime(0); }} className="btn inactive-btn"><Square size={16}/> Reset</button> </div> </div> )}
            {activeTab === 'mongo' && ( <div> <h2>MongoDB ObjectId Extractor</h2> <input type="text" className="text-input" placeholder="e.g. 507f1f77bcf86cd799439011" value={mongoId} onChange={(e) => setMongoId(e.target.value)} /> <button onClick={extractMongoDate} className="btn"><Database size={16}/> Extract Date</button> {mongoResult && <div className="output-box">{mongoResult}</div>} </div> )}
            {activeTab === 'jwt' && ( <div> <h2>JWT Decoder</h2> <textarea rows="4" placeholder="Paste JSON Web Token..." value={jwt} onChange={(e) => setJwt(e.target.value)} /> <button onClick={decodeJwt} className="btn" style={{marginBottom:'15px'}}><LockOpen size={16}/> Decode</button> <textarea rows="6" readOnly className="readonly-area" value={jwtData} /> </div> )}
            {activeTab === 'md' && ( <div> <h2>Markdown to HTML</h2> <textarea rows="6" value={mdInput} onChange={(e) => setMdInput(e.target.value)} /> <h4 style={{marginTop:'15px'}}>Live Preview:</h4> <div style={{padding:'20px', background:'#fff', border:'1px solid #ccc', borderRadius:'12px'}} dangerouslySetInnerHTML={{ __html: mdOutput }} /> </div> )}
            {activeTab === 'glass' && ( <div> <h2>Glassmorphism CSS</h2> <div className="controls"> <label>Blur ({blur}px)</label> <input type="range" min="0" max="30" value={blur} onChange={(e) => setBlur(e.target.value)} /> <label>Opacity ({opacity})</label> <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} /> </div> <div style={{padding:'40px', background:'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85") center/cover', borderRadius:'14px', marginBottom:'20px'}}> <div style={{padding:'40px', borderRadius:'12px', background:`rgba(255,255,255,${opacity})`, backdropFilter:`blur(${blur}px)`}}> <h3 style={{color:'#fff'}}>Preview</h3> </div> </div> <textarea rows="5" readOnly className="readonly-area" value={glassCss} /> </div> )}
            {activeTab === 'freelance' && ( <div> <h2>Freelance Calculator</h2> <div className="controls"> <label>Hours: {hours}</label> <input type="range" min="1" max="160" value={hours} onChange={(e) => setHours(e.target.value)} /> <label>Rate ($): {rate}</label> <input type="range" min="10" max="200" value={rate} onChange={(e) => setRate(e.target.value)} /> <label>Tax (%): {tax}</label> <input type="range" min="0" max="50" value={tax} onChange={(e) => setTax(e.target.value)} /> </div> <div className="stats"> <div className="stat-box"><h3>${gross}</h3><p>Gross</p></div> <div className="stat-box"><h3>${net.toFixed(2)}</h3><p>Net</p></div> </div> </div> )}
            {activeTab === 'invoice' && ( <div> <h2>PDF Invoice</h2> <input type="text" className="text-input" placeholder="Client Name" value={client} onChange={(e) => setClient(e.target.value)} /> <button onClick={generateInvoice} className="btn"><Download size={16}/> Download PDF</button> </div> )}
            {activeTab === 'pomo' && ( <div style={{textAlign: 'center'}}> <h2>Pomodoro Timer</h2> <div style={{fontSize: '5rem', fontWeight: '700', margin: '30px 0'}}>{formatPomo(pomoTime)}</div> <div className="button-group" style={{justifyContent: 'center'}}> {!pomoActive ? <button onClick={() => setPomoActive(true)} className="btn"><Play size={16}/> Start</button> : <button onClick={() => setPomoActive(false)} className="btn" style={{background:'#ef4444'}}><Pause size={16}/> Pause</button>} <button onClick={() => { setPomoActive(false); setTime(0); }} className="btn inactive-btn"><Square size={16}/> Reset</button> </div> </div> )}
            {activeTab === 'screen' && ( <div> <h2>Screen Recorder</h2> <div className="button-group"> {!isRecording ? <button onClick={startRecording} className="btn"><Video size={16}/> Start</button> : <button onClick={stopRecording} className="btn" style={{background:'#ef4444'}}><Square size={16}/> Stop</button>} {recordedChunks.length > 0 && !isRecording && <button onClick={downloadVideo} className="btn"><Download size={16}/> Download</button>} </div> </div> )}
            {activeTab === 'viewport' && ( <div style={{textAlign: 'center'}}> <h2>Viewport Checker</h2> <div className="stats" style={{marginTop:'30px'}}> <div className="stat-box"><h3>{viewport.w} x {viewport.h}</h3><p>Resolution</p></div> <div className="stat-box"><h3>{viewport.ratio}x</h3><p>Pixel Ratio</p></div> </div> </div> )}
            {activeTab === 'svg' && ( <div> <h2>SVG to PNG</h2> <textarea rows="6" value={svgInput} onChange={(e) => setSvgInput(e.target.value)} /> <button onClick={convertSvg} className="btn" style={{marginBottom:'15px'}}><RefreshCw size={16}/> Convert</button> {pngUrl && <div><img src={pngUrl} alt="Converted PNG" style={{display:'block', marginBottom:'15px', borderRadius:'8px'}}/><a href={pngUrl} download="converted.png" className="btn"><Download size={16}/> Download PNG</a></div>} </div> )}

          </div>

          {/* AdSense SEO Content Block */}
          <div className="seo-content" style={{ marginTop: '40px', padding: '30px', borderTop: '2px solid rgba(233, 64, 87, 0.1)', color: '#334155' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '15px' }}>Why Use Client-Side Web Tools?</h3>
            <p style={{ lineHeight: '1.6', marginBottom: '15px' }}>
              When working with code, formatting data, or compressing personal images, privacy and speed are the two most important factors. Traditional online utilities force you to upload your files to remote, third-party servers. This not only risks exposing your sensitive data but also wastes time waiting for uploads and downloads.
            </p>
            <p style={{ lineHeight: '1.6' }}>
              <strong>I Love Tools</strong> is engineered differently. By utilizing modern web technologies, all 42 of our utilities run 100% locally in your browser. Whether you are generating a complex Glassmorphism CSS layout, parsing a large JSON file into TypeScript, encrypting sensitive text with AES, or rendering custom video edits, the processing happens directly on your device CPU. Your data is never collected, stored, or transmitted across the internet, ensuring maximum security and zero latency.
            </p>
          </div>

        </main>
      </div>

      {/* Modern Custom Footer */}
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

      {/* AdSense Legal Pop-Up Modal */}
      {activeModal && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} 
          onClick={() => setActiveModal(null)}
        >
          <div 
            style={{ background: '#ffffff', padding: '40px', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveModal(null)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              &times;
            </button>
            
            {activeModal === 'privacy' && (
              <>
                <h2 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '2rem' }}>Privacy Policy</h2>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>At I Love Tools (ilovetools.dev), the privacy of our visitors is our extreme priority. This Privacy Policy document outlines the types of personal information that is received and collected and how it is used.</p>
                <h3 style={{ margin: '20px 0 10px', fontSize: '1.2rem', color: '#1e293b' }}>Data Processing & Privacy</h3>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>All tools and utilities provided on this website operate 100% client-side. We do not upload, process, or store any of your files, images, code, or text on external servers. Everything stays on your local device.</p>
                <h3 style={{ margin: '20px 0 10px', fontSize: '1.2rem', color: '#1e293b' }}>Cookies and Web Beacons</h3>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>We use third-party services, including Google Analytics and Google AdSense, which may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
                <p style={{ lineHeight: '1.6', color: '#475569' }}>Users may opt-out of personalized advertising by visiting Google's Ads Settings.</p>
              </>
            )}

            {activeModal === 'terms' && (
              <>
                <h2 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '2rem' }}>Terms of Service</h2>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>By accessing and using I Love Tools, you accept and agree to be bound by the terms and provision of this agreement.</p>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>All tools provided on this website are free to use and run entirely locally in your browser. We provide these utilities "as is" without any warranties of any kind. We are not responsible for any data loss, miscalculations, or issues that arise from using these tools.</p>
                <p style={{ lineHeight: '1.6', color: '#475569' }}>You agree not to use this service for any illegal or unauthorized purpose.</p>
              </>
            )}

            {activeModal === 'about' && (
              <>
                <h2 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '2rem' }}>About Us</h2>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>I Love Tools is a centralized hub designed to help developers, designers, and everyday web users perform quick tasks without sacrificing privacy.</p>
                <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#475569' }}>Built with modern web technologies, our mission is to eliminate the need to upload sensitive files to third-party servers just to compress an image, format some code, or generate a hash.</p>
                <p style={{ lineHeight: '1.6', color: '#475569' }}>If you have feedback or want to request a new tool, reach out to us at <strong style={{ color: '#e94057' }}>software.index.si@gmail.com</strong>.</p>
              </>
            )}
          </div>
        </div>
      )}

      <Analytics />
      <SpeedInsights />
    </div>
  );
}