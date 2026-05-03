const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  `} else if (currentPath === '/') {\n      if (!['/devis', '/devis/', '/services', '/tarifs', '/simulateur', '/simulator', '/realisations', '/portfolio', '/temoignages', '/testimonials', '/faq'].includes(path)) { window.scrollTo(0, 0); }\n    }`,
  `} else if (currentPath === '/') {\n      window.scrollTo(0, 0);\n    }`
);

fs.writeFileSync('App.tsx', code);
