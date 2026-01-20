import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, MoveHorizontal, Lock, ArrowRight, Image as ImageIcon, CheckCircle2, Download, Mail, Scan, AlertCircle, Key, Loader2 } from 'lucide-react';
import { renovateImage } from '../services/geminiService';
import HubSpotForm from './HubSpotForm';

const EXAMPLES = [
  {
    id: 'ex1',
    label: 'Salon Haussmannien',
    src: 'https://i.postimg.cc/xjX0mbK7/Generated-Image-January-19-2026-12-30AM.jpg',
    desc: 'Rénovation Point de Hongrie'
  },
  {
    id: 'ex2',
    label: 'Loft Industriel',
    src: 'https://i.postimg.cc/pdVvL9WJ/Generated-Image-January-19-2026-12-30AM-(1).jpg',
    desc: 'Restauration chêne massif'
  },
  {
    id: 'ex3',
    label: 'Chambre Moderne',
    src: 'https://i.postimg.cc/tgrjZX7b/Generated-Image-January-19-2026-12-31AM.jpg',
    desc: 'Vitrification mate'
  }
];

const Renovator: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [imageReadyToDisplay, setImageReadyToDisplay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedFinish, setSelectedFinish] = useState('vitrification-mat');
  const [imgLoadError, setImgLoadError] = useState(false);
  
  // Track container width for the nested image to prevent squishing (Desktop only)
  const [containerWidth, setContainerWidth] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to visualizer when image is set
  useEffect(() => {
    if (imagePreview && visualizerRef.current) {
        setTimeout(() => {
            visualizerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
  }, [imagePreview]);

  // Sync container width for robust slider rendering (Desktop)
  useEffect(() => {
    if (!imageContainerRef.current) return;
    
    const updateWidth = () => {
        if (imageContainerRef.current && imageContainerRef.current.offsetWidth > 0) {
            setContainerWidth(imageContainerRef.current.offsetWidth);
        }
    };

    updateWidth();
    
    const observer = new ResizeObserver(updateWidth);
    observer.observe(imageContainerRef.current);

    return () => observer.disconnect();
  }, [imageReadyToDisplay]);

  // IMAGE PRELOADER LOGIC
  useEffect(() => {
    if (!processedImage) {
      setImageReadyToDisplay(false);
      return;
    }

    // Reset ready state while loading
    setImageReadyToDisplay(false);

    const img = new Image();
    img.onload = () => {
      console.log("Image loaded successfully:", processedImage.substring(0, 50) + "...");
      setImageReadyToDisplay(true);
      if (!isLocked) setIsLocked(true);
    };
    img.onerror = (e) => {
      console.error("Failed to load processed image", e);
      setImgLoadError(true);
      setError("Impossible d'afficher l'image générée. Réessayez.");
    };
    img.src = processedImage;

  }, [processedImage]);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        if (processedImage && processedImage.startsWith('blob:')) {
            URL.revokeObjectURL(processedImage);
        }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileRef.current = file;
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // Reset state
      if (processedImage && processedImage.startsWith('blob:')) {
         URL.revokeObjectURL(processedImage);
      }
      setProcessedImage(null);
      setImageReadyToDisplay(false);
      setIsLocked(false);
      setError(null);
      setImgLoadError(false);
      setSelectedFinish('vitrification-mat');
    }
  };

  const handleSelectExample = async (src: string) => {
    setImagePreview(src);
    fileRef.current = null; 
    
    if (processedImage && processedImage.startsWith('blob:')) {
         URL.revokeObjectURL(processedImage);
    }
    setProcessedImage(null);
    setImageReadyToDisplay(false);
    setIsLocked(false);
    setError(null);
    setImgLoadError(false);
    setSelectedFinish('vitrification-mat');
  };

  const handleProcess = async (finishType = selectedFinish) => {
    if (!imagePreview) return;
    
    if (!fileRef.current) {
      if (imagePreview.startsWith('http')) {
         setIsProcessing(true);
         setTimeout(() => {
            setProcessedImage(imagePreview);
            setIsProcessing(false);
         }, 1500);
         return;
      }
      setError("Veuillez télécharger votre propre photo.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setImgLoadError(false);
    setImageReadyToDisplay(false);

    const failsafeTimer = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        if (!processedImage) {
          setError("Le serveur met trop de temps à répondre.");
        }
      }
    }, 60000); 
    
    try {
      let prompt = "Rénovation parquet finition vitrification mat naturel, aspect bois brut.";
      if (finishType === 'vitrification-brillant') prompt = "Rénovation parquet finition vitrification brillante, haute brillance.";
      if (finishType === 'huilage') prompt = "Rénovation parquet finition huilé naturel, texture bois apparente.";
      if (finishType === 'teinte-wenge') prompt = "Rénovation parquet teinte wengé sombre, bois foncé.";

      const resultUrl = await renovateImage(fileRef.current, prompt);
      clearTimeout(failsafeTimer);

      if (resultUrl) {
        if (processedImage && processedImage.startsWith('blob:')) {
            URL.revokeObjectURL(processedImage);
        }
        setProcessedImage(resultUrl); 
        setError(null);
      } else {
        setError("La rénovation a échoué. Veuillez réessayer.");
      }

    } catch (err: any) {
      clearTimeout(failsafeTimer);
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishChange = async (finishId: string) => {
    setSelectedFinish(finishId);
    await handleProcess(finishId);
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `parquet-renove-${selectedFinish}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetUpload = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    if (processedImage && processedImage.startsWith('blob:')) URL.revokeObjectURL(processedImage);
    
    setImagePreview(null);
    setProcessedImage(null);
    setImageReadyToDisplay(false);
    setError(null);
    setIsProcessing(false);
    setIsLocked(false);
    setImgLoadError(false);
    fileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSliderMove = (clientX: number) => {
    if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    }
  };

  return (
    <section id="renovator" className="py-12 md:py-24 bg-surface-gray border-t border-gray-100 overflow-hidden relative scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded-full uppercase mb-4 md:mb-6 tracking-widest shadow-lg">
               <Sparkles size={14} className="text-action-orange"/> IA Générative V3
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold text-brand-dark mb-4 md:mb-6 leading-tight">Visualisez votre futur parquet</h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Ne devinez pas le résultat. Notre intelligence artificielle analyse votre pièce 
              et génère une projection photoréaliste de votre sol rénové.
            </p>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden" id="visualizer-stage" ref={visualizerRef}>
          
          {!imagePreview ? (
            <div className="flex flex-col md:flex-row">
                {/* Upload Section */}
                <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative border-3 border-dashed border-gray-200 hover:border-action-orange rounded-2xl h-64 md:h-80 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 hover:bg-orange-50/10 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-action-orange/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.05)] group-hover:scale-110 group-hover:shadow-orange-200/50 transition-all duration-300 relative z-10">
                            <Upload className="text-action-orange w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-2 relative z-10">Téléchargez votre photo</h3>
                        <p className="text-gray-400 text-xs md:text-sm relative z-10">JPG, PNG • Max 10MB</p>
                        <button className="mt-6 md:mt-8 px-6 py-2.5 bg-brand-dark text-white text-sm font-bold rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg relative z-10">
                            Sélectionner un fichier
                        </button>
                    </div>
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        onClick={(e) => (e.currentTarget.value = '')}
                    />
                </div>

                {/* Examples Section */}
                <div className="md:w-1/2 p-6 md:p-12 bg-surface-gray/50">
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                        <ImageIcon size={20} className="text-action-orange" />
                        <h3 className="font-bold text-brand-dark text-lg">Pas de photo ? Essayez :</h3>
                    </div>
                    
                    <div className="flex overflow-x-auto gap-4 md:grid md:gap-4 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-4 md:pb-0 no-scrollbar">
                        {EXAMPLES.map((ex) => (
                            <button 
                                key={ex.id}
                                onClick={() => handleSelectExample(ex.src)}
                                className="min-w-[260px] md:min-w-0 snap-center flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-action-orange/50 hover:shadow-md transition-all text-left group"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0">
                                    <img src={ex.src} alt={ex.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-dark text-sm md:text-base group-hover:text-action-orange transition-colors">{ex.label}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{ex.desc}</p>
                                </div>
                                <ArrowRight size={16} className="ml-auto text-gray-300 group-hover:text-action-orange transform -translate-x-2 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shrink-0">
                 <button onClick={resetUpload} disabled={isProcessing} className="text-sm font-bold text-gray-500 hover:text-brand-dark flex items-center gap-2 disabled:opacity-50">
                    ← Retour
                 </button>
                 <div className="flex gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Mode Simulation</span>
                 </div>
              </div>
              
              <div className="flex flex-col md:flex-row h-full items-stretch">
                  <div className="w-full md:w-3/4 flex flex-col">
                    {processedImage && !isLocked && !error && (
                        <div className="bg-orange-50/50 border-b border-orange-100 p-4 flex flex-wrap gap-4 items-center justify-between shrink-0 animate-fade-in">
                            <div className="flex items-center gap-2 text-action-orange font-bold text-sm">
                                <Scan size={18} /> Analyse IA :
                            </div>
                            <div className="flex gap-4 text-xs md:text-sm text-gray-600">
                                <span className="font-bold text-green-600">Ponçage + Vitrification</span>
                            </div>
                            <div className="hidden md:flex items-center gap-1 text-[10px] text-gray-400 ml-auto">
                                <CheckCircle2 size={12} className="text-green-500"/> Précision 92%
                            </div>
                        </div>
                    )}

                    <div className="relative w-full bg-gray-100 group flex-1 min-h-[350px] md:min-h-[500px]">
                        {/* ERROR STATE */}
                        {(error || imgLoadError) && (
                             <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 backdrop-blur-md px-4 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Une erreur est survenue</h3>
                                <p className="text-gray-500 mb-6 text-sm max-w-sm">{error || "Impossible d'afficher l'image. Votre navigateur mobile peut manquer de mémoire."}</p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleProcess()}
                                        className="px-6 py-2 bg-brand-dark text-white rounded-lg font-bold shadow-lg hover:bg-black transition-colors"
                                    >
                                        Réessayer
                                    </button>
                                    <button 
                                        onClick={resetUpload}
                                        className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        Changer de photo
                                    </button>
                                </div>
                             </div>
                        )}

                        {/* PROCESSING STATE */}
                        {isProcessing && (
                        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 backdrop-blur-md">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-gray-100 rounded-full"></div>
                                <div className="w-24 h-24 border-4 border-action-orange border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                                <Sparkles className="absolute inset-0 m-auto text-action-orange animate-pulse" />
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-brand-dark mt-8 animate-pulse text-center px-4">L'IA rénove votre sol...</p>
                            <p className="text-sm text-gray-400 mt-2">Cela peut prendre jusqu'à 60 secondes.</p>
                        </div>
                        )}

                        {/* LOCKED STATE - UPGRADED TO CAPTURE EMAIL */}
                        {isLocked && imageReadyToDisplay && !error && (
                            <div className="absolute inset-0 z-40 backdrop-blur-xl bg-white/40 flex flex-col items-center justify-center p-6 text-center animate-fade-in overflow-y-auto">
                                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-w-md w-full border border-gray-100 transform scale-100 hover:scale-[1.02] transition-transform duration-300 my-auto">
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-action-orange to-orange-400 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-orange-200">
                                        <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">Votre rénovation est prête</h3>
                                    <p className="text-gray-500 mb-6 leading-relaxed text-sm md:text-base">
                                        Remplissez le formulaire ci-dessous pour débloquer immédiatement le résultat et recevoir votre dossier.
                                    </p>
                                    
                                    {/* Styled HubSpot Form Integration */}
                                    <HubSpotForm onSuccess={handleUnlock} submitButtonText="DÉBLOQUER & VOIR" />

                                </div>
                            </div>
                        )}

                        {/* VISUALIZER - SPLIT: MOBILE (Static) vs DESKTOP (Slider) */}
                        {!imageReadyToDisplay ? (
                        <>
                            <img src={imagePreview || undefined} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center md:hidden pb-8">
                                <button 
                                    onClick={() => handleProcess()}
                                    disabled={isProcessing || !fileRef.current}
                                    className="w-full bg-action-orange text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 animate-bounce-subtle disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Sparkles size={18} /> 
                                    {fileRef.current ? 'LANCER L\'IA' : 'PHOTO REQUISE'}
                                </button>
                            </div>
                        </>
                        ) : (
                          <>
                            {/* 1. MOBILE VERSION: Simple Static Result Image in Normal Flow */}
                            <div className="md:hidden w-full bg-gray-100 relative">
                                <img 
                                    src={processedImage || undefined} 
                                    alt="Rénovation Terminée" 
                                    className="w-full h-auto block"
                                    style={{ minHeight: '300px' }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold shadow-md z-10 flex items-center gap-1">
                                    <Sparkles size={12} className="text-action-orange"/> APRÈS
                                </div>
                            </div>

                            {/* 2. DESKTOP VERSION: Full Interactive Slider (Absolute Positioning) */}
                            <div 
                                className="hidden md:block relative w-full h-full select-none bg-gray-100 cursor-ew-resize overflow-hidden"
                                ref={imageContainerRef}
                                onMouseMove={(e) => handleSliderMove(e.clientX)}
                            >
                                {/* Bottom Layer: Renovated Image (Full) */}
                                <img 
                                    src={processedImage || undefined} 
                                    alt="Renovated" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                    draggable={false}
                                />
                                <div className="absolute top-6 right-6 bg-white/90 text-brand-dark px-3 py-1 rounded-full text-xs font-bold shadow-md z-10 pointer-events-none">APRÈS</div>
                                
                                {/* Top Layer: Original Image (Masked) */}
                                <div 
                                    className="absolute top-0 left-0 h-full overflow-hidden border-r-[3px] border-white shadow-[2px_0_15px_rgba(0,0,0,0.2)] z-20"
                                    style={{ width: `${sliderPosition}%`, willChange: 'width' }}
                                >
                                    <img 
                                        src={imagePreview || undefined} 
                                        alt="Original" 
                                        className="absolute top-0 left-0 max-w-none object-cover h-full"
                                        style={{ 
                                            width: containerWidth > 0 ? `${containerWidth}px` : '100%',
                                        }} 
                                        draggable={false}
                                    />
                                    <div className="absolute top-6 left-6 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-sm pointer-events-none">AVANT</div>
                                </div>
                                
                                {/* Slider Handle */}
                                <div 
                                    className="absolute top-0 bottom-0 w-12 -ml-6 z-30 flex items-center justify-center cursor-ew-resize"
                                    style={{ left: `${sliderPosition}%` }}
                                >
                                    <div className="w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center border-[3px] border-white/50 backdrop-blur-sm pointer-events-none">
                                        <MoveHorizontal size={20} className="text-brand-dark opacity-80" />
                                    </div>
                                </div>
                            </div>
                          </>
                        )}
                    </div>
                  </div>

                  {/* Sidebar / Controls */}
                  <div className="w-full md:w-1/4 bg-white border-l border-gray-100 flex flex-col z-10">
                      {processedImage && !error && !imgLoadError ? (
                          <div className="p-4 md:p-6 space-y-6 h-full flex flex-col">
                             <div>
                                <h3 className="font-bold text-sm mb-3 text-brand-dark">Essayez différentes finitions :</h3>
                                <div className="space-y-2">
                                    {[
                                      { id: 'vitrification-mat', name: 'Vitrification Mate', icon: '🌾', desc: 'Aspect naturel' },
                                      { id: 'vitrification-brillant', name: 'Vitrification Brillante', icon: '✨', desc: 'Éclat maximal' },
                                      { id: 'huilage', name: 'Huilage Naturel', icon: '🪵', desc: 'Chaleur authentique' },
                                      { id: 'teinte-wenge', name: 'Teinte Wengé', icon: '🌑', desc: 'Sombre et élégant' }
                                    ].map(finish => (
                                      <button
                                        key={finish.id}
                                        onClick={() => handleFinishChange(finish.id)}
                                        disabled={isProcessing}
                                        className={`w-full p-3 border rounded-xl text-left transition-all flex items-start gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                                          selectedFinish === finish.id
                                            ? 'border-action-orange bg-orange-50 ring-1 ring-action-orange'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                      >
                                        <span className="text-lg bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm border border-gray-100">{finish.icon}</span>
                                        <div>
                                            <p className={`font-bold text-sm ${selectedFinish === finish.id ? 'text-brand-dark' : 'text-gray-600'}`}>{finish.name}</p>
                                            <p className="text-[10px] text-gray-400">{finish.desc}</p>
                                        </div>
                                      </button>
                                    ))}
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button onClick={handleDownload} className="flex flex-col items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-600 active:scale-95 transition-transform">
                                    <Download size={16} /> Télécharger
                                </button>
                                <button 
                                    onClick={() => alert(`Un email de confirmation vous sera envoyé.`)}
                                    className="flex flex-col items-center justify-center gap-1 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-600 active:scale-95 transition-transform"
                                >
                                    <Mail size={16} /> Envoyer
                                </button>
                             </div>

                             <button 
                                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                                className="w-full bg-brand-dark hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                             >
                                ESTIMER CE RENDU <ArrowRight size={16} />
                             </button>
                          </div>
                      ) : (
                         /* SHOW BUTTON WHEN IMAGE IS READY BUT NOT PROCESSED */
                         <div className="p-6 flex flex-col h-full justify-center items-center text-center space-y-6">
                            {isProcessing ? (
                                <>
                                    <Sparkles className="w-12 h-12 text-action-orange animate-spin" />
                                    <p className="font-bold text-brand-dark">Analyse en cours...</p>
                                    <p className="text-xs text-gray-500">Cela prend environ 5 à 10 secondes</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                        <Sparkles className="w-8 h-8 text-action-orange" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-dark text-lg">Photo Prête !</h3>
                                        <p className="text-sm text-gray-500 mt-1">Cliquez ci-dessous pour lancer la rénovation par IA.</p>
                                    </div>
                                    {imagePreview && (
                                    <button 
                                        onClick={() => handleProcess()}
                                        className="w-full py-4 bg-action-orange text-white font-bold rounded-xl shadow-xl hover:bg-action-hover transition-all flex items-center justify-center gap-2 group transform hover:scale-[1.02]"
                                    >
                                        <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                                        LANCER L'IA
                                    </button>
                                    )}
                                    {!imagePreview && (
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-4 bg-brand-dark text-white font-bold rounded-xl shadow-xl transition-all"
                                        >
                                            Importer une photo
                                        </button>
                                    )}
                                </>
                            )}
                         </div>
                      )}
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Renovator;