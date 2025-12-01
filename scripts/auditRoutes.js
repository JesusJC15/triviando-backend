const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const routesDir = path.join(srcDir, 'routes');
const appFile = path.join(srcDir, 'app.ts');

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return null;
  }
}

// Parse imports from app.ts to map import names to file paths
function parseAppMappings() {
  const content = readFile(appFile);
  if (!content) return { mounts: {}, imports: {} };

  const imports = {};
  const importRe = /import\s+(\w+)\s+from\s+['"](.+?)['"];?/g;
  let m;
  while ((m = importRe.exec(content))) {
    const name = m[1];
    const rel = m[2];
    imports[name] = path.resolve(path.dirname(appFile), rel) + (rel.endsWith('.ts') ? '' : '.ts');
  }

  const mounts = {};
  const useRe = /app\.use\(\s*['"](.+?)['"]\s*,\s*(\w+)\s*\)/g;
  while ((m = useRe.exec(content))) {
    const base = m[1];
    const name = m[2];
    mounts[name] = base;
  }

  return { imports, mounts };
}

function scanRouteFile(filePath) {
  const content = readFile(filePath);
  if (!content) return [];

  const routes = [];
  // match router.METHOD("/path", ...args)
  const routeRe = /router\.(get|post|put|delete|patch)\s*\(\s*([`'"](.*?)['"`])\s*,?([\s\S]*?)\);/g;
  let m;
  while ((m = routeRe.exec(content))) {
    const method = m[1].toUpperCase();
    const pathText = m[3];
    const rest = m[4] || '';
    const usesAuth = /authMiddleware/.test(rest);
    routes.push({ method, path: pathText, protected: usesAuth });
  }

  return routes;
}

function main() {
  const { imports, mounts } = parseAppMappings();

  const result = { unprotected: [], summary: { total: 0, unprotected: 0 }, socketAuth: false };

  // check socket auth
  const socketIndex = path.join(srcDir, 'socket', 'index.ts');
  const socketContent = readFile(socketIndex) || '';
  if (/io\.use\(.*socketAuth|socketAuthMiddleware/.test(socketContent)) {
    result.socketAuth = true;
  }

  const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));
  for (const file of files) {
    const full = path.join(routesDir, file);
    const routes = scanRouteFile(full);
    const importName = Object.keys(imports).find(k => imports[k].endsWith(`/routes/${file}`) || imports[k].endsWith(`\\routes\\${file}`));
    const base = importName && mounts[importName] ? mounts[importName] : null;

    for (const r of routes) {
      result.summary.total += 1;
      if (!r.protected) {
        result.unprotected.push({ file: `src/routes/${file}`, method: r.method, path: (base || '') + r.path });
        result.summary.unprotected += 1;
      }
    }
  }

  const outDir = path.join(root, 'audit');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outFile = path.join(outDir, 'unprotected_routes.json');
  fs.writeFileSync(outFile, JSON.stringify(result, null, 2));

  console.log('Audit complete. Results written to', outFile);
  console.log('Summary:', result.summary);
  if (result.unprotected.length) {
    console.table(result.unprotected);
  } else {
    console.log('No unprotected routes found in src/routes');
  }
  console.log('Socket auth configured (io.use(socketAuthMiddleware)):', result.socketAuth);
}

if (require.main === module) main();
