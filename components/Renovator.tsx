import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, MoveHorizontal, Lock, ArrowRight, Image as ImageIcon, CheckCircle2, Download, Mail, Scan, AlertCircle } from 'lucide-react';
import { renovateImage } from '../services/geminiService';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedFinish, setSelectedFinish] = useState('vitrification-mat');
  const [imgLoadError, setImgLoadError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imagePreview && visualizerRef.current) {
        setTimeout(() => {
            visualizerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
  }, [imagePreview]);

  // Cleanup blob URLs for preview (input only)
  useEffect(() => {
    return () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
    };
  }, [imagePreview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileRef.current = file;
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setProcessedImage(null);
      setIsLocked(false);
      setError(null);
      setImgLoadError(false);
    }
  };

  const handleSelectExample = async (src: string) => {
    setImagePreview(src);
    fileRef.current = null; 
    setProcessedImage(null);
    setIsLocked(false);
    setError(null);
    setImgLoadError(false);
  };

  const handleProcess = async (finishType = selectedFinish) => {
    if (!imagePreview) return;
    if (!fileRef.current) {
      setError("Veuillez télécharger votre propre photo pour lancer une simulation.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setImgLoadError(false);

    const failsafeTimer = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        if (!processedImage) setError("Le serveur met trop de temps à répondre.");
      }
    }, 60000); 
    
    try {
      let prompt = "Rénovation parquet finition vitrification mat naturel, aspect bois brut.";
      if (finishType === 'vitrification-brillant') prompt = "Rénovation parquet finition vitrification brillante, haute brillance.";
      if (finishType === 'huilage') prompt = "Rénovation parquet finition huilé naturel, texture bois apparente.";
      if (finishType === 'teinte-wenge') prompt = "Rénovation parquet teinte wengé sombre, bois foncé.";

      // Returns Data URL string
      const result = await renovateImage(fileRef.current, prompt);
      
      clearTimeout(failsafeTimer);

      if (result) {
        setProcessedImage(result); 
        if (!processedImage) setIsLocked(true);
      } else {
        setError("La rénovation a échoué.");
      }
    } catch (err: any) {
      clearTimeout(failsafeTimer);
      setError(err.message || "Erreur inattendue.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishChange = async (finishId: string) => {
    setSelectedFinish(finishId);
    await handleProcess(finishId);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `parquet-renove-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetUpload = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setProcessedImage(null);
    setError(null);
    setIsProcessing(false);
    setIsLocked(false);
    setImgLoadError(false);
    fileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
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
              et génère une projection photoréaliste.
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
                 <span className="text-xs font-bold uppercase text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Mode Simulation</span>
              </div>
              
              <div className="flex flex-col md:flex-row h-full items-stretch">
                  <div className="w-full md:w-3/4 flex flex-col">
                    <div className="relative w-full bg-gray-100 overflow-hidden group flex-1 min-h-[350px] md:min-h-[500px]">
                        
                        {/* ERROR STATE */}
                        {(error || imgLoadError) && (
                             <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 backdrop-blur-md px-4 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <h3 className="text-xl font-bold text-brand-dark mb-2">Erreur d'affichage</h3>
                                <p className="text-gray-500 mb-6 text-sm">{error || "Image trop lourde pour votre mobile."}</p>
                                <button onClick={resetUpload} className="px-6 py-2 bg-brand-dark text-white rounded-lg font-bold">Réessayer</button>
                             </div>
                        )}

                        {/* PROCESSING */}
                        {isProcessing && (
                        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 backdrop-blur-md">
                            <Sparkles className="w-12 h-12 text-action-orange animate-pulse mb-4" />
                            <p className="text-lg font-bold text-brand-dark animate-pulse">L'IA rénove votre sol...</p>
                        </div>
                        )}

                        {/* LOCKED STATE */}
                        {isLocked && processedImage && !error && !imgLoadError && (
                            <div className="absolute inset-0 z-40 backdrop-blur-xl bg-white/40 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                                <div className="bg-white p-8 rounded-3xl shadow-xl">
                                    <Lock className="w-8 h-8 text-action-orange mx-auto mb-4" />
                                    <button onClick={() => setIsLocked(false)} className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                                        DÉBLOQUER LE RÉSULTAT
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* VISUALIZER STAGE */}
                        {!processedImage ? (
                            <img src={imagePreview} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                        <div className="relative w-full h-full select-none touch-none bg-gray-100"
                            style={{ isolation: 'isolate' }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                                setSliderPosition((x / rect.width) * 100);
                            }}
                            onTouchMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                                setSliderPosition((x / rect.width) * 100);
                            }}
                        >
                            {/* AFTER (Background) - MOBILE FIXES */}
                            <div className="absolute inset-0 w-full h-full" style={{ 
                                transform: 'translate3d(0,0,0)', // Force GPU
                                WebkitTransform: 'translate3d(0,0,0)' 
                            }}>
                                <img 
                                    key={processedImage} // Force re-mount
                                    src={processedImage} 
                                    alt="After" 
                                    decoding="sync" // Sync is safer for immediate paint on iOS
                                    loading="eager"
                                    onError={() => setImgLoadError(true)}
                                    className="w-full h-full object-cover block"
                                />
                            </div>
                            
                            {/* BEFORE (Foreground) */}
                            <div 
                                className="absolute inset-0 w-full h-full overflow-hidden"
                                style={{ 
                                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                                    WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                                    transform: 'translate3d(0,0,0)',
                                    WebkitTransform: 'translate3d(0,0,0)',
                                    zIndex: 10
                                }}
                            >
                                <img 
                                    src={imagePreview} 
                                    alt="Before" 
                                    className="w-full h-full object-cover grayscale brightness-90 block" 
                                />
                                <div className="absolute top-6 left-6 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold">AVANT</div>
                            </div>
                            
                            {/* Slider Handle */}
                            <div 
                                className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none shadow-lg"
                                style={{ left: `${sliderPosition}%` }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-100">
                                    <MoveHorizontal size={16} className="text-brand-dark" />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="w-full md:w-1/4 bg-white border-l border-gray-100 flex flex-col z-10">
                      {!isLocked && processedImage && !error ? (
                          <div className="p-4 space-y-4">
                             <div className="space-y-2">
                                {[
                                  { id: 'vitrification-mat', name: 'Vitrification Mate' },
                                  { id: 'vitrification-brillant', name: 'Vitrification Brillante' },
                                  { id: 'huilage', name: 'Huilage Naturel' },
                                  { id: 'teinte-wenge', name: 'Teinte Wengé' }
                                ].map(finish => (
                                  <button
                                    key={finish.id}
                                    onClick={() => handleFinishChange(finish.id)}
                                    disabled={isProcessing}
                                    className={`w-full p-3 border rounded-xl text-left text-sm font-bold ${selectedFinish === finish.id ? 'bg-orange-50 border-action-orange text-brand-dark' : 'hover:bg-gray-50'}`}
                                  >
                                    {finish.name}
                                  </button>
                                ))}
                             </div>
                             <button onClick={handleDownload} className="w-full p-3 border rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-50"><Download size={16}/> Télécharger</button>
                             <button onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-brand-dark text-white p-4 rounded-xl font-bold shadow-lg">ESTIMER CE RENDU</button>
                          </div>
                      ) : (
                        <div className="hidden md:flex p-6 h-full justify-center items-center text-center text-gray-400 text-sm">
                            {!isProcessing && "Importez une photo pour commencer."}
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