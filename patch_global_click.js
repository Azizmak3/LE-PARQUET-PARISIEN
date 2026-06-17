const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// Insert a global click listener to intercept internal link clicks
const globalClickCode = `
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href && anchor.origin === window.location.origin) {
        const path = anchor.pathname;
        if (routeToId[path]) {
          e.preventDefault();
          navigateTo(path);
        } else if (path === '/espace-pro') {
          e.preventDefault();
          navigateTo(path);
        }
      }
    };
    document.addEventListener('click', handleGlobalClick);
`;

code = code.replace(
  `window.addEventListener('popstate', handleLocationChange);`,
  `window.addEventListener('popstate', handleLocationChange);\n${globalClickCode}`
);

code = code.replace(
  `window.removeEventListener('popstate', handleLocationChange);`,
  `window.removeEventListener('popstate', handleLocationChange);\n      document.removeEventListener('click', handleGlobalClick);`
);

fs.writeFileSync('App.tsx', code);
