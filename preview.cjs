const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp4':'video/mp4','.pdf':'application/pdf'};
http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if(!fs.existsSync(file)&&!path.extname(file))file+='.html';
  if (!file.startsWith(root + path.sep)) {res.writeHead(403);return res.end();}
  fs.stat(file,(err,stat)=>{if(err){res.writeHead(404);res.end('Not found');return;}const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Accept-Ranges':'bytes'};if(req.headers.range){const range=/bytes=(\d+)-(\d*)/.exec(req.headers.range);if(!range){res.writeHead(416);return res.end()}const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),stat.size-1):stat.size-1;if(start>=stat.size){res.writeHead(416);return res.end()}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});fs.createReadStream(file,{start,end}).pipe(res);}else{res.writeHead(200,{...headers,'Content-Length':stat.size});fs.createReadStream(file).pipe(res)}});
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));

