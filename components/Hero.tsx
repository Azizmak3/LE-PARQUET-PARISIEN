import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, Clock, ShieldCheck, ArrowRight, Star, Zap, Home, Lock } from 'lucide-react';

interface HeroProps {
  onStartEstimate: (zip: string, service: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onStartEstimate }) => {
  const [zip, setZip] = useState('');
  const [service, setService] = useState('Rénovation Complète');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length >= 2) {
      onStartEstimate(zip, service);
    }
  };

  return (
    <section className="relative w-full h-auto min-h-[600px] md:h-[650px] flex flex-col justify-center items-center py-12 bg-brand-dark overflow-hidden">
      {/* Background Image - High Contrast for Readability */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.postimg.cc/52hvcVf0/Generated-Image-January-19-2026-12-39AM.jpg" 
          alt="Rénovation Parquet Paris" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        
        {/* Availability Signal */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Plus que 3 créneaux cette semaine
        </div>

        {/* Headline - Problem First & Outcome Driven */}
        <h1 className="text-3xl md:text-6xl font-sans font-bold text-white mb-4 leading-tight shadow-sm max-w-5xl mx-auto">
          Votre parquet perd de la valeur. <br className="md:hidden" /> En ce moment.
        </h1>
        
        {/* Subhead - Speed & Certainty */}
        <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 md:mb-10 font-sans font-medium px-2">
          Les micro-dégradations s'accumulent en silence. Obtenez votre diagnostic exact en 60 secondes et sachez exactement ce que vous risquez.
        </p>

        {/* Conversion Form */}
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-2 md:p-3 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3 transform md:hover:scale-[1.01] transition-transform duration-300 w-full"
        >
          {/* Service Select */}
          <div className="relative w-full md:w-5/12 group text-left">
             <label className="text-[10px] uppercase font-bold text-gray-400 ml-4 mb-1 block">Votre besoin</label>
             <div className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-gray-800">
                <Home size={18} />
             </div>
             <select 
               value={service}
               onChange={(e) => setService(e.target.value)}
               className="w-full h-12 md:h-10 pl-10 pr-8 bg-transparent border-none outline-none text-brand-dark font-sans font-bold text-base md:text-lg focus:ring-0 cursor-pointer appearance-none"
             >
               <option>Rénovation (Ponçage/Vitrification)</option>
               <option>SOS Dégâts des Eaux</option>
               <option>Pose de Parquet Neuf</option>
               <option>Entretien / Huilage</option>
             </select>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          {/* Zip Input */}
          <div className="relative w-full md:w-4/12 group text-left">
             <label className="text-[10px] uppercase font-bold text-gray-400 ml-4 mb-1 block">Code Postal</label>
             <div className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-gray-800">
                <MapPin size={18} />
             </div>
             <input 
               type="tel" 
               placeholder="750..." 
               value={zip}
               onChange={(e) => setZip(e.target.value)}
               className="w-full h-12 md:h-10 pl-10 pr-4 bg-transparent border-none outline-none text-brand-dark font-sans font-bold text-base md:text-lg focus:ring-0 placeholder:text-gray-300"
               required
             />
          </div>

          {/* Action Button - OWNERSHIP */}
          <button 
            type="submit"
            className="w-full md:w-4/12 h-14 md:h-16 bg-action-orange hover:bg-action-hover text-white font-sans font-bold text-lg rounded-lg shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
          >
            OBTENIR MON PRIX
          </button>
        </form>

        {/* Micro-Reassurance */}
        <div className="mt-6 flex flex-col items-center gap-2 text-gray-400 text-[10px] md:text-xs font-medium">
            <p className="flex items-center gap-2">
                <Clock size={10} /> 30 secondes • <Lock size={10} /> Données non partagées
            </p>
            <p className="text-action-orange font-bold animate-pulse">
                14 dossiers ouverts à Paris ce matin · 4.9/5 · 523 chantiers
            </p>
        </div>

      </div>
    </section>
  );
};

export default Hero;