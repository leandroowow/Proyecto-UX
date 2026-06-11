const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function responder404(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('404 - Archivo no encontrado');
}

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url.split('?')[0]);
  const normalizedPath = urlPath === '/' ? '/index.html' : urlPath;
  const safePath = path.normalize(normalizedPath).replace(/^([/\\])+/, '');
  const filePath = path.join(rootDir, safePath);

  if (!filePath.startsWith(rootDir)) {
    return responder404(response);
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      return responder404(response);
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || 'application/octet-stream';

    fs.readFile(filePath, (readError, data) => {
      if (readError) {
        return responder404(response);
      }

      response.writeHead(200, { 'Content-Type': contentType });
      response.end(data);
    });
  });
});

server.listen(port, () => {
  console.log(`ReservaVuelos listo en http://localhost:${port}`);
});