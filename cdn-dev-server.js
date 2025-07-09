import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hostname = '127.0.0.1'; // localhost
const port = 3000;
const staticFilesDir = path.join(__dirname, '.'); // Directory to serve static files from

// Define common MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', 86400); // 24 hours
  if (req.method === 'OPTIONS') { // Handle preflight requests (OPTIONS method)
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  let filePath = path.join(staticFilesDir, req.url);

  // If the request is for the root, serve index.html
  if (filePath === staticFilesDir + path.sep) {
    filePath = path.join(staticFilesDir, 'index.html');
  }

  // Determine the content type based on file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found, serve a 404 page
        fs.readFile(path.join(staticFilesDir, '404.html'), (err, notFoundContent) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(notFoundContent, 'utf-8');
          }
        });
      } else {
        // Other server errors
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success: serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`Serving static files from: ${staticFilesDir}`);
});