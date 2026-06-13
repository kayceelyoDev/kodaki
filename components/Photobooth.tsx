"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { toPng } from 'html-to-image';
import { Camera, Download, Trash2, Sparkles, LayoutGrid, ArrowRight, Star, Heart, Film, Camera as CameraIcon, Flame, Crown, Smile, Ghost, Sun, Moon, Music, Cloud, Sticker, Palette, X } from 'lucide-react';
import { motion } from 'framer-motion';
import LandingPage from './LandingPage';

type Phase = 'landing' | 'setup' | 'capture' | 'edit';

const LAYOUTS = [
  { id: '1x1', name: 'Single Shot', count: 1 },
  { id: '1x2', name: 'Mini Strip', count: 2 },
  { id: '1x3', name: 'Triple Shot', count: 3 },
  { id: '1x4', name: 'Photo Strip', count: 4 },
  { id: '2x2', name: 'Square Grid', count: 4 },
  { id: '2x3', name: 'Six Grid', count: 6 },
  { id: '2x4-strip', name: 'Double Strip', count: 4 } // Takes 4 photos, clones to 8
];

const TEMPLATES = [
  { id: 'none', name: 'Classic Clean', border: 'none', filter: 'normal' },
  { id: 'noir', name: 'Studio Noir', border: 'studio-noir', filter: 'grayscale' },
  { id: 'camcorder', name: 'Vintage Cam', border: 'camcorder', filter: 'vintage' },
  { id: 'social', name: 'Social App', border: 'social', filter: 'normal' },
  { id: 'y2k', name: 'Y2K Party', border: 'neon', filter: 'vibrant' },
  { id: 'polaroid', name: 'Retro Instant', border: 'polaroid', filter: 'sepia' },
  { id: 'love-letter', name: 'Love Letter', border: 'love-letter', filter: 'normal' },
  { id: 'directors-cut', name: 'Director Cut', border: 'directors-cut', filter: 'normal' },
  { id: 'newspaper', name: 'Newspaper', border: 'newspaper', filter: 'grayscale' },
  { id: 'receipt', name: 'Store Receipt', border: 'receipt', filter: 'normal' },
  { id: 'vintage-stamp', name: 'Vintage Stamp', border: 'vintage-stamp', filter: 'vintage' },
  { id: 'movie-ticket', name: 'Movie Ticket', border: 'movie-ticket', filter: 'vintage' },
  { id: 'woodgrain', name: 'Woodgrain', border: 'woodgrain', filter: 'sepia' },
  { id: 'airmail', name: 'Airmail', border: 'airmail', filter: 'normal' },
  { id: 'pixel-heart', name: 'Pixel Heart', border: 'pixel-heart', filter: 'normal' },
  { id: 'blue-tech', name: 'Blue Tech', border: 'blue-tech', filter: 'normal' },
  { id: 'film-strip', name: 'Film Strip', border: 'film-strip', filter: 'normal' },
  { id: 'retro-green', name: 'Retro Green', border: 'retro-green', filter: 'vintage' },
  { id: 'stamp-strip', name: 'Stamp Strip', border: 'stamp-strip', filter: 'normal' },
  { id: 'teal-photoism', name: 'Teal Photoism', border: 'teal-photoism', filter: 'normal' },
  { id: 'photomatics', name: 'Photomatics', border: 'photomatics', filter: 'grayscale' }
];

const PRESETS = [
  { id: 'noir', name: 'Studio Noir', layout: '2x4-strip', template: 'noir', badge: 'POPULAR' },
  { id: 'social', name: 'Social App', layout: '1x1', template: 'social', badge: 'TRENDING' },
  { id: 'camcorder', name: 'Vintage Cam', layout: '2x4-strip', template: 'camcorder', badge: '' },
  { id: 'love-letter', name: 'Love Letter', layout: '1x3', template: 'love-letter', badge: 'NEW' },
  { id: 'directors-cut', name: 'Director Cut', layout: '2x4-strip', template: 'directors-cut', badge: 'NEW' },
  { id: 'newspaper', name: 'Newspaper', layout: '2x2', template: 'newspaper', badge: 'NEW' },
  { id: 'receipt', name: 'Store Receipt', layout: '2x3', template: 'receipt', badge: 'NEW' },
  { id: 'vintage-stamp', name: 'Vintage Stamp', layout: '2x3', template: 'vintage-stamp', badge: 'NEW' },
  { id: 'movie-ticket', name: 'Movie Ticket', layout: '2x4-strip', template: 'movie-ticket', badge: 'NEW' },
  { id: 'woodgrain', name: 'Vintage Wood', layout: '1x3', template: 'woodgrain', badge: 'NEW' },
  { id: 'airmail', name: 'Airmail Letter', layout: '1x3', template: 'airmail', badge: '' },
  { id: 'pixel-heart', name: 'Pixel Heart', layout: '2x3', template: 'pixel-heart', badge: 'TRENDING' },
  { id: 'blue-tech', name: 'Every Moment', layout: '1x4', template: 'blue-tech', badge: 'NEW' },
  { id: 'film-strip', name: 'Red Room', layout: '2x4-strip', template: 'film-strip', badge: 'NEW' },
  { id: 'retro-green', name: 'Retro Green', layout: '2x3', template: 'retro-green', badge: 'NEW' },
  { id: 'stamp-strip', name: 'Stamp Strip', layout: '2x4-strip', template: 'stamp-strip', badge: 'NEW' },
  { id: 'teal-photoism', name: 'Photoism', layout: '2x4-strip', template: 'teal-photoism', badge: 'NEW' },
  { id: 'photomatics', name: 'Photomatics', layout: '2x4-strip', template: 'photomatics', badge: 'NEW' },
  { id: 'polaroid', name: 'Retro Instant', layout: '1x1', template: 'polaroid', badge: '' },
  { id: 'y2k', name: 'Y2K Party', layout: '2x2', template: 'y2k', badge: '' },
  { id: 'classic', name: 'Classic Strip', layout: '1x3', template: 'none', badge: '' }
];

const FILTERS = [
  { id: 'normal', name: 'Normal' },
  { id: 'grayscale', name: 'B&W' },
  { id: 'sepia', name: 'Sepia' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'vibrant', name: 'Vibrant' },
  { id: 'blur', name: 'Soft Focus' }
];

const STICKER_OPTIONS = [
  <Star key="star" size={40} color="#facc15" fill="#facc15" />,
  <Heart key="heart" size={40} color="#ef4444" fill="#ef4444" />,
  <Flame key="flame" size={40} color="#f97316" fill="#f97316" />,
  <Crown key="crown" size={40} color="#eab308" fill="#eab308" />,
  <Smile key="smile" size={40} color="#60a5fa" />,
  <Ghost key="ghost" size={40} color="#94a3b8" />,
  <Sun key="sun" size={40} color="#facc15" fill="#facc15" />,
  <Moon key="moon" size={40} color="#c7d2fe" fill="#c7d2fe" />,
  <Music key="music" size={40} color="#c084fc" />,
  <Cloud key="cloud" size={40} color="#7dd3fc" fill="#7dd3fc" />
];

const STOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=400&auto=format&fit=crop'
];

export default function Photobooth() {
  const [phase, setPhase] = useState<Phase>('landing');
  
  // Customizer State
  const [activePreset, setActivePreset] = useState(PRESETS[0].id);
  const [layout, setLayout] = useState(PRESETS[0].layout);
  const [template, setTemplate] = useState(PRESETS[0].template);
  const initialTmpl = TEMPLATES.find(t => t.id === PRESETS[0].template) || TEMPLATES[0];
  const [filter, setFilter] = useState(initialTmpl.filter);
  const [border, setBorder] = useState(initialTmpl.border);
  
  // Capture State
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Editor State
  const [activeTab, setActiveTab] = useState('sticker');
  const [stickers, setStickers] = useState<{id: number, icon: React.ReactNode}[]>([]);
  const [copies, setCopies] = useState(1);
  const [location, setLocation] = useState('Cebu City, PH');
  
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase();
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [previewScale, setPreviewScale] = useState<number | undefined>(undefined);

  // Dynamic Mobile Sticky Preview State
  const [showStickyPreview, setShowStickyPreview] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (phase !== 'setup') return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show immediately if scrolled up, or if near the top
      if (currentScrollY < 100 || currentScrollY < lastScrollY.current - 5) {
        setShowStickyPreview(true);
      } else if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 100) {
        // Hide when scrolling down past the header (added 5px buffer to avoid jitter)
        setShowStickyPreview(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'capture' && phase !== 'edit') return;
    const calculateScale = () => {
      const container = document.getElementById('canvas-area-wrapper') || document.getElementById('capture-container');
      if (container) {
        // Determine available space (subtracting some padding for safety)
        const availableWidth = container.clientWidth - 40; 
        const availableHeight = container.clientHeight - 120;
        
        // Determine expected dimensions of the unscaled canvas
        const expectedWidth = layout === '2x4-strip' && phase === 'edit' ? 800 : 500;
        const isTall = ['1x3', '1x4', '2x4-strip'].includes(layout);
        const expectedHeight = isTall ? 1500 : 750; // Increased base height estimate slightly for safety
        
        // Calculate required scale for both axes to fit
        const scaleW = availableWidth / expectedWidth;
        const scaleH = availableHeight / expectedHeight;
        
        // Use the strictest scale, but cap between 0.1 and 1.0
        const scale = Math.max(0.15, Math.min(1, Math.min(scaleW, scaleH)));
        setPreviewScale(scale);
      }
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [phase, layout]);

  const selectedLayout = LAYOUTS.find(l => l.id === layout) || LAYOUTS[0];

  const startCapture = () => {
    setPhotos([]);
    setPhase('capture');
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 200);
        setPhotos(prev => {
          const newPhotos = [...prev, imageSrc];
          if (newPhotos.length >= selectedLayout.count) {
            setTimeout(() => setPhase('edit'), 800);
          }
          return newPhotos;
        });
      }
    }
  }, [webcamRef, selectedLayout.count]);

  const startCountdown = () => {
    if (countdown !== null) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      capturePhoto();
      setCountdown(null);
    }
  }, [countdown, capturePhoto]);

  const handleDownload = async () => {
    if (canvasRef.current) {
      // Find all wrapping containers that could restrict layout or visibility
      const mainContainer = document.querySelector('.pb-main') as HTMLElement;
      const zoomWrapper = document.getElementById('preview-zoom-wrapper') as HTMLElement;
      const areaWrapper = document.getElementById('canvas-area-wrapper') as HTMLElement;
      
      // Store original styles
      const origMainOverflow = mainContainer ? mainContainer.style.overflow : '';
      const origMainHeight = mainContainer ? mainContainer.style.height : '';
      const origZoom = zoomWrapper ? zoomWrapper.style.zoom : '';
      const origAreaOverflow = areaWrapper ? areaWrapper.style.overflow : '';
      
      // Remove all constraints temporarily
      if (mainContainer) {
        mainContainer.style.overflow = 'visible';
        mainContainer.style.height = 'auto';
      }
      if (zoomWrapper) {
        zoomWrapper.style.zoom = '1';
      }
      if (areaWrapper) {
        areaWrapper.style.overflow = 'visible';
      }

      setIsExporting(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const dataUrl = await toPng(canvasRef.current, {
          pixelRatio: 2,
          backgroundColor: 'transparent'
        });
        
        const link = document.createElement('a');
        link.download = `kodaki-${Date.now()}-x${copies}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export image', err);
      } finally {
        // Restore all original constraints instantly
        if (mainContainer) {
          mainContainer.style.overflow = origMainOverflow;
          mainContainer.style.height = origMainHeight;
        }
        if (zoomWrapper) {
          zoomWrapper.style.zoom = origZoom;
        }
        if (areaWrapper) {
          areaWrapper.style.overflow = origAreaOverflow;
        }
        setIsExporting(false);
      }
    }
  };

  const handleDiscard = () => {
    setPhotos([]);
    setStickers([]);
    setPhase('setup');
  };

  const addSticker = (icon: React.ReactNode) => {
    setStickers([...stickers, { id: Date.now(), icon }]);
  };

  const removeSticker = (id: number) => {
    setStickers(stickers.filter(s => s.id !== id));
  };

  const renderStrip = (key: string) => {
    const isCapturePhase = phase === 'capture';
    const showCameraInGrid = isCapturePhase;

    return (
      <div key={key} className={`pb-strip-wrapper border-type-${border} flex flex-col relative flex-1 h-full shadow-sm`}>
         {/* Film Strip / Red Room */}
         {border === 'film-strip' && (
            <>
              <div className="flex justify-between text-gray-400 font-mono text-[7px] tracking-widest mb-2 ml-6">
                <span>RED ROOM</span>
                <span>●REC</span>
              </div>
              {/* Left sprocket holes */}
              <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-evenly items-center py-3 z-20">
                {Array.from({length: 18}).map((_, i) => (
                  <div key={i} className="w-3 h-2 bg-[#d4d4d4] rounded-sm" style={{boxShadow: 'inset 0 0 0 1px #888'}}></div>
                ))}
              </div>
            </>
         )}
         {/* Retro Green */}
         {border === 'retro-green' && (
            <div className="text-center mb-3">
              <div className="text-[#c8dba0] font-mono text-[9px] tracking-[0.4em] uppercase opacity-80">✦ KODAKI ✦</div>
            </div>
         )}
         {/* Teal Photoism */}
         {border === 'teal-photoism' && (
            <>
              <div className="font-sans font-extrabold text-4xl text-white tracking-tight leading-none mb-4 px-1" style={{ fontStyle: 'italic' }}>
                KODAKI
              </div>
              {/* Right side text */}
              <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-between items-center py-6 z-20">
                <div className="text-white/70 font-mono text-[6px] tracking-widest" style={{ writingMode: 'vertical-rl' }}>KEEP EVERY MOMENT</div>
                <div className="text-white font-bold font-mono text-[6px] tracking-widest" style={{ writingMode: 'vertical-rl' }}>KODAKI • STUDIO</div>
              </div>
              {/* Left accent line */}
              <div className="absolute left-2 top-16 bottom-4 w-[1px] bg-white/40 z-20"></div>
            </>
         )}
         {/* Photomatics */}
         {border === 'photomatics' && (
            <div className="flex flex-col items-center mb-4 mt-1">
              <div className="flex items-center gap-2">
                <div className="h-px w-6 bg-[#888]"></div>
                <span className="text-[#a0a09c] font-mono text-[8px] tracking-[0.3em] uppercase">KODAKI</span>
                <div className="h-px w-6 bg-[#888]"></div>
              </div>
            </div>
         )}
         {border === 'studio-noir' && (
           <div className="pb-noir-header mb-6 flex flex-col font-extrabold tracking-tighter leading-[0.8] text-5xl text-white">
             <span>KODAKI</span>
             <span>STUDIO</span>
             <span className="text-[10px] font-mono font-normal tracking-widest mt-2 opacity-60 uppercase">{location} • {currentDate}</span>
           </div>
         )}
         {border === 'social' && (
           <div className="flex justify-between items-center py-2 px-1 mb-2">
             <span className="text-[11px] text-gray-500 font-medium tracking-tight">Tap and hold to super react</span>
             <div className="flex gap-1 text-base">🤍 🫧 🎀 🍥 💿 🍡 <span className="text-gray-400">➕</span></div>
           </div>
         )}
         {border === 'movie-ticket' && (
           <div className="flex flex-col mb-4 text-[#5c1c1c] border-b-2 border-dashed border-[#5c1c1c]/30 pb-4">
             <div className="font-serif italic text-3xl text-center mb-2">Kodaki Theatre</div>
             <div className="flex justify-between items-center font-bold font-mono px-4 border-t-2 border-b-2 border-[#5c1c1c] py-1">
               <span className="text-2xl">15<span className="text-[10px] align-top">¢</span></span>
               <span className="text-[8px] text-center leading-tight">ADMIT<br/>ONE</span>
               <span className="text-[8px] text-center leading-tight">ONE<br/>DAY</span>
             </div>
           </div>
         )}
         {border === 'woodgrain' && (
           <div className="flex flex-col mb-4 text-white text-center">
             <div className="flex items-center justify-center gap-2">
               <div className="h-px w-8 bg-white/50"></div>
               <span className="font-serif tracking-widest text-xs uppercase leading-tight">KODAKI<br/>STUDIO</span>
               <div className="h-px w-8 bg-white/50"></div>
             </div>
           </div>
         )}
         {border === 'blue-tech' && (
           <div className="flex flex-col mb-3 text-white pb-2">
             <div className="flex justify-between items-center text-[9px] font-bold mb-1 opacity-60">
               <span className="text-xs leading-none">✦</span>
               <div className="h-px flex-1 bg-white mx-2"></div>
               <span>1.0</span>
             </div>
             <div className="font-black text-5xl uppercase leading-[0.85] tracking-tighter">
               EVERY<br/>
               <span className="font-serif italic font-normal text-3xl lowercase relative -top-1 ml-5">matters.</span><br/>
               MOMENT
             </div>
             <div className="h-5 w-28 mt-2 bg-white/20 flex items-center px-1">
               <div className="h-3 w-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, white, white 1px, transparent 1px, transparent 3px, white 3px, white 4px, transparent 4px, transparent 7px)'}}></div>
             </div>
           </div>
         )}
         {border === 'love-letter' && (
           <div className="flex justify-center items-center py-4 mb-2 relative">
             <div className="font-serif italic text-5xl font-bold text-[#bd3535] leading-[0.8] text-center transform -rotate-2">
               Catch<br/>Yours
             </div>
             <Heart className="absolute top-2 left-2 text-[#bd3535] fill-[#bd3535] opacity-80" size={20} />
             <Heart className="absolute bottom-2 right-2 text-[#bd3535] fill-[#bd3535] opacity-80" size={24} />
           </div>
         )}
         {border === 'directors-cut' && (
           <div className="flex flex-col mb-4 bg-black border-b border-white pb-2 text-white font-mono text-[10px] uppercase">
             <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white">
               <Film size={24} className="text-white" />
               <div className="flex-1 grid grid-cols-2 gap-2">
                 <div className="flex justify-between"><span>TITLE</span><span className="text-red-500 font-bold">KODAKI</span></div>
                 <div className="flex justify-between"><span>DIRECTOR</span><span className="text-red-500 font-bold">KODAKI</span></div>
               </div>
             </div>
             <div className="flex justify-between">
               <span>DATE: {currentDate}</span>
               <span className="truncate max-w-[100px]">LOC: {location}</span>
               <span>TAKE: 1</span>
             </div>
           </div>
         )}
         {border === 'newspaper' && (
            <div className="flex flex-col mb-4 border-b-4 border-double border-black pb-3 text-black">
              <div className="flex justify-between items-center border-b border-black pb-1 mb-2 text-[7px] font-mono uppercase font-bold tracking-widest">
                <span>Vol. CXXII.. No. 59</span>
                <span>{location} — {currentDate}</span>
                <span>LATE EDITION</span>
                <span>25 CENTS</span>
              </div>
              <div className="font-serif font-black text-5xl text-center tracking-tighter uppercase mt-1 mb-2">THE KODAKI POST</div>
              <div className="text-center font-serif text-[9px] italic tracking-widest border-t border-b border-black py-1 uppercase">"All the Memories That Are Fit to Print"</div>
            </div>
         )}
         {border === 'receipt' && (
           <div className="flex flex-col mb-4 text-center font-mono text-black">
             <div className="font-bold text-xl uppercase mb-1">KODAKI MART</div>
             <div className="text-[10px] uppercase truncate px-2">{location} BRANCH</div>
             <div className="text-[10px] mb-2 border-b border-dashed border-gray-400 pb-2">Tel. (0370) 111234</div>
             <div className="flex justify-between text-[10px]">
               <span>{currentDate}</span>
               <span>{currentTime}</span>
             </div>
             <div className="text-left text-[10px] border-b border-dashed border-gray-400 pb-2 mb-2">Invoice No. 1112233</div>
           </div>
         )}

         {/* Grid */}
         <div className={`pb-layout-grid pb-layout-${layout === '2x4-strip' ? '1x4' : layout} filter-${filter} flex-1 relative ${isExporting ? 'ios-export-reflow' : ''}`}>
            {/* Render actual photos */}
            {Array.from({ length: selectedLayout.count }).map((_, i) => {
              const displaySrc = phase === 'setup' ? STOCK_PHOTOS[i % STOCK_PHOTOS.length] : photos[i];
              return (
              <div 
                key={i} 
                className="pb-photo-wrapper relative w-full h-full overflow-hidden bg-slate-100 flex items-center justify-center"
                style={{ transform: 'translateZ(0)' }}
              >
                {displaySrc ? (
                  <img 
                    src={displaySrc} 
                    className="pb-canvas-photo absolute inset-0 w-full h-full object-cover" 
                    alt={`captured-${i}`} 
                    style={{ transform: phase === 'setup' ? 'none' : 'scaleX(-1)' }}
                  />
                ) : (showCameraInGrid && key !== 'right' && i === photos.length) ? (
                  <div className="absolute inset-0 z-10 overflow-hidden">
                    <Webcam 
                      ref={webcamRef} 
                      audio={false} 
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "user" }}
                      className={`w-full h-full object-cover transform scale-x-[-1] ${countdown !== null ? 'brightness-110' : ''}`}
                    />
                    {countdown !== null && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                        <span className="text-white text-6xl font-bold drop-shadow-xl animate-ping">{countdown}</span>
                      </div>
                    )}
                    {isFlashing && (
                      <div className="absolute inset-0 bg-white z-50 opacity-100 transition-opacity duration-200"></div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-300 font-medium">Slot {i + 1}</span>
                )}
                
                {/* Camcorder recording overlay */}
                {displaySrc && border === 'camcorder' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 text-white/90 font-mono text-[12px] z-10">
                    <div className="flex justify-between items-start">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-full" /> REC</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span>Vol. 30</span><span>KODAKI</span>
                    </div>
                  </div>
                )}
              </div>
            )})}

         </div>

         {/* Bottom Decorations */}
         {border === 'social' && (
           <div className="flex justify-between items-end mt-6 px-2">
             <div className="font-serif italic text-4xl font-bold text-[#6d4c41] leading-none">
               <span className="text-2xl leading-none block font-normal text-[#8d6e63]">le</span>Kodaki<br/>Pix<span className="text-xl not-italic ml-1">📸</span>
             </div>
             <div className="bg-white/95 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100/50 p-3.5 flex flex-col gap-2.5 text-[12px] font-medium w-40 z-10 relative -bottom-2 -right-2 text-gray-800">
               <div className="text-gray-400 text-[10px] mb-0.5 font-normal truncate">{location} • {currentTime}</div>
               <div className="flex justify-between items-center cursor-default">Reply <span className="text-gray-400 text-sm">↩</span></div>
               <div className="flex justify-between items-center cursor-default">Save <span className="text-gray-400 text-sm">↓</span></div>
               <div className="flex justify-between items-center cursor-default">Forward <span className="text-gray-400 text-sm">↗</span></div>
               <div className="flex justify-between items-center text-red-500 mt-1 cursor-default">Unsend <span className="text-red-500 text-sm">↺</span></div>
             </div>
           </div>
         )}
         {border === 'camcorder' && (
           <div className="mt-6 text-center text-xs font-mono text-slate-800 tracking-[0.2em] flex flex-col gap-1">
             <span>KODAKI STUDIOS</span>
             <span className="text-[8px] opacity-60 uppercase">{location} - {currentDate}</span>
           </div>
         )}
         {border === 'love-letter' && (
           <div className="mt-4 flex flex-col relative pb-4">
             <div className="font-serif text-2xl text-[#5a5a5a] mb-2 transform -rotate-1 pl-2">Chilling out</div>
             <div className="text-right font-bold text-sm text-[#333] mb-4">KODAKI STUDIO</div>
             <div className="bg-pink-100 border border-pink-200 rounded p-3 flex flex-col relative text-[#bd3535]">
               <div className="flex justify-between font-bold text-lg border-b border-pink-200 pb-1 mb-1">
                 <span>PHOTO TICKET</span><span className="text-xs mt-1">DAY PASS</span>
               </div>
               <div className="text-[8px] flex gap-2 mt-2 uppercase">
                 <span className="truncate flex-1">{currentDate}</span>
                 <span className="truncate flex-1 text-right">{location}</span>
               </div>
               <div className="w-full h-4 border-b-2 border-dotted border-[#bd3535]/50 mt-1"></div>
             </div>
           </div>
         )}
         {border === 'newspaper' && (
            <div className="mt-4 flex gap-4 text-black items-stretch border-t-4 border-double border-black pt-4">
              <div className="w-1/3 flex flex-col justify-between">
                <div className="font-serif font-black text-sm uppercase leading-tight mb-2">Exclusive:<br/>Local Citizens Strike A Pose</div>
                <div className="bg-black text-white p-3 flex flex-col items-center justify-center mt-auto">
                  <span className="text-[8px] uppercase tracking-widest text-center leading-tight mb-1">ISSUE</span>
                  <span className="text-3xl font-serif leading-none">{new Date().getDate()}</span>
                </div>
              </div>
              <div className="w-2/3 flex flex-col border-l border-black pl-4">
                <div className="font-serif font-bold text-[10px] uppercase mb-2 border-b border-black pb-1">Is History Repeating Itself?</div>
                <div className="text-[8px] leading-[1.4] text-justify font-serif text-slate-800">
                  <span className="float-left text-3xl font-black leading-none pr-1 mt-[-2px]">I</span>n an unprecedented event today, individuals were seen capturing memories in what experts are calling "the most aesthetic moment of the year." Sources confirm the photos are indeed frame-worthy, documenting a rare alignment of perfect lighting and flawless smiles.
                </div>
                <div className="mt-auto pt-4 flex justify-end">
                  <div className="h-6 w-24 opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, black, black 1px, transparent 1px, transparent 3px, black 3px, black 4px, transparent 4px, transparent 7px, black 7px, black 9px, transparent 9px, transparent 12px)'}}></div>
                </div>
              </div>
            </div>
         )}
         {border === 'receipt' && (
           <div className="mt-4 flex flex-col text-black font-mono text-[10px]">
             <div className="flex justify-between mb-1"><span>1 X PHOTO STRIP</span><span>RP. 25.000</span></div>
             <div className="flex justify-between text-slate-500 pl-4 mb-1"><span>(+) XTRA CUTE</span><span>RP. 0</span></div>
             <div className="flex justify-between text-slate-500 pl-4 border-b border-dashed border-gray-400 pb-2 mb-2"><span>XTRA SMILE</span><span>RP. 0</span></div>
             <div className="flex justify-between font-bold"><span>TOTAL</span><span>RP. 25.000</span></div>
             <div className="text-center mt-6 mb-2">* THANK YOU *</div>
             <div className="h-10 w-full flex items-end justify-between px-2 mb-1" style={{ backgroundImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px, black 4px, black 5px, transparent 5px, transparent 8px)'}}></div>
             <div className="text-center text-[8px] text-slate-500">@kodaki.studio</div>
           </div>
         )}
         {border === 'vintage-stamp' && (
           <div className="mt-6 flex flex-col items-center justify-center relative gap-1">
             <div className="font-serif italic text-2xl text-pink-200 transform -rotate-3 border-b border-pink-200/50 pb-1 px-4">Endless Moments</div>
             <span className="text-[8px] text-pink-200/60 uppercase tracking-widest">{location} • {currentDate}</span>
           </div>
         )}
         {border === 'studio-noir' && (
            <>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 -translate-x-full -rotate-90 text-slate-800 text-[10px] font-mono tracking-[0.2em] whitespace-nowrap">1120</div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 translate-x-full rotate-90 text-slate-800 text-[10px] font-mono tracking-[0.2em] whitespace-nowrap">kodaki.studio</div>
            </>
         )}
         {border === 'movie-ticket' && (
           <div className="mt-4 flex justify-between items-center bg-[#bd3535] text-white p-2 text-[8px] font-mono tracking-widest rounded-sm shadow-md">
             <span>ADMIT<br/>ONE</span>
             <span className="text-center text-[9px] font-bold tracking-[0.3em]">KODAKI<br/><span className="text-[6px] font-normal">STUDIO</span></span>
             <span>ADMIT<br/>ONE</span>
           </div>
         )}
         {border === 'woodgrain' && (
           <div className="mt-6 flex flex-col items-center justify-center">
             <div className="font-serif italic text-4xl text-white mb-4">Kodaki<br/>Studio</div>
             <div className="flex items-center justify-center gap-1 w-full opacity-60">
               <div className="h-px flex-1 bg-white"></div>
               <span className="text-white mx-2 text-[10px]">✧ ✧ ✧</span>
               <div className="h-px flex-1 bg-white"></div>
             </div>
           </div>
         )}
         {border === 'airmail' && (
           <div className="mt-4 flex flex-col items-center bg-[#f4ebd0] p-4 text-[#1e3a8a] relative z-10 border-t-4 border-dashed border-slate-400">
             <div className="font-bold text-3xl font-mono tracking-tighter uppercase text-center leading-none">
               {location.split(',')[0]} &<br/>JACKSON
             </div>
             <div className="font-serif italic text-sm mt-1 text-[#1e3a8a]/80">got hitched!</div>
             <div className="font-black text-xl mt-1 tracking-widest">{currentDate}</div>
             <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-40">
               <div className="w-12 h-px bg-[#1e3a8a] transform rotate-[15deg]"></div>
               <div className="w-12 h-px bg-[#1e3a8a] transform rotate-[15deg]"></div>
               <div className="w-12 h-px bg-[#1e3a8a] transform rotate-[15deg]"></div>
             </div>
             <div className="absolute bottom-2 left-2 border-2 border-[#1e3a8a]/40 rounded-full w-12 h-12 flex items-center justify-center opacity-50 transform -rotate-12">
               <span className="text-[6px] font-bold text-center leading-tight">LUCKY<br/>IN LOVE</span>
             </div>
           </div>
         )}
         {border === 'pixel-heart' && (
            <>
              {/* Pixel-art style bottom banner */}
              <div className="absolute bottom-0 left-0 w-full z-20">
                {/* Pixel border row */}
                <div className="flex w-full" style={{ height: '5px' }}>
                  {Array.from({length: 30}).map((_, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: i % 2 === 0 ? '#f9a8d4' : '#fce7f3' }}></div>
                  ))}
                </div>
                {/* Main label */}
                <div className="bg-gradient-to-r from-[#fce7f3] via-[#fbcfe8] to-[#fce7f3] px-3 py-2 flex items-center justify-between border-t border-pink-200">
                  <div className="flex gap-1">
                    <span className="text-pink-400/80 text-[10px]">♥</span>
                    <span className="text-pink-300/60 text-[8px]">♥</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-pink-600 font-black tracking-[0.35em] text-xs uppercase" style={{ fontFamily: 'Courier New, monospace' }}>KODAKI</span>
                    <span className="text-pink-400/80 font-mono text-[7px] tracking-widest">PIXEL • HEART • EDITION</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-pink-300/60 text-[8px]">♥</span>
                    <span className="text-pink-400/80 text-[10px]">♥</span>
                  </div>
                </div>
                {/* Bottom pixel border row */}
                <div className="flex w-full" style={{ height: '4px' }}>
                  {Array.from({length: 30}).map((_, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: i % 2 === 0 ? '#fce7f3' : '#f9a8d4' }}></div>
                  ))}
                </div>
              </div>
            </>
         )}
         {/* blue-tech footer removed - header only design */}
         {border === 'film-strip' && (
            <div className="mt-2 flex justify-between text-gray-500 font-mono text-[7px] tracking-widest ml-6">
              <span>KODAKI</span>
              <span>24mm</span>
            </div>
         )}
         {border === 'retro-green' && (
            <div className="mt-3 text-center">
              <div className="text-[#c8dba0] font-mono text-[9px] tracking-[0.4em] uppercase opacity-80">KODAKI • STUDIO</div>
            </div>
         )}
         {border === 'photomatics' && (
            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 mb-1">
                <div className="h-px w-8 bg-[#555]"></div>
                <span className="text-[#888] font-mono text-[7px] tracking-[0.2em] uppercase">KODAKI STUDIO</span>
                <div className="h-px w-8 bg-[#555]"></div>
              </div>
              <div className="flex gap-1 mt-1">
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#6d4c8a'}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#c95030'}}></div>
                <div className="w-3 h-3 rounded-sm" style={{backgroundColor: '#3a7a72'}}></div>
              </div>
            </div>
         )}

      </div>
    );
  }; // end renderStrip

  const renderPhotosArea = () => {
    // If double strip, in capture phase we just show a single centered strip to focus on the camera.
    // In edit phase, we show both side by side.
    const showSingleStrip = layout === '2x4-strip' && phase === 'capture';

    return (
      <div className={`pb-strips-container layout-${layout} flex justify-center w-full h-full gap-10`}>
        {layout === '2x4-strip' && !showSingleStrip ? (
           <>
             {renderStrip('left')}
             {renderStrip('right')}
           </>
        ) : (
           renderStrip('single')
        )}
      </div>
    );
  };

  // -------------------------------------------------------------
  // LANDING PHASE
  // -------------------------------------------------------------
  if (phase === 'landing') {
    return <LandingPage onStart={() => setPhase('setup')} />;
  }

  // -------------------------------------------------------------
  // SETUP PHASE
  // -------------------------------------------------------------
  if (phase === 'setup') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center pt-20 pb-8 px-4 bg-slate-50 relative">
        <header className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-50">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPhase('landing')}>
            <img src="/kodaki_logo.png" alt="Kodaki Logo" className="h-8 object-contain" />
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">Kodaki</span>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[1400px] w-full bg-white border border-slate-200 rounded-[2rem] p-5 md:p-10 shadow-2xl flex flex-col lg:flex-row-reverse gap-8 lg:gap-16 min-h-fit lg:min-h-[750px] mt-4 md:mt-12 z-10 items-stretch"
        >
          {/* Right Column: Live Visualization (Now First in DOM for mobile sticky support) */}
          <div 
            className={`w-full lg:w-[600px] xl:w-[700px] flex-shrink-0 bg-slate-50/80 rounded-3xl border border-slate-200 pt-6 pb-20 px-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden h-[450px] lg:h-auto min-h-[500px] lg:min-h-full sticky z-30 shadow-xl lg:shadow-inner mb-6 lg:mb-0 transition-all duration-500 ease-in-out ${
              showStickyPreview ? 'top-4 lg:top-auto translate-y-0 opacity-100' : 'top-4 lg:top-auto -translate-y-[120%] lg:translate-y-0 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'
            }`}
          >
             <div className="w-full flex-1 flex justify-center items-center overflow-visible">
               {/* Mobile scaling trick: CSS zoom shrinks layout bounds properly so it doesn't leave blank space */}
               <div className={['1x3', '1x4', '2x4-strip'].includes(layout) ? 'pb-zoom-1x' : 'pb-zoom-2x'}>
                 <div style={{ width: layout === '2x4-strip' ? '800px' : '500px' }}>
                   <div 
                     className={`pb-canvas-container border-${border} shadow-2xl`}
                     style={{ 
                       width: '100%', 
                       height: 'auto',
                       backgroundColor: 
                          ['studio-noir', 'camcorder', 'neon', 'film', 'directors-cut'].includes(border) ? '#0d0d0d' : 
                          border === 'film-strip' ? '#0a0a0a' :
                          border === 'social' ? '#f8fafc' : 
                          border === 'movie-ticket' ? '#f4ebd0' :
                          border === 'woodgrain' ? '#2c1a0e' :
                          border === 'airmail' ? '#f4ebd0' :
                          border === 'pixel-heart' ? '#fce7f3' :
                          border === 'blue-tech' ? '#1d4ed8' :
                          border === 'retro-green' ? '#4a5e28' :
                          border === 'stamp-strip' ? '#eef6ee' :
                          border === 'teal-photoism' ? '#4a9498' :
                          border === 'photomatics' ? '#161614' :
                          border === 'vintage-stamp' ? '#3d0e14' :
                          border === 'love-letter' ? '#fdf6ef' :
                          border === 'newspaper' ? '#f0ede4' :
                          border === 'receipt' ? '#fff9f0' :
                          border === 'none' ? '#fafafa' :
                          'white'
                     }}
                   >
                     {renderPhotosArea()}
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Always visible floating Start Camera button */}
             <div className="absolute bottom-4 left-0 w-full flex justify-center z-20">
               <button 
                 onClick={startCapture}
                 className="pb-button text-base md:text-xl px-8 md:px-12 py-3 w-[90%] max-w-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:scale-105 transition-transform bg-blue-600 text-white font-bold"
               >
                 Start Camera <ArrowRight size={24} />
               </button>
             </div>
          </div>

          {/* Left Column: Customizer */}
          <div className="w-full lg:flex-1 flex flex-col py-2 lg:max-h-[750px] lg:overflow-y-auto pr-2 custom-scrollbar">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 flex items-center gap-3 tracking-tight">
                <Sparkles className="text-blue-600" size={40} /> Customize
              </h1>
              <p className="text-slate-500 text-lg">Mix and match themes and layouts.</p>
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-4">1. Choose Layout</h2>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 mb-10">
              {LAYOUTS.map(l => {
                const isActive = layout === l.id;
                const bgClass = isActive ? 'bg-blue-500' : 'bg-slate-200 group-hover:bg-slate-300';
                
                // Helper to draw tiny layout representations
                const renderIcon = () => {
                  if (l.id === '1x1') return <div className={`w-6 h-6 rounded-sm ${bgClass} transition-colors`} />;
                  if (l.id === '1x2') return <div className="w-5 h-7 flex flex-col gap-[2px]"><div className={`w-full h-1/2 rounded-[1px] ${bgClass} transition-colors`}/><div className={`w-full h-1/2 rounded-[1px] ${bgClass} transition-colors`}/></div>;
                  if (l.id === '1x3') return <div className="w-4 h-7 flex flex-col gap-[2px]">{Array(3).fill(0).map((_,i)=><div key={i} className={`w-full flex-1 rounded-[1px] ${bgClass} transition-colors`}/>)}</div>;
                  if (l.id === '1x4') return <div className="w-4 h-8 flex flex-col gap-[2px]">{Array(4).fill(0).map((_,i)=><div key={i} className={`w-full flex-1 rounded-[1px] ${bgClass} transition-colors`}/>)}</div>;
                  if (l.id === '2x4-strip') return <div className="w-7 h-8 flex gap-[2px]"><div className="w-1/2 h-full flex flex-col gap-[2px]">{Array(4).fill(0).map((_,i)=><div key={`l${i}`} className={`w-full flex-1 rounded-[1px] ${bgClass} transition-colors`}/>)}</div><div className="w-1/2 h-full flex flex-col gap-[2px]">{Array(4).fill(0).map((_,i)=><div key={`r${i}`} className={`w-full flex-1 rounded-[1px] ${bgClass} transition-colors`}/>)}</div></div>;
                  if (l.id === '2x2') return <div className="w-7 h-7 grid grid-cols-2 gap-[2px]">{Array(4).fill(0).map((_,i)=><div key={i} className={`w-full h-full rounded-[1px] ${bgClass} transition-colors`}/>)}</div>;
                  if (l.id === '2x3') return <div className="w-6 h-8 grid grid-cols-2 gap-[2px]">{Array(6).fill(0).map((_,i)=><div key={i} className={`w-full h-full rounded-[1px] ${bgClass} transition-colors`}/>)}</div>;
                  return null;
                };

                return (
                  <div
                    key={l.id}
                    className={`group relative flex flex-col items-center justify-between p-4 gap-3 cursor-pointer rounded-2xl border-2 transition-all duration-200 overflow-hidden ${isActive ? 'border-blue-500 bg-blue-50/80 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.2)] scale-[1.02] z-10' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                    onClick={() => setLayout(l.id)}
                  >
                    {isActive && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>}
                    
                    {/* Icon container */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${isActive ? 'bg-blue-100/50' : 'bg-slate-50 group-hover:bg-white'}`}>
                      {renderIcon()}
                    </div>
                    
                    <div className="flex flex-col items-center text-center w-full">
                      <div className={`text-xs font-semibold mb-0.5 transition-colors ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>{l.name}</div>
                      <div className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${isActive ? 'text-blue-500/80' : 'text-slate-400'}`}>{l.count} Poses</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-4">2. Select Theme</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
              {PRESETS.map(p => (
                <div 
                  key={p.id} 
                  className={`relative flex flex-col p-4 gap-1 cursor-pointer rounded-2xl border-2 transition-all ${template === p.template ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md z-10' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'}`}
                  onClick={() => {
                     setTemplate(p.template);
                     const tmpl = TEMPLATES.find(t => t.id === p.template);
                     if (tmpl) { setFilter(tmpl.filter); setBorder(tmpl.border); }
                  }}
                >
                  {p.badge && (
                    <span className="absolute -top-3 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md">
                      {p.badge}
                    </span>
                  )}
                  <span className="font-bold text-slate-800 text-base">{p.name}</span>
                  <span className="text-slate-500 text-xs">
                    {template === p.template ? `${selectedLayout.name} (${selectedLayout.count} Poses)` : 'Click to preview'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // CAPTURE & EDIT PHASE
  // -------------------------------------------------------------
  return (
    <div className="pb-container bg-slate-50 flex-col items-center p-6 relative">
      <header className="w-full max-w-[1400px] flex flex-col md:flex-row justify-between items-center gap-4 mb-2 md:mb-6">
        <div className="flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center md:justify-start" onClick={() => setPhase('landing')}>
           <img src="/kodaki_logo.png" alt="Kodaki Logo" className="h-8 object-contain" />
           <span className="font-extrabold text-xl tracking-tight text-slate-900">Kodaki</span>
        </div>
        
        {phase === 'edit' && (
          <div className="flex flex-wrap justify-center md:justify-end gap-2 md:gap-4 w-full md:w-auto">
            <button onClick={handleDiscard} className="pb-button bg-slate-200 text-slate-700 hover:bg-red-500 hover:text-white shadow-none px-3 md:px-4 text-sm md:text-base">
              <Trash2 size={18} /> <span className="hidden sm:inline">Discard</span>
            </button>
            <div className="flex items-center gap-1 md:gap-2 bg-white border border-slate-200 px-2 md:px-4 rounded-full">
              <span className="hidden sm:inline text-sm font-bold text-slate-600">Copies:</span>
              <select 
                value={copies} 
                onChange={(e) => setCopies(Number(e.target.value))}
                className="bg-transparent border-none text-blue-600 font-bold focus:ring-0 cursor-pointer text-sm md:text-base"
              >
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button onClick={handleDownload} className="pb-button flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] px-3 md:px-4 text-sm md:text-base">
              <Download size={18} /> <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        )}
      </header>

      <div id="capture-container" className="flex-1 w-full max-w-[1400px] flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 h-[calc(100vh-140px)]">
        
{/* Editor Sidebar (Left side in Edit phase) */}
        {phase === 'edit' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-80 h-1/3 lg:h-full min-h-[250px] bg-white rounded-3xl p-4 lg:p-6 shadow-xl border border-slate-200 flex flex-col overflow-y-auto custom-scrollbar z-30"
          >
            <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl">
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'sticker' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setActiveTab('sticker')}
              ><Sticker size={16} className="mx-auto mb-1" /> Stickers</button>
              <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'theme' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                onClick={() => setActiveTab('theme')}
              ><Palette size={16} className="mx-auto mb-1" /> Theme</button>
            </div>

            {activeTab === 'sticker' && (
              <div className="grid grid-cols-3 gap-3">
                {STICKER_OPTIONS.map((icon, i) => (
                  <button 
                    key={i} 
                    onClick={() => addSticker(icon)}
                    className="aspect-square bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 hover:scale-105 transition-transform"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="flex flex-col gap-6">
                {/* Location Tag Editor */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Location Tag</h3>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g., Cebu City, PH"
                    maxLength={30}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">This prints subtly on select templates.</p>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Change Preset</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => {
                          const tmpl = TEMPLATES.find(t => t.id === p.template);
                          if (tmpl) { setFilter(tmpl.filter); setBorder(tmpl.border); }
                        }}
                        className={`text-xs p-2 rounded-lg border text-center cursor-pointer font-bold ${border === p.template ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div id="canvas-area-wrapper" className="flex-1 bg-slate-200/50 rounded-3xl overflow-hidden relative flex items-center justify-center p-2 lg:p-8 border border-slate-200 shadow-inner h-[400px] lg:h-auto lg:min-h-[400px]">
          
          <div className="pb-main w-full h-full flex flex-col items-center justify-center relative overflow-hidden pt-4 pb-24 lg:pb-0">
            {/* The responsive scaling wrapper outside canvasRef */}
            <div id="preview-zoom-wrapper" style={{ zoom: previewScale }}>
              <div 
                ref={canvasRef} 
                style={{ width: layout === '2x4-strip' && phase === 'edit' ? '800px' : '500px' }}
                className="relative mx-auto"
              >
              <div 
                className={`pb-canvas-container border-${border} shadow-2xl relative`}
                style={{ 
                  width: '100%', 
                  backgroundColor: ['studio-noir', 'camcorder', 'neon'].includes(border) ? '#111' : border === 'film' ? '#111' : border === 'social' ? '#f8fafc' : 'white'
                }}
              >
                {renderPhotosArea()}

                {/* Stickers Overlay */}
                {phase === 'edit' && stickers.map(st => (
                  <motion.div 
                    key={st.id}
                    drag
                    dragConstraints={canvasRef}
                    dragMomentum={false}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-1/2 left-1/2 -mt-5 -ml-5 cursor-grab active:cursor-grabbing group z-50 touch-none"
                  >
                    {st.icon}
                    <button 
                      onClick={() => removeSticker(st.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
              </div>
            </div>
          </div>

          {/* Capture Controls Overlay */}
          {phase === 'capture' && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
              <button 
                onClick={startCountdown}
                disabled={countdown !== null}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-3 disabled:opacity-50 disabled:scale-100 hover:scale-105 transition-all whitespace-nowrap"
              >
                <Camera size={28} />
                {countdown !== null ? 'Get Ready...' : photos.length === 0 ? 'Take First Photo' : `Take Photo ${photos.length + 1}/${selectedLayout.count}`}
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
