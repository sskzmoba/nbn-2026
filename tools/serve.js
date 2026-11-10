// Minimal static server for previewing the site locally (GET + HEAD, range requests for media).
// Usage: node tools/serve.js [folder] [port]   (defaults: docs/ next to this script, port 5181)
// Not part of the website: GitHub Pages serves docs/ only.
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.resolve(process.argv[2] || path.join(__dirname, "..", "docs")), port = +process.argv[3] || 5181;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".pdf": "application/pdf", ".ics": "text/calendar" };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(f).size, type = types[path.extname(f)] || "application/octet-stream";
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range) {
    const start = range[1] ? +range[1] : 0, end = range[2] ? +range[2] : size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
    return req.method === "HEAD" ? res.end() : fs.createReadStream(f, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes", "Cache-Control": "no-store" });
  req.method === "HEAD" ? res.end() : fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log("serving " + root + " on http://localhost:" + port));
