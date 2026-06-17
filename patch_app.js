const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// We will replace the main render logic
const mainRenderRegex = /<main>([\s\S]*?)<\/main>/;

// We need to define route mapping
const routeMapCode = `
  const routeToId: Record<string, string> = {
    '/devis': 'devis',
    '/devis/': 'devis',
    '/services': 'services',
    '/tarifs': 'services',
    '/simulateur': 'renovator',
    '/simulator': 'renovator',
    '/realisations': 'portfolio',
    '/portfolio': 'portfolio',
    '/temoignages': 'testimonials',
    '/testimonials': 'testimonials',
    '/faq': 'faq'
  };

  useEffect(() => {
    if (routeToId[currentPath]) {
      setTimeout(() => {
        const el = document.getElementById(routeToId[currentPath]);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (currentPath === '/') {
      window.scrollTo(0, 0);
    }
  }, [currentPath]);
`;

// Insert the effect after handleStartEstimate
code = code.replace(
  /const handleStartEstimate = [\s\S]*?};\n/,
  match => match + '\n' + routeMapCode + '\n'
);

// Update navigateTo to not force scroll to top if it's a section
code = code.replace(
  /window.scrollTo\(0, 0\);/g,
  `if (!['/devis', '/devis/', '/services', '/tarifs', '/simulateur', '/simulator', '/realisations', '/portfolio', '/temoignages', '/testimonials', '/faq'].includes(path)) { window.scrollTo(0, 0); }`
);

// Replace main content
const newMainContent = `<main>
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
      </main>`;

code = code.replace(mainRenderRegex, newMainContent);

fs.writeFileSync('App.tsx', code);
