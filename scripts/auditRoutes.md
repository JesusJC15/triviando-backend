# Audit Routes Script

What it does
- Scans `src/routes/*.ts` for Express router route usages (e.g. `router.get('/path', ...)`).
- Detects whether routes are protected by `authMiddleware` by checking the middleware list in the same call.
- Reads `src/app.ts` to map mounted route bases (e.g. `app.use('/api/v1', authRoutes)`) so paths in the report include the base if available.
- Checks `src/socket/index.ts` for socket auth middleware usage.

Output
- Writes `audit/unprotected_routes.json` with the structure:

```json
{
  "unprotected": [
    { "file": "src/routes/auth.routes.ts", "method": "POST", "path": "/api/v1/auth/login" },
    ...
  ],
  "summary": { "total": 8, "unprotected": 4 },
  "socketAuth": true
}
```

Notes about parsing and safety
- The route parser uses a robust regex that:
  - Matches opening/closing quote characters using a backreference so they must be the same.
  - Uses a tempered token (allows escaped chars or any char that's not the closing quote) to avoid catastrophic backtracking (ReDoS).
- Captured route strings are unescaped (e.g. `"` becomes `"`, `\u00A9` becomes the actual character). The script returns the cleaned value in the `path` field.

How to run
- From repository root run:

```pwsh
node .\scripts\auditRoutes.js
```

- The script is safe to run locally and in CI. To run only the exported helpers from Node:

```pwsh
node -e "const { scanRouteFile } = require('./scripts/auditRoutes.js'); console.log(scanRouteFile('src/routes/auth.routes.ts'))"
```

Compatibility
- The script is CommonJS (`.js`) but exports named helpers via `exports.<name>` for easier consumption by TypeScript/ESM tooling.

If you want a stricter parser (AST-based) instead of regex-based parsing, we can replace the regex with a TypeScript AST approach to be more robust for edge cases (but that increases complexity and dependencies).