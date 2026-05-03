const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  `      if (anchor && anchor.href && anchor.origin === window.location.origin) {`,
  `      if (anchor && anchor.href && anchor.origin === window.location.origin && !anchor.hash) {`
);

fs.writeFileSync('App.tsx', code);
