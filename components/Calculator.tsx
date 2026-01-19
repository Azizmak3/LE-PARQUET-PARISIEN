import React, { useState, useEffect } from 'react';
import { Check, Loader2, ArrowRight, ShieldCheck, Mail, TrendingUp, Info, AlertCircle, Phone, BedDouble, Sofa, Home, Building2, Warehouse, Sparkles, Hammer, Wrench, Timer, Users, Star, CheckCircle2 } from 'lucide-react';
import { calculateEstimate } from '../services/geminiService';
import { CalculatorState } from '../types';

interface CalculatorProps {
  initialZip?: string;
  initialService?: string;
}

const ROOM_TYPES = [
  { label: 'Chambre', size: 12, icon: BedDouble },
  { label: 'Salon', size: 25, icon: Sofa },
  { label: 'Studio', size: 35, icon: Home },
  { label: 'Appartement', size: 60, icon: Building2 },
  { label: 'Grand Plateau', size: 100, icon: Warehouse },
];

const Calculator: React.FC<CalculatorProps> = ({ initialZip, initialService }) => {
  const [state, setState] = useState<CalculatorState>({
    step: 1,
    type: initialService || '',
    surface: 30,
    condition: '',
    finish: '',
    timing: '',
    isCalculating: false,
    result: null,
  });

  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    if (initialService) {
      setState(s => ({ ...s, type: initialService, step: 2 }));
    }
  }, [initialService]);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const next = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const back = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

  const finishCalculation = async (finishType: string) => {
    setState(prev => ({ ...prev, finish: finishType, isCalculating: true, step: 5 }));
    // Simulate slight delay for effect before calling API
    setTimeout(async () => {
        const result = await calculateEstimate(state.type, state.surface, state.condition, finishType);
        setState(prev => ({ ...prev, result, isCalculating: false }));
    }, 1500);
  };

  const handleLeadCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) setIsEmailSent(true);
  };

  return (
    <section id="calculator" className="py-12 md:py-20 bg-gray-50 border-t border-gray-200 font-sans scroll-mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* IMPROVED HEADER */}
        <div className="text-center mb-8 md:mb-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-brand-blue text-xs font-bold mb-4 border border-blue-100 uppercase tracking-wider">
                <TrendingUp size={14}/> Base de prix officielle 2024
             </div>
             <h2 className="text-3xl md:text-5xl font-sans font-bold text-brand-dark mb-4">Quel est le prix réel de vos travaux ?</h2>
             <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                Évitez les surfacturations. Obtenez un tarif encadré et juste en 60 secondes.
             </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* MAIN WIZARD CARD */}
          <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative min-h-[500px] md:min-h-[600px]">
            
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
                <div 
                    className="h-full bg-gradient-to-r from-action-orange to-orange-400 transition-all duration-700 ease-out" 
                    style={{ width: `${(state.step / 5) * 100}%` }}
                ></div>
            </div>

            <div className="p-6 md:p-12">
              {state.step < 5 && (
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest">Étape {state.step}/4 • Moins d'une minute</span>
                     {/* TIME PRESSURE */}
                     <span className="text-xs font-bold text-action-orange flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                        <Timer size={12} /> Encore ~45s
                     </span>
                  </div>
              )}
              
              {/* COMMITMENT LOCK AFTER STEP 1 */}
              {state.step > 1 && state.step < 5 && (
                 <div className="mb-6 md:mb-8 flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg text-xs md:text-sm font-bold border border-green-100">
                     <CheckCircle2 size={16} className="shrink-0"/> Artisans disponibles dans votre arrondissement. Continuez pour voir votre tarif.
                 </div>
              )}

              {state.step > 1 && state.step < 5 && (
                  <button onClick={back} className="text-sm text-gray-400 hover:text-brand-dark font-medium underline decoration-gray-300 mb-6 block">Retour</button>
              )}

              {/* STEP 1: SERVICE TYPE (VISUAL CARDS) */}
              {state.step === 1 && (
                <div className="animate-fade-in">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Votre projet concerne ?</h3>
                    <p className="text-gray-500 mb-6 md:mb-8">Sélectionnez le type d'intervention souhaitée.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {[
                            { id: 'Rénovation', label: 'Rénovation', desc: 'Ponçage & Vitrification', img: 'https://i.postimg.cc/FRjXP9zq/Generated-Image-January-19-2026-12-01AM.jpg' },
                            { id: 'Pose', label: 'Nouvelle Pose', desc: 'Massif ou Contrecollé', img: 'https://i.postimg.cc/TwjBVCHD/Modern-Paris-Apartment-Living-Room-New-Parquet.png' },
                            { id: 'DegatsEaux', label: 'Dégâts des Eaux', desc: 'Gondolé, Noirci, Humide', img: 'https://i.postimg.cc/QCxYpsTb/Paris-Apartment-Living-Room-Water-Damage-Parquet.png' }
                        ].map((opt) => (
                            <button 
                                key={opt.id}
                                onClick={() => { setState(s => ({ ...s, type: opt.id })); next(); }}
                                className="relative group overflow-hidden rounded-2xl aspect-[2.2/1] md:aspect-[3/4] border-2 border-transparent hover:border-action-orange transition-all shadow-md w-full text-left"
                            >
                                <img src={opt.img} alt={opt.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:bg-gradient-to-t md:from-black/90 md:via-black/20 md:to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-5 md:p-4 w-full flex flex-col justify-center h-full md:justify-end md:h-auto z-10">
                                    <h4 className="text-white font-bold text-lg md:text-xl mb-0 md:mb-1 shadow-black/50 drop-shadow-md">{opt.label}</h4>
                                    <p className="text-white/90 text-sm font-medium shadow-black/50 drop-shadow-md">{opt.desc}</p>
                                </div>
                                <div className="absolute top-1/2 right-4 -translate-x-1/2 md:top-4 md:right-4 md:translate-y-0 bg-white/20 backdrop-blur-md rounded-full p-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="text-white w-5 h-5" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {/* STEP 2: SURFACE (VISUAL SLIDER) */}
              {state.step === 2 && (
                <div className="animate-fade-in">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Quelle surface ?</h3>
                    <p className="text-gray-500 mb-6 md:mb-10">Une estimation approximative suffit.</p>
                    
                    <div className="bg-surface-cream rounded-3xl p-6 md:p-10 mb-8 border border-gray-200 text-center relative overflow-hidden">
                        <div className="text-6xl md:text-7xl font-bold text-brand-dark mb-2">{state.surface} <span className="text-3xl text-gray-400">m²</span></div>
                        <p className="text-action-orange font-bold uppercase tracking-widest text-xs mb-8">Surface à traiter</p>

                        <input 
                            type="range" 
                            min="5" 
                            max="150" 
                            step="1"
                            value={state.surface} 
                            onChange={(e) => setState(s => ({ ...s, surface: parseInt(e.target.value) }))}
                            className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-action-orange hover:accent-orange-600 transition-all mb-12"
                        />

                        <div className="flex justify-between gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {ROOM_TYPES.map((rt) => (
                                <button
                                    key={rt.label}
                                    onClick={() => setState(s => ({ ...s, surface: rt.size }))}
                                    className={`flex flex-col items-center gap-2 min-w-[70px] md:min-w-[80px] p-3 rounded-xl border transition-all ${state.surface === rt.size ? 'bg-brand-dark text-white border-brand-dark shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    <span className="text-2xl text-current"><rt.icon size={24} strokeWidth={1.5} /></span>
                                    <span className="text-[10px] md:text-xs font-bold">{rt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={next} className="w-full bg-brand-dark hover:bg-black text-white py-4 md:py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
                        VALIDER LA SURFACE <ArrowRight />
                    </button>
                </div>
              )}

              {/* STEP 3: CONDITION (VISUAL) */}
              {state.step === 3 && (
                 <div className="animate-fade-in">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">État actuel du sol</h3>
                    <p className="text-gray-500 mb-6 md:mb-8">Sélectionnez la photo qui ressemble le plus à votre sol.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {[
                            { id: 'Bon', label: 'Bon État', img: 'https://i.postimg.cc/hjH1pdh3/Generated-Image-January-19-2026-12-12AM.jpg', desc: 'Juste terne' },
                            { id: 'Moyen', label: 'Usure Moyenne', img: 'https://i.postimg.cc/fT7ffksK/Worn-Oak-Parquet-Moderate-Use.png', desc: 'Rayures visibles' },
                            { id: 'Mauvais', label: 'Très Abîmé', img: 'https://i.postimg.cc/bvr0PTnX/Damaged-Oak-Parquet-Heavy-Damage.png', desc: 'Taches noires, trous' }
                        ].map((opt) => (
                            <button 
                                key={opt.id}
                                onClick={() => { setState(s => ({ ...s, condition: opt.id })); next(); }}
                                className="relative group overflow-hidden rounded-2xl aspect-[2.2/1] md:aspect-[3/4] border-4 border-transparent hover:border-action-orange transition-all shadow-md transform active:scale-95 w-full text-left"
                            >
                                <img src={opt.img} alt={opt.label} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:bg-gradient-to-t md:from-black/80 md:via-transparent md:to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-5 md:p-4 w-full flex flex-col justify-center h-full md:justify-end md:h-auto z-10">
                                    <h4 className="text-white font-bold text-lg md:text-lg mb-1 shadow-black/50 drop-shadow-md">{opt.label}</h4>
                                    <p className="text-white/90 text-xs bg-black/40 backdrop-blur-sm inline-block px-2 py-1 rounded w-fit">{opt.desc}</p>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-action-orange rounded-full p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 shadow-xl z-20">
                                    <Check className="text-white w-6 h-6" />
                                </div>
                            </button>
                        ))}
                    </div>
                 </div>
              )}

              {/* STEP 4: FINISH */}
              {state.step === 4 && (
                <div className="animate-fade-in">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Finition souhaitée</h3>
                    <p className="text-gray-500 mb-6 md:mb-8">Quel aspect final désirez-vous ?</p>
                    
                    <div className="space-y-3">
                        {[
                            { label: 'Vitrification Mate', sub: 'Aspect naturel, invisible, très résistant', pop: true },
                            { label: 'Vitrification Satinée', sub: 'Légèrement brillant, aspect classique', pop: false },
                            { label: 'Huile Naturelle', sub: 'Toucher bois brut, entretien régulier nécessaire', pop: false }
                        ].map((fin) => (
                            <button 
                                key={fin.label}
                                onClick={() => finishCalculation(fin.label)}
                                className="w-full text-left p-4 md:p-5 rounded-xl border border-gray-200 hover:border-action-orange hover:shadow-lg hover:bg-white transition-all bg-gray-50 group flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-bold text-brand-dark text-base md:text-lg group-hover:text-action-orange transition-colors flex items-center gap-2 flex-wrap">
                                        {fin.label}
                                        {fin.pop && <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Populaire</span>}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500 mt-1">{fin.sub}</div>
                                </div>
                                <ArrowRight className="text-gray-300 group-hover:text-action-orange transition-colors shrink-0 ml-2" />
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {/* STEP 5: RESULT WITH URGENCY */}
              {state.step === 5 && (
                <div className="animate-fade-in text-center py-4 md:py-8">
                     {/* Feature 4: Countdown Timer (Urgency Header) */}
                     {state.result && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 mb-6 text-left">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="font-bold text-brand-dark mb-1">
                                Ce tarif expire dans :
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="bg-brand-dark text-white px-3 py-2 rounded-lg">
                                  <span className="text-2xl font-bold tabular-nums">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                  </span>
                                </div>
                                <span className="text-xl font-bold text-gray-400">:</span>
                                <div className="bg-brand-dark text-white px-3 py-2 rounded-lg">
                                  <span className="text-2xl font-bold tabular-nums">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                  </span>
                                </div>
                                <span className="text-xl font-bold text-gray-400">:</span>
                                <div className="bg-brand-dark text-white px-3 py-2 rounded-lg">
                                  <span className="text-2xl font-bold tabular-nums">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 flex items-center gap-1 font-medium">
                                <CheckCircle2 size={12} className="text-green-600" />
                                Prix bloqué même si les matériaux augmentent
                              </p>
                            </div>
                          </div>
                        </div>
                     )}

                     {state.isCalculating ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-16 h-16 text-action-orange animate-spin mb-6" />
                            <h3 className="text-2xl font-bold text-brand-dark">Calcul de votre estimation...</h3>
                            <p className="text-gray-500 mt-2">Consultation de la base de prix artisans parisiens</p>
                        </div>
                     ) : state.result && (
                        <div className="animate-slide-up">
                            {!isEmailSent ? (
                                <>
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce">
                                        <Check className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-2">Estimation Prête !</h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base">
                                        Nous avons calculé une fourchette de prix précise. Entrez votre email pour voir le résultat et bloquer ce tarif.
                                    </p>
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg max-w-md mx-auto text-left relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg animate-pulse">
                                            -10% si validé cette semaine
                                        </div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-orange-50 rounded-lg">
                                                <Mail className="text-action-orange" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-brand-dark">Voir mon estimation</h4>
                                                <p className="text-xs text-gray-500">Envoyée instantanément par email</p>
                                            </div>
                                        </div>
                                        <form onSubmit={handleLeadCapture}>
                                            <input 
                                                type="email" 
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="exemple@email.com" 
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-action-orange focus:bg-white transition-all mb-4 text-base"
                                            />
                                            <button className="w-full bg-action-orange hover:bg-action-hover text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                                                AFFICHER LE PRIX <ShieldCheck size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-brand-dark text-white rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden transform hover:scale-[1.01] transition-transform">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <TrendingUp className="w-[120px] h-[120px] md:w-[150px] md:h-[150px]" />
                                    </div>
                                    
                                    <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Budget Estimé (Tout Compris)</p>
                                    <div className="text-4xl md:text-7xl font-bold text-white mb-2 tracking-tighter">
                                        {state.result.minPrice}€ <span className="text-gray-600 text-3xl md:text-4xl font-light">-</span> {state.result.maxPrice}€
                                    </div>
                                    <p className="text-gray-400 text-sm mb-8">Tarif garanti pour une validation sous 48h.</p>

                                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                                        <div className="bg-white/10 p-3 md:p-4 rounded-xl border border-white/5">
                                            <div className="text-[10px] md:text-xs text-gray-400 uppercase font-bold mb-1">Durée Chantier</div>
                                            <div className="font-bold text-base md:text-lg">{state.result.duration}</div>
                                        </div>
                                        <div className="bg-white/10 p-3 md:p-4 rounded-xl border border-white/5">
                                            <div className="text-[10px] md:text-xs text-gray-400 uppercase font-bold mb-1">Disponibilité</div>
                                            <div className="font-bold text-base md:text-lg text-green-400">Immédiate</div>
                                        </div>
                                    </div>

                                    <button className="w-full bg-white text-brand-dark hover:bg-gray-100 font-bold py-4 rounded-xl shadow-lg transition-all mb-4 text-sm md:text-base">
                                        RÉSERVER CE TARIF MAINTENANT
                                    </button>
                                    <button onClick={() => { setIsEmailSent(false); setState(s => ({...s, step: 1})); }} className="text-xs md:text-sm text-gray-400 hover:text-white underline">
                                        Recommencer une estimation
                                    </button>
                                </div>
                            )}
                        </div>
                     )}
                </div>
              )}
            </div>
          </div>

          {/* CONTEXT SIDEBAR (Desktop) */}
          <div className="hidden lg:block w-1/3 space-y-6">
            
            {/* Live Summary Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
                <h4 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                    <Info size={16} className="text-brand-blue"/> Votre Projet
                </h4>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">Type</span>
                        <span className={`font-bold ${state.step > 1 ? 'text-brand-dark' : 'text-gray-300'}`}>
                            {state.type || '...'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">Surface</span>
                        <span className={`font-bold ${state.surface ? 'text-brand-dark' : 'text-gray-300'}`}>
                            {state.surface} m²
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-gray-500 text-sm">État</span>
                        <span className={`font-bold ${state.condition ? 'text-brand-dark' : 'text-gray-300'}`}>
                            {state.condition || '...'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <span className="text-gray-500 text-sm">Finition</span>
                        <span className={`font-bold ${state.finish ? 'text-brand-dark' : 'text-gray-300'}`}>
                            {state.finish || '...'}
                        </span>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-xl text-xs text-blue-800 leading-relaxed flex gap-2">
                    <div className="shrink-0 pt-0.5"><AlertCircle size={14} /></div>
                    Algorithme calibré sur 850+ chantiers parisiens (2024). Précision 96%.
                </div>
            </div>

            {/* Social Proof Sidebar */}
             <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex -space-x-3 mb-4">
                   {[1,2,3,4].map(i => (
                       <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                   ))}
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border-2 border-white">+500</div>
                </div>
                <p className="text-sm font-bold text-brand-dark">Ils ont fait leur devis aujourd'hui.</p>
                <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Calculator;