const { routeRe } = require('./auditRoutes.js');
const long = 'a'.repeat(20000);
const s = 'router.get("' + long + '", handler);';
const start = Date.now();
const m = routeRe.exec(s);
console.log('match?', m !== null);
console.log('duration', Date.now() - start);
