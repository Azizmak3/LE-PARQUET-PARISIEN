const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  `  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (!['/devis', '/devis/', '/services', '/tarifs', '/simulateur', '/simulator', '/realisations', '/portfolio', '/temoignages', '/testimonials', '/faq'].includes(path)) { window.scrollTo(0, 0); }
  };`,
  `  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    
    // Explicitly handle scrolling for section links in case currentPath didn't change
    const targetId = routeToId[path];
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else if (path === '/') {
      window.scrollTo(0, 0);
    }
  };`
);

fs.writeFileSync('App.tsx', code);
