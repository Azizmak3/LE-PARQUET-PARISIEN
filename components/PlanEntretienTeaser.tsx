import React from 'react';
import { ArrowRight, Search, ShieldCheck, Clock } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
}

const PlanEntretienTeaser: React.FC<Props> = ({ onNavigate }) => {
  return (
    <section className="py-20 px-4 bg-[#F8F8F6] font-sans border-y border-gray-100">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-action-orange text-xs font-bold rounded-full uppercase mb-6 tracking-widest">
          <span className="w-2 h-2 bg-action-orange rounded-full animate-pulse"></span>
          NOUVEAU · Plan Entretien
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6 leading-tight">
          Vous avez investi dans un beau parquet. Protégez-le.
        </h2>
        
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Notre programme d'entretien annuel détecte les problèmes avant qu'ils coûtent cher. À partir de 32€/mois.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-action-orange w-6 h-6" />
            </div>
            <h3 className="font-bold text-brand-dark text-lg">Inspection annuelle complète</h3>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-action-orange w-6 h-6" />
            </div>
            <h3 className="font-bold text-brand-dark text-lg">Re-huilage & protection inclus</h3>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-action-orange w-6 h-6" />
            </div>
            <h3 className="font-bold text-brand-dark text-lg">Intervention prioritaire si besoin</h3>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={(e) => { e.preventDefault(); onNavigate('/plan-entretien'); }}
            className="bg-action-orange hover:bg-action-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
          >
            Découvrir le Plan Entretien <ArrowRight size={20} />
          </button>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
            <span className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=4" alt="User" className="w-6 h-6 rounded-full border-2 border-[#F8F8F6]" />
              <img src="https://i.pravatar.cc/100?img=5" alt="User" className="w-6 h-6 rounded-full border-2 border-[#F8F8F6]" />
              <img src="https://i.pravatar.cc/100?img=6" alt="User" className="w-6 h-6 rounded-full border-2 border-[#F8F8F6]" />
            </span>
            47 clients parisiens déjà inscrits ce mois
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlanEntretienTeaser;
