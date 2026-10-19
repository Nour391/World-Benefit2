const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const headers = fs.readFileSync(path.join(root, '_headers'), 'utf8');
test('Pi SDK loads before app auth code', () => {
  assert.ok(html.indexOf('https://sdk.minepi.com/pi-sdk.js') < html.indexOf('/app.js'));
  assert.match(js, /await\s+ensurePiInitialized\(\)/);
  assert.match(js, /init\(\{version:'2\.0'\}\)/);
});
test('auth exchanges access token with App Studio and trusts only returned identity', () => {
  assert.match(js, /https:\/\/backend\.appstudio-u7cm9zhmha0ruwv8\.piappengine\.com\/pi\/auth\/v1\/login/);
  assert.match(js, /JSON\.stringify\(\{accessToken:auth\.accessToken\}\)/);
  assert.match(js, /const verifiedUser=result\.user/);
  assert.doesNotMatch(js, /auth\.(?:uid|username)/);
  assert.match(js, /window\.worldBenefitSession=\{sessionToken:result\.sessionToken,user:\{uid:verifiedUser\.uid,username:verifiedUser\.username\}\}/);
  assert.doesNotMatch(js, /localStorage|sessionStorage/);
});
test('CSP is explicit and includes Pi auth origins without wildcards for connections', () => {
  assert.match(headers, /connect-src 'self' https:\/\/socialchain\.app https:\/\/backend\.appstudio-u7cm9zhmha0ruwv8\.piappengine\.com/);
  assert.doesNotMatch((headers.match(/connect-src[^;]*/)||[''])[0], /\*/);
  assert.doesNotMatch(headers, /default-src\s+\*/);
  assert.match(headers, /frame-ancestors 'self' https:\/\/\*\.pinet\.com https:\/\/\*\.minepi\.com/);
  assert.doesNotMatch(html, /<script>(?![^>]*src=)[\s\S]*?<\/script>/i);
  assert.match(html, /<footer>[\s\S]*?<\/footer>\s*<\/body>\s*<\/html>/i);
  assert.equal((html.match(/<html\b/gi)||[]).length, 1);
  assert.equal((html.match(/<\/html>/gi)||[]).length, 1);
});
