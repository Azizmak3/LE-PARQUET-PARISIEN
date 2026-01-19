import React from 'react';
import { Building2, Key, Clock, Percent, ArrowRight, FileCheck, ArrowLeftRight } from 'lucide-react';

const ProSection: React.FC = () => {
  const handleScrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pro" className="py-12 md:py-24 bg-white text-brand-dark relative overflow-hidden border-t border-gray-100 scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blue/5 skew-x-12 transform translate-x-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <div className="lg:w-1/2 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-brand-blue border border-blue-100 text-xs font-bold uppercase tracking-widest mb-6">
              <Building2 size={14} /> Espace Partenaires
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4 md:mb-6 leading-tight text-brand-dark">
              Valorisez vos biens plus vite.
            </h2>
            <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed">
              Syndics, Architectes, Agents : déléguez la rénovation. Rénovation express avant vente ou location. Devis prioritaire sous 4h.
            </p>

            {/* Mobile Scroll Hint */}
            <div className="md:hidden flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                <ArrowLeftRight size={14} /> Avantages exclusifs
            </div>

            {/* Benefits Grid / Carousel */}
            <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
              <div className="min-w-[280px] md:min-w-0 snap-center flex gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-100 shadow-sm hover:shadow-md">
                <div className="shrink-0 w-10 h-10 rounded-full bg-action-orange flex items-center justify-center text-white">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-brand-dark">Intervention Flash</h4>
                  <p className="text-sm text-gray-500">Rénovation express avant mise en vente (48h).</p>
                </div>
              </div>

              <div className="min-w-[280px] md:min-w-0 snap-center flex gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-100 shadow-sm hover:shadow-md">
                <div className="shrink-0 w-10 h-10 rounded-full bg-action-orange flex items-center justify-center text-white">
                  <Percent size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-brand-dark">Commissions Apporteur</h4>
                  <p className="text-sm text-gray-500">Remises sur volume et commissionnement sur apport.</p>
                </div>
              </div>

              <div className="min-w-[280px] md:min-w-0 snap-center flex gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-100 shadow-sm hover:shadow-md">
                <div className="shrink-0 w-10 h-10 rounded-full bg-action-orange flex items-center justify-center text-white">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-brand-dark">Gestion des Clés</h4>
                  <p className="text-sm text-gray-500">Autonomie totale. Récupération des clés en agence.</p>
                </div>
              </div>

              <div className="min-w-[280px] md:min-w-0 snap-center flex gap-4 p-4 rounded-xl bg-white hover:bg-gray-50 transition-all border border-gray-100 shadow-sm hover:shadow-md">
                <div className="shrink-0 w-10 h-10 rounded-full bg-action-orange flex items-center justify-center text-white">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 text-brand-dark">Devis Prioritaire</h4>
                  <p className="text-sm text-gray-500">Chiffrage officiel sous 4h pour vos dossiers urgents.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/33614494907?text=Bonjour,%20je%20suis%20un%20professionnel%20et%20je%20souhaite%20ouvrir%20un%20compte%20prioritaire."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-brand-dark text-white font-bold rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto cursor-pointer"
              >
                OUVRIR UN COMPTE PRO PRIORITAIRE
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 group">
              <img 
                src="https://i.postimg.cc/fyPyxcLD/Generated-Image-January-19-2026-12-42AM.jpg" 
                alt="Bureau Architecture Paris" 
                className="w-full h-[400px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-90 md:opacity-100"></div>
              
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/20">
                  <div className="flex items-center gap-4 mb-3 md:mb-4">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" alt="Partner" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-action-orange" />
                    <div>
                      <div className="font-bold text-white text-sm md:text-base">Jean-Marc V.</div>
                      <div className="text-[10px] md:text-xs text-gray-300">Directeur Agence Orpi Paris 15</div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-200 italic leading-relaxed">
                    "Le Parquet Parisien est devenu notre atout n°1 pour valoriser les appartements avant vente. Une réactivité qu'on ne trouve nulle part ailleurs."
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProSection;