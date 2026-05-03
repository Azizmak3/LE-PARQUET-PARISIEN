const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// remove routeToId from inside App
const routeToIdRegex = /  const routeToId: Record<string, string> = {[\s\S]*?};\n/;
const match = code.match(routeToIdRegex);
if (match) {
  code = code.replace(match[0], '');
  // add it before const App: React.FC = () => {
  code = code.replace('const App: React.FC = () => {', match[0] + '\nconst App: React.FC = () => {');
}

fs.writeFileSync('App.tsx', code);
