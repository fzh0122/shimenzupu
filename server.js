const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let port = 7100, host = '127.0.0.1';
for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--port' || args[i] === '-p') && args[i+1]) port = +args[i+1];
  if ((args[i] === '--host' || args[i] === '-h') && args[i+1]) host = args[i+1];
}
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(__dirname, p);
  if (!file.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(port, host, () => console.log(`篝火营地预览: http://${host}:${port}/`));
