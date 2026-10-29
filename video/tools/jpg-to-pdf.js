// Wraps a JPEG in a one-page PDF (page in points, same aspect as the image), no dependencies.
// Usage: node tools/jpg-to-pdf.js in.jpg out.pdf [pageWidthPt]
const fs = require("fs");
const [inp, out, wArg] = process.argv.slice(2);
const jpg = fs.readFileSync(inp);
// Read width/height from the JPEG's SOF marker
let i = 2, w, h;
while (i < jpg.length) {
  const m = jpg[i + 1], len = jpg.readUInt16BE(i + 2);
  if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { h = jpg.readUInt16BE(i + 5); w = jpg.readUInt16BE(i + 7); break; }
  i += 2 + len;
}
const pw = Number(wArg) || 420, ph = Math.round((pw * h) / w);
const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
const objs = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`,
  null, // image
  `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
];
const parts = [Buffer.from("%PDF-1.4\n")], offsets = [];
let pos = parts[0].length;
objs.forEach((o, k) => {
  offsets.push(pos);
  const buf = o !== null ? Buffer.from(`${k + 1} 0 obj\n${o}\nendobj\n`)
    : Buffer.concat([Buffer.from(`${k + 1} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`), jpg, Buffer.from("\nendstream\nendobj\n")]);
  parts.push(buf); pos += buf.length;
});
const xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("") +
  `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${pos}\n%%EOF\n`;
parts.push(Buffer.from(xref));
fs.writeFileSync(out, Buffer.concat(parts));
console.log(`${out}: ${w}x${h} image on ${pw}x${ph} pt page`);
