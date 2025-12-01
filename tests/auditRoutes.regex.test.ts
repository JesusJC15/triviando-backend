const { routeRe } = require('../scripts/auditRoutes.js');

describe('routeRe regex', () => {
  test('matches a normal route and captures path', () => {
    const s = `router.get('/api/v1/test', authMiddleware, handler);`;
    const m = routeRe.exec(s);
    expect(m).not.toBeNull();
    if (m) {
      expect(m[1]).toBe('get');
      expect(m[3]).toBe('/api/v1/test');
    }
    // reset lastIndex for global regex to avoid cross-test leakage
    routeRe.lastIndex = 0;
  });

  test('handles escaped quotes inside string', () => {
    const s = `router.post("/api/v1/quote\\\"here", handler);`;
    const m = routeRe.exec(s);
    expect(m).not.toBeNull();
    // The regex captures the raw content inside quotes, including backslashes
    if (m) expect(m[3]).toBe('/api/v1/quote\\\"here');
    routeRe.lastIndex = 0;
  });

  test('does not exhibit super-linear runtime on long input', () => {
    const long = 'a'.repeat(20000);
    const s = `router.get("${long}", handler);`;
    const start = Date.now();
    const m = routeRe.exec(s);
    const duration = Date.now() - start;
    // Should be fast (under 200ms) — tuned for CI machine speeds
    expect(duration).toBeLessThan(200);
    expect(m).not.toBeNull();
    routeRe.lastIndex = 0;
  });
});
