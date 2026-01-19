import React, { useState } from 'react';
import { Hammer, PaintRoller, Sparkles, Layers, ArrowRight, Clock, Check, Star, Zap, Droplets, ArrowLeftRight } from 'lucide-react';

const services = [
  {
    id: 'renovation',
    icon: <Sparkles className="w-6 h-6 text-white" />,
    title: "Rénovation Signature",
    subtitle: "Ponçage & Vitrification",
    price: "35€",
    unit: "/m²",
    features: [
      "Ponçage 3 grains (gros/moyen/fin)",
      "Vitrificateur Intensif (3 couches)",
      "Rendu Mat, Satiné ou Huilé",
      "Garantie tenue 10 ans"
    ],
    badge: "Le Plus Demandé",
    isPremium: true
  },
  {
    id: 'pose',
    icon: <Layers className="w-6 h-6 text-brand-blue" />,
    title: "Pose de Parquet",
    subtitle: "Massif ou Contrecollé",
    price: "65€",
    unit: "/m²",
    features: [
      "Pose collée (DTU 51.2)",
      "Inclus: Colle MS Polymère Pro",
      "Pose de plinthes assorties",
      "Isolation phonique offerte"
    ],
    badge: null,
    isPremium: false
  },
  {
    id: 'teinte',
    icon: <PaintRoller className="w-6 h-6 text-orange-600" />,
    title: "Mise en Teinte",
    subtitle: "Décoration & Design",
    price: "Sur Devis",
    unit: "",
    features: [
      "Nuancier de 50 teintes",
      "Huile dure écologique",
      "Effet bois brut ou vieilli",
      "Échantillon test sur place"
    ],
    badge: "Tendance 2026",
    isPremium: false
  },
  {
    id: 'water-damage',
    icon: <Droplets className="w-6 h-6 text-blue-500" />,
    title: "Spécial Dégâts des Eaux",
    subtitle: "Sauvetage & Assurances",
    price: "Devis",
    unit: "Pour Assurance",
    features: [
      "Dossier complet pour assurance",
      "Assèchement & Traitement",
      "Remplacement partiel invisible",
      "Intervention d'urgence 24h"
    ],
    badge: "Agréé Assurances",
    isPremium: false
  }
];

const Services: React.FC = () => {
  const handleScrollToCalculator = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-12 md:py-24 bg-white overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
            <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                   <Star size={12} className="text-action-orange" /> Tarifs Officiels 2026
                </div>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-brand-dark leading-tight">
                    Des forfaits clairs. <br/>
                    <span className="text-gray-400">Aucune surprise à la facture.</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-lg mt-4 hidden md:block">
                    Nos prix incluent la main d'œuvre, les matériaux professionnels et l'assurance décennale.
                </p>
            </div>
            
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                 <div className="flex items-center justify-center w-full md:w-auto gap-2 text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-100 animate-pulse">
                    <Clock size={14} /> Disponibilités : Semaine du 12 Mars
                </div>
            </div>
        </div>
        
        {/* MOBILE: Hint for scrolling */}
        <div className="md:hidden flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
            <ArrowLeftRight size={14} /> Glissez pour voir les offres
        </div>

        {/* Cards Grid / Carousel on Mobile */}
        <div className="flex overflow-x-auto pb-8 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {services.map((s) => (
            <div 
                key={s.id} 
                className={`
                    min-w-[85vw] md:min-w-0 snap-center
                    relative rounded-3xl p-6 flex flex-col transition-all duration-300 group cursor-pointer border
                    ${s.isPremium 
                        ? 'bg-brand-dark text-white border-brand-dark shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform md:-translate-y-4' 
                        : 'bg-white text-brand-dark border-gray-100 hover:border-gray-200 hover:shadow-xl'
                    }
                `}
            >
              {/* Badge */}
              {s.badge && (
                  <div className={`
                      absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm
                      ${s.isPremium ? 'bg-action-orange text-white' : 'bg-gray-100 text-gray-500'}
                  `}>
                      {s.badge}
                  </div>
              )}

              {/* Icon & Title */}
              <div className="mb-6 flex items-start justify-between md:block">
                  <div>
                      <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110
                          ${s.isPremium ? 'bg-white/10' : 'bg-gray-50'}
                      `}>
                          {s.icon}
                      </div>
                      <h3 className="font-bold text-xl mb-1">{s.title}</h3>
                      <p className={`text-sm ${s.isPremium ? 'text-gray-400' : 'text-gray-500'}`}>{s.subtitle}</p>
                  </div>
                  {/* Price moved up on mobile for tighter layout */}
                  <div className="md:hidden text-right">
                      <div className="text-2xl font-bold tracking-tight">{s.price}</div>
                      <div className="text-[10px] opacity-60">{s.unit}</div>
                  </div>
              </div>

              {/* Price (Desktop) */}
              <div className="hidden md:block mb-8 pb-8 border-b border-dashed border-gray-200/20">
                  <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium opacity-60">Dès</span>
                      <span className="text-4xl font-bold tracking-tight">{s.price}</span>
                      <span className="text-sm font-medium opacity-60">{s.unit}</span>
                  </div>
                  <p className="text-[10px] opacity-60 mt-2">Tarif indicatif. Le prix final dépend de l'état réel.</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                  {s.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                          <Check size={16} className={`shrink-0 mt-0.5 ${s.isPremium ? 'text-action-orange' : 'text-green-500'}`} />
                          <span className={s.isPremium ? 'text-gray-300' : 'text-gray-600'}>{feat}</span>
                      </li>
                  ))}
              </ul>

              {/* DOMINANT CTA - UNIFIED */}
              <a 
                href="#calculator"
                onClick={handleScrollToCalculator}
                className={`
                    w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer
                    ${s.isPremium 
                        ? 'bg-action-orange text-white hover:bg-white hover:text-brand-dark' 
                        : 'bg-brand-dark text-white hover:bg-black'
                    }
                `}
              >
                 Simuler mon prix <ArrowRight size={16} />
              </a>

            </div>
          ))}
        </div>
        
        {/* PRESSURE SENTENCE */}
        <div className="mt-8 text-center hidden md:block">
            <p className="text-sm text-gray-500 italic bg-gray-50 inline-block px-4 py-2 rounded-full border border-gray-100">
                💡 82% des projets sont ajustés à la baisse après simulation précise.
            </p>
        </div>
        
        {/* Bottom Context */}
        <div className="mt-8 md:mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-blue shrink-0">
                    <Zap className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-brand-dark text-sm md:text-base">Besoin d'un chiffrage sur mesure ?</h4>
                    <p className="text-xs md:text-sm text-gray-500">Notre IA calcule votre devis au centime près.</p>
                </div>
            </div>
            <a 
                href="#calculator" 
                onClick={handleScrollToCalculator}
                className="w-full md:w-auto text-center px-6 py-3 bg-white border-2 border-brand-dark text-brand-dark font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-colors text-sm cursor-pointer"
            >
                Lancer le calculateur →
            </a>
        </div>
      </div>
    </section>
  );
};

export default Services;