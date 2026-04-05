import React, { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';

export default function App() {
  // --- ESTADOS DE CONTENIDO ---
  const [headlineMain, setHeadlineMain] = useState('¡Cobertura completa');
  const [headlineHighlight, setHeadlineHighlight] = useState('para tu viaje!');
  const [discountValue, setDiscountValue] = useState('45');
  const [showPercentOff, setShowPercentOff] = useState(true);
  const [discountSubtext, setDiscountSubtext] = useState('en asistencia al viajero');
  const [ctaText, setCtaText] = useState('¡VER BENEFICIO!');
  const [ctaColor, setCtaColor] = useState('#051130');
  
  // --- ESTADOS DE COLOR Y DISEÑO ---
  const [primaryColor, setPrimaryColor] = useState('#0a1945');
  const [secondaryColor, setSecondaryColor] = useState('#1e3a8a');
  const [isGradient, setIsGradient] = useState(true);
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [cutStyle, setCutStyle] = useState('diagonal-right');
  const [layoutDirection, setLayoutDirection] = useState('left');
  const [edgeEffect, setEdgeEffect] = useState('none');

  // --- ESTADOS DE IMÁGENES (Base64) ---
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoUrl2, setLogoUrl2] = useState('');
  const [logoCount, setLogoCount] = useState(1);

  // --- ENCUADRE (Independiente Desktop/Mobile) ---
  const [desktopBgZoom, setDesktopBgZoom] = useState(1);
  const [desktopBgPosX, setDesktopBgPosX] = useState(75);
  const [desktopBgPosY, setDesktopBgPosY] = useState(50);
  const [mobileBgZoom, setMobileBgZoom] = useState(1);
  const [mobileBgPosX, setMobileBgPosX] = useState(75);
  const [mobileBgPosY, setMobileBgPosY] = useState(50);

  const [framingMode, setFramingMode] = useState('desktop');
  const [previewMode, setPreviewMode] = useState('desktop'); 
  const [downloadingFormat, setDownloadingFormat] = useState(null);

  // Función para convertir imágenes externas a Base64 y evitar errores de CORS
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

  // Carga inicial de ejemplos
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

  // Función de descarga optimizada
  const handleDownload = async (format) => {
    const node = document.getElementById(`banner-node-${format}`);
    if (!node) return;
    setDownloadingFormat(format);
    try {
      const dataUrl = await toPng(node, { 
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        cacheBust: true 
      });
      const link = document.createElement('a');
      link.download = `banner-bonda-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { 
      alert('Error al generar imagen. Prueba subiendo tus fotos desde tu computadora.'); 
    } finally { 
      setDownloadingFormat(null); 
    }
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
    left: {
      'diagonal-right': 'polygon(0 0, 100% 0, 80% 100%, 0 100%)', 
      'diagonal-left': 'polygon(0 0, 80% 0, 100% 100%, 0 100%)',
      'straight': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    },
    right: {
      'diagonal-right': 'polygon(0 0, 100% 0, 100% 100%, 20% 100%)', 
      'diagonal-left': 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
      'straight': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    }
  }[layoutDirection];

  const getEdgeFilter = () => {
    if (edgeEffect === 'none') return 'none';
    const dir = layoutDirection === 'left' ? 1 : -1;
    const shadowMap = {
      'shadow': `drop-shadow(${dir * 8}px 0px 12px rgba(0,0,0,0.5))`,
      'glow': `drop-shadow(${dir * 2}px 0px 10px rgba(255,255,255,0.6))`,
      'solid-white': `drop-shadow(${dir * 4}px 0px 0px #ffffff)`
    };
    return shadowMap[edgeEffect] || 'none';
  };

  const renderSubtextLines = (text) => {
    if (!text) return [];
    if (text.includes('\n')) return text.split('\n');
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Generador de Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Crea piezas para Desktop y Mobile en segundos.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* PANEL DE CONTROLES */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6 overflow-y-auto max-h-[85vh]">
            <section>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">1. Contenido</h3>
              <div className="space-y-3">
                <input type="text" value={headlineMain} onChange={(e) => setHeadlineMain(e.target.value)} className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Título principal" />
                <input type="text" value={headlineHighlight} onChange={(e) => setHeadlineHighlight(e.target.value)} className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Subtítulo (cursiva)" />
                
                <div className="flex items-center justify-between py-2 border-t mt-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Descuento</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={showPercentOff} onChange={() => setShowPercentOff(!showPercentOff)} className="sr-only peer" />
                    <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase">% OFF</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="p-2 border rounded-lg text-center font-bold" />
                  <textarea value={discountSubtext} onChange={(e) => setDiscountSubtext(e.target.value)} className="col-span-2 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="2" placeholder="Subtexto" />
                </div>

                <div className="pt-2 border-t">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Botón (CTA)</label>
                  <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full p-2 text-sm border rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Texto del botón" />
                  <input type="color" value={ctaColor} onChange={(e) => setCtaColor(e.target.value)} className="w-full h-8 rounded cursor-pointer border-none" />
                </div>
              </div>
            </section>

            <section className="border-t pt-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">2. Estilo y Color</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-8 rounded cursor-pointer border-none shadow-inner" />
                {isGradient && <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-8 rounded cursor-pointer border-none shadow-inner" />}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" checked={isGradient} onChange={() => setIsGradient(!isGradient)} id="grad" className="rounded text-blue-600" />
                <label htmlFor="grad" className="text-xs font-medium">Usar Gradiente</label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select value={layoutDirection} onChange={(e) => setLayoutDirection(e.target.value)} className="p-2 text-xs border rounded-lg bg-gray-50 outline-none">
                  <option value="left">Texto Izquierda</option>
                  <option value="right">Texto Derecha</option>
                </select>
                <select value={cutStyle} onChange={(e) => setCutStyle(e.target.value)} className="p-2 text-xs border rounded-lg bg-gray-50 outline-none">
                  <option value="diagonal-right">Diagonal Der.</option>
                  <option value="diagonal-left">Diagonal Izq.</option>
                  <option value="straight">Recto</option>
                </select>
              </div>
              <div className="mt-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Efecto de Borde</label>
                <select value={edgeEffect} onChange={(e) => setEdgeEffect(e.target.value)} className="w-full p-2 text-xs border rounded-lg bg-gray-50 outline-none">
                  <option value="none">Sin efecto</option>
                  <option value="shadow">Sombra</option>
                  <option value="glow">Brillo (Glow)</option>
                  <option value="solid-white">Línea Blanca</option>
                </select>
              </div>
            </section>

            <section className="border-t pt-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">3. Imagen y Encuadre</h3>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setBgImageUrl)} className="w-full text-xs mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              
              <div className="bg-gray-50 p-3 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Ajustar para:</span>
                  <div className="flex bg-white border rounded overflow-hidden">
                    <button onClick={() => {setFramingMode('desktop'); setPreviewMode('desktop')}} className={`px-3 py-1 text-[10px] font-bold transition-colors ${framingMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Desktop</button>
                    <button onClick={() => {setFramingMode('mobile'); setPreviewMode('mobile')}} className={`px-3 py-1 text-[10px] font-bold transition-colors ${framingMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Mobile</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-[9px] font-bold text-gray-500">ZOOM</span></div>
                    <input type="range" min="0.1" max="3" step="0.05" value={framingMode === 'desktop' ? desktopBgZoom : mobileBgZoom} onChange={(e) => framingMode === 'desktop' ? setDesktopBgZoom(Number(e.target.value)) : setMobileBgZoom(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-[9px] font-bold text-gray-500">POSICIÓN H</span></div>
                    <input type="range" min="-50" max="150" value={framingMode === 'desktop' ? desktopBgPosX : mobileBgPosX} onChange={(e) => framingMode === 'desktop' ? setDesktopBgPosX(Number(e.target.value)) : setMobileBgPosX(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-[9px] font-bold text-gray-500">POSICIÓN V</span></div>
                    <input type="range" min="-50" max="150" value={framingMode === 'desktop' ? desktopBgPosY : mobileBgPosY} onChange={(e) => framingMode === 'desktop' ? setDesktopBgPosY(Number(e.target.value)) : setMobileBgPosY(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t pt-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">4. Logos Partner</h3>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setLogoCount(1)} className={`flex-1 py-1 text-[10px] font-bold border rounded-md transition-colors ${logoCount === 1 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white text-gray-400'}`}>1 LOGO</button>
                <button onClick={() => setLogoCount(2)} className={`flex-1 py-1 text-[10px] font-bold border rounded-md transition-colors ${logoCount === 2 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white text-gray-400'}`}>2 LOGOS</button>
              </div>
              <input type="file" onChange={(e) => handleFileUpload(e, setLogoUrl)} className="w-full text-xs mb-2 cursor-pointer" />
              {logoCount === 2 && <input type="file" onChange={(e) => handleFileUpload(e, setLogoUrl2)} className="w-full text-xs border-t pt-2 cursor-pointer" />}
            </section>
          </div>

          {/* VISTA PREVIA */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['desktop', 'mobile', 'both'].map(m => (
                  <button key={m} onClick={() => {setPreviewMode(m); if(m !== 'both') setFramingMode(m)}} className={`px-6 py-2 rounded-lg text-xs font-bold capitalize transition-all ${previewMode === m ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{m === 'both' ? 'Ambos' : m}</button>
                ))}
              </div>
            </div>

            <div className="space-y-12 pb-20">
              {(previewMode === 'both' ? ['desktop', 'mobile'] : [previewMode]).map(type => {
                const isMobile = type === 'mobile';
                const zoom = isMobile ? mobileBgZoom : desktopBgZoom;
                const px = isMobile ? mobileBgPosX : desktopBgPosX;
                const py = isMobile ? mobileBgPosY : desktopBgPosY;

                return (
                  <div key={type} className="space-y-3">
                    <div className="flex justify-between items-end px-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{isMobile ? 'Mobile: 984 x 450 px' : 'Desktop: 1000 x 300 px'}</span>
                      <button onClick={() => handleDownload(type)} disabled={downloadingFormat === type} className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                        {downloadingFormat === type ? 'PROCESANDO...' : '📥 DESCARGAR PNG'}
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                      <div id={`banner-node-${type}`} className="relative w-full overflow-hidden flex bg-gray-200" style={{ aspectRatio: isMobile ? '984/450' : '10/3' }}>
                        <div className="absolute inset-0">
                          {bgImageUrl && <img src={bgImageUrl} alt="Background" className="absolute max-w-none" style={{ width: `${zoom * 100}%`, height: 'auto', left: `${px}%`, top: `${py}%`, transform: 'translate(-50%, -50%)' }} />}
                        </div>
                        
                        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out ${layoutDirection === 'left' ? 'left-0' : 'right-0'}`} style={{ width: cutStyle === 'straight' ? 'calc(50% - 30px)' : 'calc(62% - 30px)', filter: getEdgeFilter(), zIndex: 5 }}>
                          <div className="w-full h-full" style={{ background: isGradient ? `linear-gradient(${gradientDirection}, ${primaryColor}, ${secondaryColor})` : primaryColor, clipPath: currentCuts[cutStyle] }}></div>
                        </div>

                        <div className={`absolute inset-0 flex z-10 ${layoutDirection === 'right' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-[58%] h-full flex flex-col justify-center px-10 text-white ${layoutDirection === 'left' ? 'items-start text-left' : 'items-end text-right'}`}>
                            <h2 className={`leading-none font-medium mb-4 ${isMobile ? 'text-4xl md:text-5xl' : 'text-[2rem] md:text-[2.5rem]'}`}>
                              {headlineMain} <br/> <span className="italic font-light opacity-90">{headlineHighlight}</span>
                            </h2>
                            <div className={`flex items-center gap-4 ${layoutDirection === 'right' ? 'flex-row-reverse' : ''}`}>
                              <div className="flex items-start">
                                <span className={`font-bold tracking-tighter leading-none ${isMobile ? 'text-[6rem]' : 'text-[5.5rem]'}`}>{discountValue}</span>
                                {showPercentOff && (
                                  <div className="flex flex-col ml-1 mt-2 text-left">
                                    <span className="font-bold leading-none text-2xl">%</span>
                                    <span className="font-bold text-[10px] mt-1 tracking-widest">OFF</span>
                                  </div>
                                )}
                              </div>
                              <div className={`py-1 flex flex-col justify-center border-white/30 ${layoutDirection === 'right' ? 'border-r-2 pr-4 text-right' : 'border-l-2 pl-4 text-left'}`}>
                                {renderSubtextLines(discountSubtext).map((l, i) => (
                                  <span key={i} className={`font-medium leading-none tracking-tight ${isMobile ? 'text-xl' : 'text-base'}`}>{l}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className={`w-[42%] h-full flex flex-col justify-center ${layoutDirection === 'left' ? 'items-end pr-10' : 'items-start pl-10'}`}>
                            <div className={`flex flex-col ${isMobile ? 'gap-8' : 'gap-5'} ${layoutDirection === 'left' ? 'items-end' : 'items-start'}`}>
                              <div className="flex gap-4">
                                <div className={`bg-white rounded-3xl shadow-xl flex items-center justify-center p-3 transition-all hover:scale-105 ${isMobile ? (logoCount === 1 ? 'w-40 h-40' : 'w-32 h-32') : 'w-24 h-24'}`}>
                                  {logoUrl && <img src={logoUrl} alt="Logo 1" className="max-w-full max-h-full object-contain" />}
                                </div>
                                {logoCount === 2 && logoUrl2 && (
                                  <div className={`bg-white rounded-3xl shadow-xl flex items-center justify-center p-3 transition-all hover:scale-105 ${isMobile ? 'w-32 h-32' : 'w-24 h-24'}`}>
                                    <img src={logoUrl2} alt="Logo 2" className="max-w-full max-h-full object-contain" />
                                  </div>
                                )}
                              </div>
                              <button className={`rounded-full font-bold shadow-xl transition-all active:scale-95 ${isMobile ? 'px-12 py-4 text-lg' : 'px-8 py-2.5 text-xs'}`} style={{ backgroundColor: ctaColor, color: '#fff' }}>{ctaText}</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
