const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  `        if (routeToId[path]) {
          e.preventDefault();
          navigateTo(path);
        } else if (path === '/espace-pro') {
          e.preventDefault();
          navigateTo(path);
        }`,
  `        // Intercept all internal links to our defined routes or home
        if (routeToId[path] || path === '/espace-pro' || path === '/') {
          e.preventDefault();
          navigateTo(path);
        }`
);

fs.writeFileSync('App.tsx', code);
