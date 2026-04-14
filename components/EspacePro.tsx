import React, { useEffect, useState } from 'react';
import { FileText, Phone, ShieldCheck, Wrench, Handshake, CheckCircle2, ArrowRight, Building, Download, Star, Award, ChevronRight } from 'lucide-react';

const EspacePro: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="bg-white font-sans text-gray-900 pb-24 md:pb-0">
      {/* 1. HERO SECTION */}
      <section className="pt-16 md:pt-24 pb-16 px-4 bg-white relative overflow-hidden border-b border-gray-200">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-900 border border-gray-200 text-xs font-bold rounded-full uppercase mb-6 tracking-widest shadow-sm">
                <Building size={14} className="text-action-orange" />
                B2B · Syndics, Agences & Assurances
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-gray-900">
                Le partenaire parquet <br className="hidden md:block" />
                <span className="text-action-orange">des professionnels.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Valorisez vos biens immobiliers plus vite. Intervention prioritaire pour les syndics, agences immobilières et cabinets d'assurance en Île-de-France.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-action-orange shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Devis prioritaire sous 4h pour vos dossiers urgents</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-action-orange shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Rénovation express avant mise en vente ou location</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-action-orange shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">Gestion autonome des clés et grille tarifaire négociée</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => alert("Le téléchargement de la plaquette pro (PDF) va commencer.")}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Plaquette Pro
                </button>
                <a 
                  href="tel:0614494907"
                  className="w-full sm:w-auto bg-transparent hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={20} /> 06 14 49 49 07
                </a>
              </div>
            </div>

            {/* Right Column: Quick Contact Form */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-black text-gray-900 mb-2">Ouvrir un compte Pro</h3>
              <p className="text-gray-500 mb-6 text-sm">Accès prioritaire et tarifs remisés pour les partenaires.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom complet</label>
                    <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-action-orange transition-colors" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Téléphone</label>
                    <input type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-action-orange transition-colors" placeholder="06..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email pro</label>
                  <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-action-orange transition-colors" placeholder="email@agence.fr" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type d'activité</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-action-orange transition-colors appearance-none">
                    <option>Agence Immobilière</option>
                    <option>Syndic de Copropriété</option>
                    <option>Cabinet d'Assurance / Expertise</option>
                    <option>Architecte / Décorateur</option>
                    <option>Autre</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={formStatus !== 'idle'}
                  className="w-full bg-action-orange hover:bg-action-hover text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {formStatus === 'idle' ? (
                    <>Devenir partenaire <ArrowRight size={20} /></>
                  ) : formStatus === 'submitting' ? (
                    'Envoi en cours...'
                  ) : (
                    <>Demande envoyée <CheckCircle2 size={20} /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 flex flex-wrap justify-center md:justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-gray-600 text-sm font-medium">
            <span className="flex items-center gap-2"><Award size={16} className="text-action-orange" /> Garantie Décennale</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-action-orange" /> RC Pro à jour</span>
            <span className="flex items-center gap-2"><FileText size={16} className="text-action-orange" /> Devis sous 4h</span>
          </div>
        </div>
      </div>

      {/* 2. CE QU'ON PROPOSE */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Des services pensés pour votre activité</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-14 h-14 bg-action-orange/10 rounded-xl flex items-center justify-center mb-6">
                <Building className="text-action-orange w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Valorisation Immobilière</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Rénovation express avant mise en vente ou location. Un parquet refait à neuf augmente significativement la valeur perçue du bien.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Délai : 48h</span>
                <span className="font-black text-gray-900 text-lg">Sur devis</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="w-14 h-14 bg-action-orange/10 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="text-action-orange w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Gestion de Sinistres</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Intervention rapide après dégât des eaux. Rapport d'expertise détaillé, chiffrage précis et réfection à l'identique.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tarification</span>
                <span className="font-bold text-gray-900">Grille Assurance</span>
              </div>
            </div>

            <div className="bg-gray-900 border-2 border-action-orange text-white rounded-2xl p-8 shadow-xl">
              <div className="w-14 h-14 bg-action-orange/20 rounded-xl flex items-center justify-center mb-6">
                <Handshake className="text-action-orange w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Partenariat & Apport d'Affaires</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Commissions sur apport d'affaires ou remises sur volume pour vos clients. Un partenariat gagnant-gagnant.
              </p>
              <div className="mt-auto pt-6 border-t border-gray-800 flex flex-col gap-2">
                <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-action-orange"/> Rémunération attractive</span>
                <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-action-orange"/> Suivi de chantier délégué</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. NOTRE PROCESSUS (Timeline) */}
      <section className="py-20 px-4 bg-white border-y border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">Un processus 100% délégué</h2>
          
          <div className="relative">
            {/* Desktop Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {[
                { step: 1, title: "Demande de devis", desc: "Priorité absolue" },
                { step: 2, title: "Récupération clés", desc: "En agence ou sur site" },
                { step: 3, title: "Chiffrage 4h", desc: "Devis détaillé envoyé" },
                { step: 4, title: "Intervention", desc: "Travaux planifiés" },
                { step: 5, title: "Restitution", desc: "Chantier propre garanti" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center relative">
                  {/* Mobile Line */}
                  {idx !== 4 && <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200 z-0"></div>}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-md relative z-10 ${idx === 4 ? 'bg-action-orange text-white' : 'bg-white border-2 border-gray-200 text-gray-900'}`}>
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. RÉFÉRENCES ET CRÉDIBILITÉ */}
      <section className="py-24 px-4 bg-white border-y border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">L'exigence au service des professionnels</h2>
            <p className="text-lg text-gray-600">Des garanties solides pour des interventions sans compromis.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stat 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-action-orange font-black text-2xl border border-gray-100">
                120+
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Agences Partenaires</h4>
              <p className="text-sm text-gray-500">En Île-de-France</p>
            </div>
            
            {/* Stat 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-action-orange border border-gray-100">
                <ShieldCheck size={32} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Garantie Décennale</h4>
              <p className="text-sm text-gray-500">Police N° MAAF-7483920</p>
            </div>
            
            {/* Stat 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-action-orange border border-gray-100">
                <Award size={32} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Certifications</h4>
              <p className="text-sm text-gray-500">CTB-A+ & Assurance RC Pro</p>
            </div>
            
            {/* Stat 4 */}
            <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 flex flex-col items-center text-center hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-action-orange opacity-10">
                <Star size={120} />
              </div>
              <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-action-orange border border-gray-700 relative z-10">
                <Star size={32} className="fill-current" />
              </div>
              <h4 className="font-bold text-white mb-2 relative z-10">Note Clients</h4>
              <div className="flex items-end gap-1 relative z-10">
                <span className="text-3xl font-black text-white leading-none">4.9</span>
                <span className="text-gray-400 text-sm mb-0.5">/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FORMULAIRE DE CONTACT B2B */}
      <section className="py-20 px-4 bg-white text-gray-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Devenons partenaires</h2>
            <p className="text-gray-600">Remplissez ce formulaire pour être recontacté par notre responsable B2B sous 2 heures ouvrées.</p>
          </div>

          <div className="bg-white text-gray-900 border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl">
            {formStatus === 'success' ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Demande envoyée avec succès</h3>
                <p className="text-gray-600 mb-8">Notre équipe B2B a bien reçu votre demande et vous recontactera dans les plus brefs délais.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="text-action-orange font-bold hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Nom complet *</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Société *</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all" placeholder="Agence Immobilière XYZ" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Fonction</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all" placeholder="Directeur d'agence" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Téléphone *</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all" placeholder="06 12 34 56 78" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Email professionnel *</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all" placeholder="jean.dupont@societe.com" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Type de partenariat souhaité *</label>
                  <select required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all">
                    <option value="">Sélectionnez une option...</option>
                    <option value="valorisation">Valorisation avant vente/location</option>
                    <option value="sinistre">Gestion de sinistres (Dégât des eaux)</option>
                    <option value="apporteur">Apport d'affaires / Commissionnement</option>
                    <option value="autre">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">Message (Optionnel)</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-action-orange focus:ring-2 focus:ring-action-orange/20 outline-none transition-all resize-none" placeholder="Précisez votre besoin..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className="w-full py-4 bg-action-orange text-white font-bold rounded-xl shadow-lg hover:bg-action-hover transition-all disabled:opacity-70 flex justify-center items-center"
                >
                  {formStatus === 'submitting' ? 'Envoi en cours...' : 'Envoyer notre demande de partenariat'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EspacePro;
