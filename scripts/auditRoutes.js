const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const routesDir = path.join(srcDir, 'routes');
const appFile = path.join(srcDir, 'app.ts');

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
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
  // The `routeRe` is declared in module scope (below) and uses a backreference
  // for the opening/closing quote plus a tempered token for the internal
  // content so it avoids catastrophic backtracking.
  let m;
  while ((m = routeRe.exec(content))) {
    const method = m[1].toUpperCase();
    // Raw captured value (content between the quotes)
    const rawPath = m[3];
    // Unescape common JS string escapes so callers get a "clean" path.
    // Handle unicode/hex escapes first, then common single-character escapes.
    const pathText = rawPath
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\(["'`\\/bfnrtv])/g, (_, esc) => {
        const map = {
          'b': '\b',
          'f': '\f',
          'n': '\n',
          'r': '\r',
          't': '\t',
          'v': '\v',
          '"': '"',
          "'": "'",
          '`': '`',
          '\\': '\\',
          '/': '/'
        };
        return map.hasOwnProperty(esc) ? map[esc] : esc;
      });
    const rest = m[4] || '';
    const usesAuth = /authMiddleware/.test(rest);
    routes.push({ method, path: pathText, protected: usesAuth });
  }

  return routes;
}

// Exported for unit testing the regex behavior and for reuse.
const routeRe = /router\.(get|post|put|delete|patch)\s*\(\s*([`'\"])((?:\\.|(?!\2).)*)\2\s*,?([\s\S]*?)\);/g;

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

// Export helpers for unit tests and reuse. Use named exports on `exports` so
// the module is easier to consume from CommonJS and aligns better with
// TypeScript/ESM-style named exports.
exports.parseAppMappings = parseAppMappings;
exports.scanRouteFile = scanRouteFile;
exports.routeRe = routeRe;
exports.main = main;
