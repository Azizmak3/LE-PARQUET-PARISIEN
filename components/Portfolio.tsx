import React, { useState } from 'react';
import { MoveHorizontal, MapPin, Clock, Tag, Calculator } from 'lucide-react';

const projects = [
  { 
    id: 1, 
    title: 'Rénovation Haussmannien', 
    loc: 'Paris 7ème (École Militaire)', 
    price: '3,200€',
    surface: '45m²',
    duration: '3 jours',
    before: 'https://i.postimg.cc/0Q4BvF32/Generated-Image-January-18-2026-11-37PM.jpg',
    after: 'https://i.postimg.cc/C10jqNqj/Generated-Image-January-18-2026-11-38PM.jpg'
  },
  { 
    id: 2, 
    title: 'Restauration Loft Industriel', 
    loc: 'Paris 11ème (Bastille)', 
    price: '1,850€',
    surface: '30m²',
    duration: '2 jours',
    before: 'https://i.postimg.cc/ZqbbvvqY/Generated-Image-January-18-2026-11-55PM.jpg',
    after: 'https://i.postimg.cc/tgBX3R1K/Generated-Image-January-18-2026-11-56PM.jpg'
  },
];

const PortfolioItem: React.FC<{ project: any }> = ({ project }) => {
  const [position, setPosition] = useState(50);
  
  const handleScrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col h-full group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all relative">
      <div className="relative h-[280px] md:h-[400px]">
        {/* Container for After Image (Base) */}
        <div className="absolute inset-0">
           <img src={project.after} alt="After" className="w-full h-full object-cover" />
        </div>
        
        {/* Container for Before Image (Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img src={project.before} alt="Before" className="w-full h-full object-cover grayscale brightness-90" />
          <div className="absolute top-4 left-4 bg-black/60 text-white px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold tracking-widest backdrop-blur-sm shadow-sm">AVANT</div>
        </div>
  
        <div className="absolute top-4 right-4 bg-white/90 text-brand-dark px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold tracking-widest shadow-lg">APRÈS</div>
  
        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
          style={{ left: `${position}%` }}
          onMouseDown={(e) => {
            const container = e.currentTarget.parentElement;
            const handleMove = (ev: MouseEvent) => {
              if(container) {
                const rect = container.getBoundingClientRect();
                const x = Math.max(0, Math.min(ev.clientX - rect.left, rect.width));
                setPosition((x / rect.width) * 100);
              }
            };
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', () => window.removeEventListener('mousemove', handleMove), { once: true });
          }}
          onTouchMove={(e) => {
             const container = e.currentTarget.parentElement;
             if(container) {
               const rect = container.getBoundingClientRect();
               const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
               setPosition((x / rect.width) * 100);
             }
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-brand-dark border border-gray-100">
            <MoveHorizontal size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
        </div>

        {/* OVERLAY CTA - HOVER ONLY (Desktop) or CLICK (Mobile) */}
        <div className="absolute inset-0 bg-brand-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-30 pointer-events-none md:pointer-events-auto">
            <a 
                href="#calculator" 
                onClick={handleScrollToCalculator}
                className="hidden md:flex bg-white text-brand-dark px-6 py-3 rounded-xl font-bold items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-gray-100 cursor-pointer"
            >
                <Calculator size={18} /> Estimer ce résultat chez moi
            </a>
        </div>
      </div>

      <div className="p-5 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg md:text-xl font-sans font-bold text-brand-dark mb-1 leading-tight">{project.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs md:text-sm">
                    <MapPin size={12} className="md:w-[14px] md:h-[14px]" /> {project.loc}
                </div>
            </div>
            <div className="text-right">
                <div className="text-action-orange font-bold text-lg md:text-xl">{project.price}</div>
                <div className="text-[10px] md:text-xs text-gray-400">TTC</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
             <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                 <Clock size={16} className="text-gray-400 shrink-0" />
                 <div>
                     <div className="text-[10px] uppercase text-gray-400 font-bold">Durée</div>
                     <div className="font-bold text-xs md:text-sm text-brand-dark">{project.duration}</div>
                 </div>
             </div>
             <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                 <Tag size={16} className="text-gray-400 shrink-0" />
                 <div>
                     <div className="text-[10px] uppercase text-gray-400 font-bold">Surface</div>
                     <div className="font-bold text-xs md:text-sm text-brand-dark">{project.surface}</div>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const handleScrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="portfolio" className="py-12 md:py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-block px-3 py-1 bg-action-orange/10 text-action-orange rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
              Réalisations Vérifiées
          </div>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark">Projets Populaires Récents</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto text-sm md:text-base">
            Découvrez les transformations réalisées par nos artisans partenaires cette semaine à Paris.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {projects.map(p => <PortfolioItem key={p.id} project={p} />)}
        </div>
        
        <div className="text-center mt-8 md:mt-12">
           <a 
            href="#calculator" 
            onClick={handleScrollToCalculator}
            className="inline-block px-6 py-3 md:px-8 md:py-4 bg-brand-dark text-white hover:bg-black transition-all rounded-xl font-bold shadow-lg transform hover:-translate-y-1 text-sm md:text-base cursor-pointer"
           >
             Estimer un projet similaire
           </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;