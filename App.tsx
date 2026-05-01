import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Calculator from './components/Calculator';
import Renovator from './components/Renovator';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ProSection from './components/ProSection';
import SocialProofToast from './components/SocialProofToast';
import WhatsAppWidget from './components/WhatsAppWidget';
import EspacePro from './components/EspacePro';
import { Phone, CheckCircle, Menu, X, TrendingUp, ChevronDown } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}

const SECTION_ROUTES: Record<string, string> = {
  '/devis': 'devis',
  '/devis/': 'devis',
  '/services': 'services',
  '/services/': 'services',
  '/tarifs': 'services',
  '/tarifs/': 'services',
  '/simulateur': 'renovator',
  '/simulateur/': 'renovator',
  '/simulator': 'renovator',
  '/simulator/': 'renovator',
  '/realisations': 'portfolio',
  '/realisations/': 'portfolio',
  '/portfolio': 'portfolio',
  '/portfolio/': 'portfolio',
  '/temoignages': 'testimonials',
  '/temoignages/': 'testimonials',
  '/testimonials': 'testimonials',
  '/testimonials/': 'testimonials',
  '/faq': 'faq',
  '/faq/': 'faq',
};

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (href.startsWith('/')) return; // Let normal navigation happen for actual routes
  e.preventDefault();

  // If we are not on the home page and trying to scroll to a hash, go to home first
  if (window.location.pathname !== '/' && href.startsWith('#')) {
    window.location.href = '/' + href;
    return;
  }

  const targetId = href.replace('#', '');
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const App: React.FC = () => {
  const [estimateData, setEstimateData] = useState<{zip: string, service: string} | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [availableSlots, setAvailableSlots] = useState(3);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(this, arguments as any);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  useEffect(() => {
    // Resolve the target section from either the path (SPA pushState) or a
    // hash fragment (after a Netlify redirect like /devis -> /#devis).
    const hashId = window.location.hash ? window.location.hash.slice(1) : '';
    const sectionId = SECTION_ROUTES[currentPath] || hashId;
    if (!sectionId) return;

    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (attempts < 40) {
        attempts += 1;
        requestAnimationFrame(tryScroll);
      }
    };
    requestAnimationFrame(tryScroll);
  }, [currentPath]);

  useEffect(() => {
    const handleHashChange = () => {
      const hashId = window.location.hash ? window.location.hash.slice(1) : '';
      if (!hashId) return;
      const el = document.getElementById(hashId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    const sectionId = SECTION_ROUTES[path];
    if (sectionId) {
      // Defer scroll until after the home view renders the target section
      requestAnimationFrame(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0, 0);
        }
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const NavLink: React.FC<NavLinkProps> = ({ href, children, badge, onClick }) => (
    <a 
      href={href} 
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        if (href.startsWith('/')) {
          navigateTo(href);
        } else {
          handleSmoothScroll(e, href);
        }
      }}
      className="text-sm font-bold text-gray-600 hover:text-brand-dark hover:bg-gray-50 px-3 py-2 rounded-lg transition-all flex items-center gap-2 group relative font-sans cursor-pointer"
    >
      {children}
      {badge && (
        <span className="bg-action-orange text-white text-[10px] px-1.5 py-0.5 rounded-full absolute -top-1 -right-2 animate-pulse">
          {badge}
        </span>
      )}
    </a>
  );

  const handleStartEstimate = (zip: string, service: string) => {
    setEstimateData({ zip, service });
    if (currentPath !== '/') {
      navigateTo('/devis');
    } else {
      const el = document.getElementById('devis');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, '', '/devis');
      } else {
        navigateTo('/devis');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark">
      {/* STICKY HEADER WRAPPER */}
      <div className="sticky top-0 z-50 w-full flex flex-col shadow-sm">
        {/* HIGH-CONVERTING ANNOUNCEMENT BAR */}
        <button 
          onClick={(e) => { e.preventDefault(); navigateTo('/devis'); }}
          className="w-full min-h-[40px] md:min-h-[50px] md:h-[60px] bg-[#ff5a00] hover:bg-[#e14e00] text-white font-bold flex items-center justify-center transition-colors cursor-pointer group px-2 py-1.5 md:py-0 animate-subtle-glow"
        >
          <div className="flex flex-nowrap items-center justify-center gap-1.5 md:gap-4 text-[9px] sm:text-xs md:text-sm text-center w-full max-w-full overflow-hidden">
             <div className="flex items-center whitespace-nowrap shrink overflow-hidden">
               <span className="flex h-1.5 w-1.5 md:h-2.5 md:w-2.5 relative mr-1.5 md:mr-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 md:h-2.5 w-1.5 md:w-2.5 bg-white"></span>
               </span>
               <span className="leading-tight truncate">
                 PLUS QUE {availableSlots} CRÉNEAUX <span className="hidden sm:inline">CETTE SEMAINE</span> <span className="hidden sm:inline">|</span><span className="sm:hidden"> - </span> Diagnostic OFFERT <span className="hidden sm:inline">(150€)</span>
               </span>
             </div>
             <span className="bg-white text-[#ff5a00] px-2 py-1 md:px-4 md:py-2 rounded-full font-black text-[9px] sm:text-[10px] md:text-xs shadow-sm group-hover:bg-gray-50 transition-colors uppercase tracking-wide whitespace-nowrap shrink-0">
               Obtenir mon prix
             </span>
          </div>
        </button>

        {/* Main Nav */}
        <nav className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 h-20 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex flex-col cursor-pointer z-50 group select-none" onClick={() => { navigateTo('/'); }}>
            <span className="font-sans font-black text-2xl md:text-3xl leading-none tracking-tighter text-brand-dark group-hover:scale-[1.02] transition-transform duration-300">
              LE PARQUET
            </span>
            <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.4em] text-action-orange uppercase pl-1">
              PARISIEN
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink href="/services" onClick={() => setMobileMenuOpen(false)}>TARIFS</NavLink>
            <NavLink href="/simulateur" badge="IA" onClick={() => setMobileMenuOpen(false)}>SIMULATEUR 3D</NavLink>
            <NavLink href="/realisations" onClick={() => setMobileMenuOpen(false)}>RÉALISATIONS</NavLink>
            <NavLink href="/espace-pro" onClick={() => setMobileMenuOpen(false)}>ESPACE PRO</NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:0614494907" className="text-brand-dark font-bold text-sm flex items-center gap-2 hover:text-action-orange transition-colors font-sans">
              <Phone size={16} /> 06 14 49 49 07
            </a>
            <a 
              href="/devis" 
              onClick={(e) => { e.preventDefault(); navigateTo('/devis'); setMobileMenuOpen(false); }}
              className="bg-action-orange hover:bg-action-hover text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-sans"
            >
              MON PRIX EXACT
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-brand-dark z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Mobile Navigation Overlay - MODAL STYLE FIX */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-brand-dark/90 backdrop-blur-sm lg:hidden animate-fade-in font-sans">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-scale-up">
                   {/* Header */}
                   <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex flex-col leading-none">
                         <span className="font-black text-xl text-brand-dark tracking-tighter">LE PARQUET</span>
                         <span className="text-[10px] font-bold tracking-[0.4em] text-action-orange uppercase pl-0.5">PARISIEN</span>
                      </div>
                      <button 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                      >
                         <X size={20} className="text-brand-dark" />
                      </button>
                   </div>
                   
                   {/* Links */}
                   <div className="p-6 flex flex-col gap-5">
                      <a 
                        href="/services" 
                        onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('/services'); }} 
                        className="text-lg font-bold text-brand-dark hover:text-action-orange transition-colors"
                      >
                        Tarifs & Prestations
                      </a>
                      <a 
                        href="/simulateur" 
                        onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('/simulateur'); }} 
                        className="text-lg font-bold text-brand-dark hover:text-action-orange transition-colors flex justify-between items-center"
                      >
                        Simulateur 3D <span className="bg-action-orange text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">Nouveau</span>
                      </a>
                      <a 
                        href="/realisations" 
                        onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('/realisations'); }} 
                        className="text-lg font-bold text-brand-dark hover:text-action-orange transition-colors"
                      >
                        Nos Réalisations
                      </a>
                      <a 
                        href="/espace-pro" 
                        onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('/espace-pro'); }} 
                        className="text-lg font-bold text-brand-dark hover:text-action-orange transition-colors flex items-center gap-2"
                      >
                        Espace Pro
                      </a>
                   </div>
            
                   {/* CTA */}
                   <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <a 
                        href="/devis" 
                        onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); navigateTo('/devis'); }} 
                        className="block w-full py-3.5 bg-action-orange text-white font-bold text-center rounded-xl shadow-lg active:scale-95 transition-transform"
                      >
                        OBTENIR MON PRIX
                      </a>
                   </div>
                </div>
            </div>
          )}
        </div>
      </nav>
      </div>

      <main>
        {currentPath === '/espace-pro' ? (
          <EspacePro />
        ) : (
          <>
            {/* HERO */}
            <Hero onStartEstimate={handleStartEstimate} />

            {/* TRUST BAR */}
            <div className="bg-white py-6 border-b border-gray-100 shadow-sm relative z-20 font-sans">
              <div className="container mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Prix Encadrés</span>
                <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Sans Engagement</span>
                <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-600"/> Assurance Incluse</span>
              </div>
            </div>

            {/* AI LEAD MAGNET (RENOVATOR) - MOVED UP FOR VISIBILITY */}
            <Renovator />

            {/* SERVICES */}
            <Services />

            {/* CALCULATOR - Clean White Background */}
            <div id="devis" className="bg-white py-16">
              <Calculator 
                initialZip={estimateData?.zip} 
                initialService={estimateData?.service} 
              />
            </div>

            {/* PORTFOLIO */}
            <Portfolio />
            
            {/* TESTIMONIALS */}
            <Testimonials />

            {/* PRO SECTION */}
            <ProSection />

            {/* FAQ */}
            <FAQ />
          </>
        )}
      </main>

      <footer className="bg-brand-dark text-white py-12 text-sm border-t-4 border-action-orange font-sans">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex flex-col mb-4 select-none">
               <span className="font-sans font-black text-3xl leading-none tracking-tighter text-white">LE PARQUET</span>
               <span className="font-sans text-xs font-bold tracking-[0.4em] text-action-orange uppercase pl-1">PARISIEN</span>
            </div>
            <p className="text-gray-500 mb-4">Intervention rapide 7j/7 en France, Luxembourg, Suisse, Belgique et Espagne.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">Urgence</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="text-white font-bold">06 14 49 49 07</li>
              <li>
                  <a href="https://wa.me/33614494907" className="text-green-400 hover:text-green-300 flex items-center gap-1.5 font-bold">
                      Discuter sur WhatsApp
                  </a>
              </li>
              <li>Intervention 7j/7</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white uppercase tracking-wider text-xs">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Ponçage sans poussière</li>
              <li>Vitrification</li>
              <li>Pose collée</li>
            </ul>
          </div>
          <div>
            <a 
              href="/espace-pro" 
              onClick={(e) => { e.preventDefault(); navigateTo('/espace-pro'); }}
              className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded transition-colors border border-white/20"
            >
                ESPACE PROFESSIONNELS
            </a>
          </div>
        </div>
      </footer>

      <SocialProofToast />
      <WhatsAppWidget />
      
      {/* MOBILE STICKY CTA - REDESIGNED FOR CONVERSION */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 flex gap-2 font-sans items-center safe-area-bottom">
          
          {/* WhatsApp Button - Quick Engagement */}
          <a 
            href="https://wa.me/33614494907?text=Bonjour%20!%20Je%20suis%20sur%20votre%20site%20et%20j'aimerais%20avoir%20une%20estimation%20pour%20la%20r%C3%A9novation%20de%20mon%20parquet%20%C3%A0%20Paris."
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="WhatsApp"
          >
             <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
             </svg>
          </a>

          {/* Main CTA - Price Simulation */}
          <a 
            href="/devis" 
            onClick={(e) => { e.preventDefault(); navigateTo('/devis'); }}
            className="flex-1 bg-action-orange text-white font-bold text-sm h-12 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            SIMULER MON PRIX
          </a>

          {/* Phone Button - Immediate Call */}
          <a href="tel:0614494907" className="w-12 h-12 bg-brand-dark text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform" aria-label="Appeler">
            <Phone size={20} />
          </a>
      </div>
    </div>
  );
};

export default App;