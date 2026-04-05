import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

export default function App() {
  const [headlineMain, setHeadlineMain] = useState('¡Cobertura completa');
  const [headlineHighlight, setHeadlineHighlight] = useState('para tu viaje!');
  const [discountValue, setDiscountValue] = useState('45');
  const [showPercentOff, setShowPercentOff] = useState(true);
  const [discountSubtext, setDiscountSubtext] = useState('en asistencia al viajero');
  const [ctaText, setCtaText] = useState('¡VER BENEFICIO!');
  const [ctaColor, setCtaColor] = useState('#051130');
  const [primaryColor, setPrimaryColor] = useState('#0a1945');
  const [secondaryColor, setSecondaryColor] = useState('#1e3a8a');
  const [isGradient, setIsGradient] = useState(true);
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [cutStyle, setCutStyle] = useState('diagonal-right');
  const [layoutDirection, setLayoutDirection] = useState('left');
  const [edgeEffect, setEdgeEffect] = useState('none');
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUrl2, setLogoUrl2] = useState('');
  const [logoCount, setLogoCount] = useState(1);
  const [desktopBgZoom, setDesktopBgZoom] = useState(1);
  const [desktopBgPosX, setDesktopBgPosX] = useState(75);
  const [desktopBgPosY, setDesktopBgPosY] = useState(50);
  const [mobileBgZoom, setMobileBgZoom] = useState(1);
  const [mobileBgPosX, setMobileBgPosX] = useState(75);
  const [mobileBgPosY, setMobileBgPosY] = useState(50);
  const [framingMode, setFramingMode] = useState('desktop');
  const [previewMode, setPreviewMode] = useState('desktop'); 
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  const convertToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (e) { return url; }
  };

  useEffect(() => {
    const loadDefaults = async () => {
      const bg = await convertToBase64('[https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80](https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80)');
      const l1 = await convertToBase64('[https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png)');
      const l2 = await convertToBase64('[https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png](https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png)');
      setBgImageUrl(bg);
      setLogoUrl(l1);
      setLogoUrl2(l2);
    };
    loadDefaults();
  }, []);

  const handleDownload = async (format) => {
    const node = document.getElementById(`banner-node-${format}`);
    if (!node) return;
    setDownloadingFormat(format);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#ffffff', cacheBust: true });
      const link = document.createElement('a');
      link.download = `banner-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { alert('Error al generar imagen.'); }
    finally { setDownloadingFormat(null); }
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const currentCuts = {
    left: { 'diagonal-right': 'polygon(0 0, 100% 0, 80% 100%, 0 100%)', 'diagonal-left': 'polygon(0 0, 80% 0, 100% 100%, 0 100%)', 'straight': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
    right: { 'diagonal-right': 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)', 'diagonal-left': 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)', 'straight': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
  }[layoutDirection];

  const renderSubtextLines = (text) => {
    if (!text) return [];
    const words = text.trim().split(/\s+/);
    if (words.length > 1) {
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }
    return [text];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Generador de Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Herramienta de diseño para Bonda.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 overflow-y-auto max-h-[85vh]">
            <section className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contenido</h3>
              <input type="text" value={headlineMain} onChange={(e) => setHeadlineMain(e.target.value)} className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Título" />
              <input type="text" value={headlineHighlight} onChange={(e) => setHeadlineHighlight(e.target.value)} className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Cursiva" />
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-xs font-bold text-gray-400 uppercase">% OFF</span>
                <input type="checkbox" checked={showPercentOff} onChange={() => setShowPercentOff(!showPercentOff)} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="p-2 border rounded-lg text-center font-bold" />
                <textarea value={discountSubtext} onChange={(e) => setDiscountSubtext(e.target.value)} className="col-span-2 p-2 text-xs border rounded-lg" rows="2" />
              </div>
            </section>

            <section className="border-t pt-4 space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Diseño</h3>
              <div className="flex gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 h-8 rounded cursor-pointer border-none" />
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 h-8 rounded cursor-pointer border-none" />
              </div>
              <select value={layoutDirection} onChange={(e) => setLayoutDirection(e.target.value)} className="w-full p-2 text-xs border rounded-lg bg-gray-50">
                <option value="left">Texto Izquierda</option>
                <option value="right">Texto Derecha</option>
              </select>
            </section>

            <section className="border-t pt-4 space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fondo</h3>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setBgImageUrl)} className="text-xs w-full" />
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                 <div className="flex justify-between text-[9px] font-bold uppercase text-gray-400">
                    <button onClick={() => setFramingMode('desktop')} className={framingMode==='desktop'?'text-blue-600':''}>Desktop</button>
                    <button onClick={() => setFramingMode('mobile')} className={framingMode==='mobile'?'text-blue-600':''}>Mobile</button>
                 </div>
                 <input type="range" min="0.1" max="3" step="0.05" value={framingMode==='desktop'?desktopBgZoom:mobileBgZoom} onChange={(e)=>framingMode==='desktop'?setDesktopBgZoom(Number(e.target.value)):setMobileBgZoom(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none" />
              </div>
            </section>
            
            <section className="border-t pt-4 space-y-3">
               <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner</h3>
               <input type="file" onChange={(e) => handleFileUpload(e, setLogoUrl)} className="text-xs w-full" />
            </section>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
              {['desktop', 'mobile'].map(m => (
                <button key={m} onClick={() => {setPreviewMode(m); setFramingMode(m)}} className={`px-6 py-2 rounded-lg text-xs font-bold capitalize ${previewMode === m ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{m}</button>
              ))}
            </div>

            <div key={previewMode} className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{previewMode==='mobile'?'984x450':'1000x300'}</span>
                <button onClick={() => handleDownload(previewMode)} disabled={downloadingFormat === previewMode} className="bg-green-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl shadow-lg active:scale-95 disabled:opacity-50">
                  {downloadingFormat === previewMode ? 'PROCESANDO...' : 'DESCARGAR PNG'}
                </button>
              </div>

              <div id={`banner-node-${previewMode}`} className="relative w-full overflow-hidden flex bg-white rounded-2xl shadow-2xl border" style={{ aspectRatio: previewMode==='mobile' ? '984/450' : '10/3' }}>
                <div className="absolute inset-0">
                  {bgImageUrl && <img src={bgImageUrl} className="absolute max-w-none" style={{ width: `${(previewMode==='mobile'?mobileBgZoom:desktopBgZoom) * 100}%`, left: `${previewMode==='mobile'?mobileBgPosX:desktopBgPosX}%`, top: `${previewMode==='mobile'?mobileBgPosY:desktopBgPosY}%`, transform: 'translate(-50%, -50%)' }} />}
                </div>
                <div className={`absolute top-0 h-full ${layoutDirection === 'left' ? 'left-0' : 'right-0'}`} style={{ width: '62%', background: isGradient ? `linear-gradient(${gradientDirection}, ${primaryColor}, ${secondaryColor})` : primaryColor, clipPath: currentCuts[cutStyle], zIndex: 5 }}></div>
                <div className={`absolute inset-0 flex z-10 p-10 text-white ${layoutDirection === 'left' ? 'text-left items-start' : 'text-right items-end flex-row-reverse w-full'}`}>
                   <div className="w-[60%] h-full flex flex-col justify-center">
                      <h2 className={`font-medium leading-none mb-4 text-4xl`}>{headlineMain} <br/><span className="italic font-light opacity-80">{headlineHighlight}</span></h2>
                      <div className="flex items-center gap-4">
                         <span className={`font-bold leading-none ${previewMode==='mobile'?'text-8xl':'text-7xl'}`}>{discountValue}</span>
                         {showPercentOff && <div className="text-left font-bold"><div className="text-2xl leading-none">%</div><div className="text-[10px]">OFF</div></div>}
                         <div className="border-l-2 pl-4 border-white/30 text-base font-medium leading-none">
                            {renderSubtextLines(discountSubtext).map((l,i)=><div key={i}>{l}</div>)}
                         </div>
                      </div>
                   </div>
                   <div className="w-[40%] h-full flex flex-col justify-center items-end gap-6">
                      <div className="bg-white rounded-3xl p-4 w-32 h-32 flex items-center justify-center shadow-xl">
                         {logoUrl && <img src={logoUrl} className="max-w-full max-h-full object-contain" />}
                      </div>
                      <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-xs uppercase shadow-xl" style={{backgroundColor: ctaColor, color: '#fff'}}>{ctaText}</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
