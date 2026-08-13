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
  Crop, Globe, Link, Search, ChevronDown
} from 'lucide-react';
import AdBanner from './AdBanner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  // --- STATE LOGIC FOR ALL 34 TOOLS ---
  const [jsonToTsInput, setJsonToTsInput] = useState('{"id": 1, "name": "Tool", "active": true}'); const [tsOutput, setTsOutput] = useState(''); const convertJsonToTs = () => { try { const obj = JSON.parse(jsonToTsInput); let ts = 'export interface GeneratedInterface {\n'; for (let k in obj) ts += `  ${k}: ${Array.isArray(obj[k]) ? 'any[]' : typeof obj[k]};\n`; setTsOutput(ts + '}'); } catch (e) { setTsOutput('Error: Invalid JSON format'); } };
  const [cronInput, setCronInput] = useState('0 12 * * 1-5'); const [cronResult, setCronResult] = useState(''); const translateCron = () => { try { setCronResult(cronstrue.toString(cronInput)); } catch (e) { setCronResult('Error: Invalid Cron Expression'); } };
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z]+'); const [regexText, setRegexText] = useState('Test 123 string'); const [regexResult, setRegexResult] = useState(''); const testRegex = () => { try { const re = new RegExp(regexPattern, 'g'); const matches = regexText.match(re); setRegexResult(matches ? matches.join(', ') : 'No matches found.'); } catch(e) { setRegexResult('Error: Invalid Regex Pattern'); } };
  const [keyData, setKeyData] = useState({ key: '-', code: '-', keyCode: '-' }); const handleKeyDown = (e) => { e.preventDefault(); setKeyData({ key: e.key === ' ' ? 'Space' : e.key, code: e.code, keyCode: e.keyCode }); };
  const [arW1, setArW1] = useState(1920); const [arH1, setArH1] = useState(1080); const [arW2, setArW2] = useState(1280); const arH2 = Math.round((arH1 / arW1) * arW2) || 0;
  const [seoTitle, setSeoTitle] = useState('My Awesome Page'); const [seoDesc, setSeoDesc] = useState('A brief description.'); const [seoImg, setSeoImg] = useState('https://example.com/image.jpg'); const seoTags = `<title>${seoTitle}</title>\n<meta name="description" content="${seoDesc}">\n<meta property="og:title" content="${seoTitle}">\n<meta property="og:description" content="${seoDesc}">\n<meta property="og:image" content="${seoImg}">\n<meta name="twitter:card" content="summary_large_image">`;
  const [utmUrl, setUtmUrl] = useState('https://example.com'); const [utmSrc, setUtmSrc] = useState('newsletter'); const [utmMed, setUtmMed] = useState('email'); const [utmCamp, setUtmCamp] = useState('summer_sale'); const utmResult = `${utmUrl}?utm_source=${encodeURIComponent(utmSrc)}&utm_medium=${encodeURIComponent(utmMed)}&utm_campaign=${encodeURIComponent(utmCamp)}`;
  const [originalImage, setOriginalImage] = useState(null); const [compressedImage, setCompressedImage] = useState(null); const [compressing, setCompressing] = useState(false); const handleImageUpload = async (e) => { const file = e.target.files[0]; if (!file) return; setOriginalImage(file); setCompressing(true); try { setCompressedImage(await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true })); } catch (error) {} finally { setCompressing(false); } };
  const [text, setText] = useState(''); const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length;
  const [caseText, setCaseText] = useState('');
  const [password, setPassword] = useState(''); const [length, setLength] = useState(16); const generatePassword = () => { const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'; let r = ''; for (let i = 0; i < length; i++) r += c.charAt(Math.floor(Math.random() * c.length)); setPassword(r); };
  const [qrText, setQrText] = useState('https://example.com');
  const [baseInput, setBaseInput] = useState(''); const [baseMode, setBaseMode] = useState('encode'); const getBase64Result = () => { if (!baseInput) return ''; try { return baseMode === 'encode' ? btoa(baseInput) : atob(baseInput); } catch (e) { return 'Error: Invalid String'; } };
  const [paragraphs, setParagraphs] = useState(3); const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."; const generatedLorem = Array(Number(paragraphs)).fill(loremText).join('\n\n');
  const [spellText, setSpellText] = useState(''); const cleanSpaces = () => setSpellText(spellText.replace(/\s+/g, ' ').trim());
  const [jsonInput, setJsonInput] = useState(''); const [jsonOutput, setJsonOutput] = useState(''); const formatJson = () => { try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); } catch (e) { setJsonOutput('Error: Invalid JSON structure'); } };
  const [colorInput, setColorInput] = useState('#2563eb'); const [rgbOutput, setRgbOutput] = useState('rgb(37, 99, 235)'); const handleColorChange = (e) => { const hex = e.target.value; setColorInput(hex); let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (r) setRgbOutput(`rgb(${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)})`); else setRgbOutput('Invalid HEX'); };
  const [pdfImages, setPdfImages] = useState([]); const [generatingPdf, setGeneratingPdf] = useState(false); const generatePdf = async () => { if (pdfImages.length === 0) return; setGeneratingPdf(true); const doc = new jsPDF(); for (let i = 0; i < pdfImages.length; i++) { const imgData = await new Promise((res) => { const reader = new FileReader(); reader.onload = (e) => res(e.target.result); reader.readAsDataURL(pdfImages[i]); }); if (i > 0) doc.addPage(); const imgProps = doc.getImageProperties(imgData); const pdfW = doc.internal.pageSize.getWidth(); doc.addImage(imgData, 'JPEG', 0, 0, pdfW, (imgProps.height * pdfW) / imgProps.width); } doc.save('Generated.pdf'); setGeneratingPdf(false); };
  const [zipFiles, setZipFiles] = useState([]); const [zipping, setZipping] = useState(false); const [zipUrl, setZipUrl] = useState(null); const compressDocs = async () => { if (zipFiles.length === 0) return; setZipping(true); const zip = new JSZip(); zipFiles.forEach(file => zip.file(file.name, file)); const content = await zip.generateAsync({ type: 'blob' }); setZipUrl(URL.createObjectURL(content)); setZipping(false); };
  const [audioFile, setAudioFile] = useState(null);
  const [messyCode, setMessyCode] = useState(`#include <iostream>\nusing namespace std;int main(){cout<<"Hello";return 0;}`); const [cleanCode, setCleanCode] = useState(''); const formatSnippet = () => { let indent = 0; let result = ''; const lines = messyCode.replace(/{/g, '{\n').replace(/}/g, '\n}\n').replace(/;/g, ';\n').split('\n'); lines.forEach(line => { let trimmed = line.trim(); if (!trimmed) return; if (trimmed.includes('}')) indent = Math.max(0, indent - 1); result += '  '.repeat(indent) + trimmed + '\n'; if (trimmed.includes('{')) indent++; }); setCleanCode(result); };
  const [resizeSource, setResizeSource] = useState(null); const [targetWidth, setTargetWidth] = useState(800); const [resizedDataUrl, setResizedDataUrl] = useState(null); const handleResize = () => { if (!resizeSource) return; const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = targetWidth; canvas.height = img.height * (targetWidth / img.width); canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height); setResizedDataUrl(canvas.toDataURL('image/jpeg', 0.9)); }; img.src = URL.createObjectURL(resizeSource); };
  const [hashData, setHashData] = useState(''); const [hashResult, setHashResult] = useState(''); const generateHash = async () => { const msgBuffer = new TextEncoder().encode(hashData); const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); setHashResult(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')); };
  const [time, setTime] = useState(0); const [timerOn, setTimerOn] = useState(false); useEffect(() => { let interval = null; if (timerOn) interval = setInterval(() => setTime(prev => prev + 10), 10); else clearInterval(interval); return () => clearInterval(interval); }, [timerOn]); const formatTime = (t) => { const ms = ("0" + ((t / 10) % 100)).slice(-2); const s = ("0" + Math.floor((t / 1000) % 60)).slice(-2); const m = ("0" + Math.floor((t / 60000) % 60)).slice(-2); return `${m}:${s}.${ms}`; };
  const [mongoId, setMongoId] = useState(''); const [mongoResult, setMongoResult] = useState(''); const extractMongoDate = () => { if (mongoId.length === 24) setMongoResult(new Date(parseInt(mongoId.substring(0, 8), 16) * 1000).toLocaleString()); else setMongoResult('Invalid ObjectId length.'); };
  const [jwt, setJwt] = useState(''); const [jwtData, setJwtData] = useState(''); const decodeJwt = () => { try { setJwtData(JSON.stringify(JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))), null, 2)); } catch (e) { setJwtData('Invalid JWT Format'); } };
  const [mdInput, setMdInput] = useState('# Hello World\n\n**Bold Text**'); const mdOutput = marked.parse(mdInput);
  const [blur, setBlur] = useState(10); const [opacity, setOpacity] = useState(0.5); const glassCss = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, 0.3);`;
  const [hours, setHours] = useState(10); const [rate, setRate] = useState(50); const [tax, setTax] = useState(20); const [client, setClient] = useState(''); const gross = hours * rate; const net = gross - (gross * (tax / 100)); const generateInvoice = () => { const doc = new jsPDF(); doc.setFontSize(22); doc.text('INVOICE', 20, 20); doc.setFontSize(12); doc.text(`Client: ${client}`, 20, 40); doc.text(`Total Hours: ${hours}`, 20, 50); doc.text(`Hourly Rate: $${rate}`, 20, 60); doc.text(`Gross Total: $${gross}`, 20, 70); doc.text(`Net (After ${tax}% Tax): $${net}`, 20, 80); doc.save(`Invoice-${client || 'Client'}.pdf`); };
  const [pomoTime, setPomoTime] = useState(25 * 60); const [pomoActive, setPomoActive] = useState(false); useEffect(() => { let int = null; if (pomoActive && pomoTime > 0) int = setInterval(() => setPomoTime(p => p - 1), 1000); else clearInterval(int); return () => clearInterval(int); }, [pomoActive, pomoTime]); const formatPomo = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const [recordedChunks, setRecordedChunks] = useState([]); const [isRecording, setIsRecording] = useState(false); const mediaRecorderRef = useRef(null); const startRecording = async () => { try { const stream = await navigator.mediaDevices.getDisplayMedia({ video: true }); mediaRecorderRef.current = new MediaRecorder(stream); mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]); }; mediaRecorderRef.current.start(); setIsRecording(true); stream.getVideoTracks()[0].onended = () => stopRecording(); } catch (err) {} }; const stopRecording = () => { if (mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); }; const downloadVideo = () => { const blob = new Blob(recordedChunks, { type: 'video/webm' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'screen-recording.webm'; a.click(); setRecordedChunks([]); };
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); useEffect(() => { const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight, ratio: window.devicePixelRatio }); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
  const [svgInput, setSvgInput] = useState('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg>'); const [pngUrl, setPngUrl] = useState(null); const convertSvg = () => { const blob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' }); const img = new window.Image(); img.onload = () => { const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height; canvas.getContext('2d').drawImage(img, 0, 0); setPngUrl(canvas.toDataURL('image/png')); }; img.src = URL.createObjectURL(blob); };

  // --- CATEGORY STRUCTURE ---
  const categories = {
    "Media & Graphics": [
      { id: 'image', name: 'Compress Image', icon: Image },
      { id: 'resize', name: 'Resize Image', icon: Maximize },
      { id: 'pdfgen', name: 'Photos to PDF', icon: FileUp },
      { id: 'audio', name: 'Extract Audio', icon: Music },
      { id: 'screen', name: 'Screen Record', icon: Video },
      { id: 'svg', name: 'SVG to PNG', icon: Image },
      { id: 'ratio', name: 'Aspect Ratio', icon: Crop },
      { id: 'color', name: 'Color Pick', icon: Palette },
    ],
    "Developer & Code": [
      { id: 'json-ts', name: 'JSON to TS', icon: Brackets },
      { id: 'json', name: 'JSON Format', icon: Code },
      { id: 'beautify', name: 'Code Beautify', icon: Code2 },
      { id: 'mongo', name: 'MongoDB ID', icon: Database },
      { id: 'jwt', name: 'JWT Decode', icon: LockOpen },
      { id: 'cron', name: 'Cron Parse', icon: Calendar },
      { id: 'regex', name: 'Regex Test', icon: FileSearch },
      { id: 'keys', name: 'Keycodes', icon: Keyboard },
      { id: 'glass', name: 'Glass CSS', icon: Droplet },
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
      { id: 'seo', name: 'SEO Meta', icon: Globe },
      { id: 'utm', name: 'UTM Builder', icon: Link },
      { id: 'qr', name: 'QR Code', icon: QrCode },
    ],
    "General Utilities": [
      { id: 'password', name: 'Passwords', icon: Key },
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
            placeholder="Search for a tool..." 
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

            {/* Render 34 Tools */}
            {activeTab === 'json-ts' && ( <div> <h2>JSON to TypeScript Interface</h2> <textarea rows="5" value={jsonToTsInput} onChange={(e) => setJsonToTsInput(e.target.value)} /> <button onClick={convertJsonToTs} className="btn" style={{marginBottom: '15px'}}><Brackets size={16}/> Convert to TS</button> <textarea rows="7" readOnly className="readonly-area" value={tsOutput} /> </div> )}
            {activeTab === 'cron' && ( <div> <h2>Cron Expression Translator</h2> <input type="text" className="text-input" placeholder="e.g. 0 12 * * 1-5" value={cronInput} onChange={(e) => setCronInput(e.target.value)} /> <button onClick={translateCron} className="btn"><Calendar size={16}/> Translate</button> {cronResult && <div className="output-box" style={{fontSize: '1.2rem'}}>{cronResult}</div>} </div> )}
            {activeTab === 'regex' && ( <div> <h2>Regex Tester</h2> <input type="text" className="text-input" placeholder="Regex pattern (e.g. [a-z]+)" value={regexPattern} onChange={(e) => setRegexPattern(e.target.value)} /> <textarea rows="3" placeholder="Test string..." value={regexText} onChange={(e) => setRegexText(e.target.value)} /> <button onClick={testRegex} className="btn" style={{marginBottom: '15px'}}><FileSearch size={16}/> Test Matches</button> <div className="output-box" style={{fontSize: '1rem', textAlign: 'left', padding: '15px'}}>{regexResult}</div> </div> )}
            {activeTab === 'keys' && ( <div style={{textAlign: 'center'}}> <h2>JavaScript Keycode Finder</h2> <p className="subtitle">Click the input below and press any key on your keyboard.</p> <input type="text" className="text-input" style={{textAlign: 'center', fontSize: '1.5rem'}} placeholder="Press a key here..." onKeyDown={handleKeyDown} readOnly /> <div className="stats"> <div className="stat-box"><h3>{keyData.key}</h3><p>event.key</p></div> <div className="stat-box"><h3>{keyData.keyCode}</h3><p>event.keyCode</p></div> <div className="stat-box"><h3 style={{fontSize: '1.5rem', marginTop: '10px'}}>{keyData.code}</h3><p>event.code</p></div> </div> </div> )}
            {activeTab === 'ratio' && ( <div> <h2>Aspect Ratio Calculator</h2> <div className="stats"> <div className="stat-box"> <label>Original Width</label> <input type="number" className="text-input" value={arW1} onChange={(e) => setArW1(e.target.value)} /> </div> <div className="stat-box"> <label>Original Height</label> <input type="number" className="text-input" value={arH1} onChange={(e) => setArH1(e.target.value)} /> </div> </div> <div className="stats"> <div className="stat-box"> <label>New Width</label> <input type="number" className="text-input" value={arW2} onChange={(e) => setArW2(e.target.value)} /> </div> <div className="stat-box" style={{background: '#f8fafc'}}> <label>New Height (Calculated)</label> <h3 style={{marginTop: '10px'}}>{arH2} px</h3> </div> </div> </div> )}
            {activeTab === 'seo' && ( <div> <h2>SEO Meta Tag Generator</h2> <input type="text" className="text-input" placeholder="Page Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /> <textarea rows="2" placeholder="Page Description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} /> <input type="text" className="text-input" placeholder="Image URL (e.g. https://...)" value={seoImg} onChange={(e) => setSeoImg(e.target.value)} /> <h4 style={{marginBottom: '10px'}}>Generated HTML Tags:</h4> <textarea rows="7" readOnly className="readonly-area" value={seoTags} /> </div> )}
            {activeTab === 'utm' && ( <div> <h2>UTM Link Builder</h2> <input type="text" className="text-input" placeholder="Website URL" value={utmUrl} onChange={(e) => setUtmUrl(e.target.value)} /> <div className="stats" style={{marginTop: 0, marginBottom: '20px'}}> <input type="text" className="text-input" placeholder="Source (e.g. google)" value={utmSrc} onChange={(e) => setUtmSrc(e.target.value)} /> <input type="text" className="text-input" placeholder="Medium (e.g. cpc)" value={utmMed} onChange={(e) => setUtmMed(e.target.value)} /> <input type="text" className="text-input" placeholder="Campaign (e.g. sale)" value={utmCamp} onChange={(e) => setUtmCamp(e.target.value)} /> </div> <h4 style={{marginBottom: '10px'}}>Generated UTM Link:</h4> <div className="output-box" style={{fontSize: '1.1rem', padding: '15px'}}>{utmResult}</div> </div> )}
            {activeTab === 'image' && ( <div> <h2>Client-Side Image Compressor</h2> <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" /> {compressing && <p>Compressing...</p>} {originalImage && compressedImage && ( <div className="results-grid"> <div><h4>Original</h4><p>{(originalImage.size / 1024 / 1024).toFixed(2)} MB</p></div> <div><h4>Compressed</h4><p>{(compressedImage.size / 1024 / 1024).toFixed(2)} MB</p> <a href={URL.createObjectURL(compressedImage)} download={`compressed-${originalImage.name}`} className="btn"><Download size={16} /> Download</a> </div> </div> )} </div> )}
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
        </main>
      </div>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}