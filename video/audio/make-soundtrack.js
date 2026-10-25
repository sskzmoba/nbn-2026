// Builds the soundtrack for the Guiding Lights video (and the website's chant file).
//   node audio/make-soundtrack.js <chant.wav>
// The chant WAV is decoded from _source/audio/asatoma-2.mp3 (see build.md). Everything else
// (tanpura drone, bell) is synthesised here, so it carries no licence of its own.
const fs = require("fs");
const path = require("path");

const SR = 44100;
const LEN = 45;                 // video length, seconds
const CHANT_AT = 1.0;           // chant starts 1 s into the video
const CHANT_IN = 0.15, CHANT_OUT = 18.55; // keep the three lines, drop the closing "Om"
const SA = 185.5 / 2;           // chant is sung on F#3 (~185.5 Hz); Sa = F#2
const BELLS = [25.6, 42.5];     // title reveal, closing card

// Seeded random numbers, so every run produces the same soundtrack
let seed = 20261121;
const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// ---------- WAV I/O (16-bit PCM) ----------
function readWav(file) {
  const b = fs.readFileSync(file);
  let p = 12, ch = 2, data;
  while (p < b.length) {
    const id = b.toString("ascii", p, p + 4), size = b.readUInt32LE(p + 4);
    if (id === "fmt ") ch = b.readUInt16LE(p + 10);
    if (id === "data") { data = b.subarray(p + 8, p + 8 + size); break; }
    p += 8 + size + (size & 1);
  }
  const s = new Int16Array(data.buffer, data.byteOffset, data.length >> 1);
  const n = s.length / ch, L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) { L[i] = s[i * ch] / 32768; R[i] = s[i * ch + (ch > 1 ? 1 : 0)] / 32768; }
  return [L, R];
}
function writeWav(file, L, R) {
  const n = L.length, b = Buffer.alloc(44 + n * 4);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 4, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28);
  b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 4, 40);
  const c = v => Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
  for (let i = 0; i < n; i++) { b.writeInt16LE(c(L[i]), 44 + i * 4); b.writeInt16LE(c(R[i]), 46 + i * 4); }
  fs.writeFileSync(file, b);
}

// ---------- Effects ----------
// Freeverb-style room: 8 parallel combs + 4 series allpasses per channel
function reverb(input, { size = 0.86, damp = 0.35, spread = 0 } = {}) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(d => ({ buf: new Float32Array(d + spread), i: 0, f: 0 }));
  const alls = [556, 441, 341, 225].map(d => ({ buf: new Float32Array(d + spread), i: 0 }));
  const out = new Float32Array(input.length);
  for (let n = 0; n < input.length; n++) {
    const x = input[n] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.f = o * (1 - damp) + c.f * damp;
      c.buf[c.i] = x + c.f * size;
      c.i = (c.i + 1) % c.buf.length;
      y += o;
    }
    for (const a of alls) {
      const o = a.buf[a.i];
      a.buf[a.i] = y + o * 0.5;
      a.i = (a.i + 1) % a.buf.length;
      y = o - y;
    }
    out[n] = y;
  }
  return out;
}
const env = (n, len, fadeIn, fadeOut) => Math.min(1, n / (fadeIn * SR || 1), (len - n) / (fadeOut * SR || 1));

// ---------- Tanpura: Karplus–Strong strings with a buzzing bridge (jawari) ----------
function pluck(freq, seconds, bright = 0.5) {
  const n = Math.floor(seconds * SR), out = new Float32Array(n);
  const period = SR / freq, len = Math.floor(period), frac = period - len;
  const buf = new Float32Array(len + 2);
  for (let i = 0; i < buf.length; i++) buf[i] = (rand() * 2 - 1) * (0.6 + 0.4 * rand());
  let idx = 0, last = 0;
  for (let i = 0; i < n; i++) {
    const a = buf[idx], b = buf[(idx + 1) % buf.length];
    const v = a + (b - a) * frac;
    const filtered = (v * bright + last * (1 - bright)) * 0.9993;
    last = filtered;
    buf[idx] = filtered;
    idx = (idx + 1) % len;
    out[i] = Math.tanh(v * 2.2) * 0.5 + v * 0.5; // soft clipping gives the jawari shimmer
  }
  return out;
}
function tanpura(seconds) {
  const L = new Float32Array(seconds * SR), R = new Float32Array(seconds * SR);
  // Classic cycle: Pa, Sa', Sa', Sa (one pluck per second, four-second cycle)
  const strings = [[SA * 1.5, -0.4, 1], [SA * 2, 0.2, 1], [SA * 2, 0.35, 1], [SA, -0.1, 0.6]];
  const cycle = 4.2;
  for (let t = 0, k = 0; t < seconds; t += cycle / 4, k++) {
    const [f, pan, level] = strings[k % 4];
    const note = pluck(f * (1 + (rand() - 0.5) * 0.0015), 6, 0.55).map(v => v * level);
    const start = Math.floor((t + (rand() - 0.5) * 0.04) * SR);
    for (let i = 0; i < note.length && start + i < L.length; i++) {
      if (start + i < 0) continue;
      L[start + i] += note[i] * (1 - pan) * 0.5;
      R[start + i] += note[i] * (1 + pan) * 0.5;
    }
  }
  return [L, R];
}

// ---------- Bell: inharmonic partials with exponential decay ----------
function bell(freq, seconds) {
  const n = Math.floor(seconds * SR), out = new Float32Array(n);
  const partials = [[1, 1, 3.5], [2.0, 0.55, 2.6], [2.76, 0.4, 2.0], [5.4, 0.22, 1.2], [8.93, 0.12, 0.7]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = 0;
    for (const [r, a, d] of partials) v += a * Math.sin(2 * Math.PI * freq * r * t) * Math.exp(-t / d);
    out[i] = v * Math.min(1, t / 0.004);
  }
  return out;
}

// ---------- Mix ----------
function main() {
  const chantFile = process.argv[2];
  const [cL, cR] = readWav(chantFile);
  const a = Math.floor(CHANT_IN * SR), b = Math.floor(CHANT_OUT * SR);
  const chantDry = [cL.slice(a, b), cR.slice(a, b)];
  chantDry.forEach(ch => { for (let i = 0; i < ch.length; i++) ch[i] *= env(i, ch.length, 0.03, 0.3); });
  // Pad 3.5 s of silence so the reverb tail can ring out
  const tail = 3.5 * SR;
  const pad = ch => { const o = new Float32Array(ch.length + tail); o.set(ch); return o; };
  const dryL = pad(chantDry[0]), dryR = pad(chantDry[1]);
  const wetL = reverb(dryL), wetR = reverb(dryR, { spread: 23 });
  const chantL = dryL.map((v, i) => v * 0.82 + wetL[i] * 0.42);
  const chantR = dryR.map((v, i) => v * 0.82 + wetR[i] * 0.42);

  const N = LEN * SR, L = new Float32Array(N), R = new Float32Array(N);
  const [tL, tR] = tanpura(LEN);
  const tWetL = reverb(tL), tWetR = reverb(tR, { spread: 23 });
  const chantEnd = CHANT_AT + (CHANT_OUT - CHANT_IN);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    // Drone sits low under the voice, rises once the chant ends, fades out at the close
    const under = t < chantEnd ? 0.16 : Math.min(0.25, 0.16 + (t - chantEnd) * 0.03);
    const g = under * Math.min(1, t / 3) * Math.min(1, (LEN - t) / 2.5);
    L[i] += (tL[i] * 0.7 + tWetL[i] * 0.5) * g;
    R[i] += (tR[i] * 0.7 + tWetR[i] * 0.5) * g;
  }
  const off = Math.floor(CHANT_AT * SR);
  for (let i = 0; i < chantL.length && off + i < N; i++) { L[off + i] += chantL[i]; R[off + i] += chantR[i]; }
  for (const at of BELLS) {
    const s = bell(SA * 8, 5), w = reverb(s), o = Math.floor(at * SR);
    for (let i = 0; i < s.length && o + i < N; i++) {
      const v = (s[i] * 0.6 + w[i] * 0.6) * 0.09 * Math.min(1, (LEN - (o + i) / SR) / 2.5);
      L[o + i] += v; R[o + i] += v;
    }
  }
  // Normalise to -1 dBFS
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const k = 0.89 / peak;
  for (let i = 0; i < N; i++) { L[i] *= k; R[i] *= k; }
  const outDir = path.join(__dirname, "..", "public");
  writeWav(path.join(outDir, "soundtrack.wav"), L, R);

  // Website chant: the same chant with reverb over a quiet drone, 1 s lead-in
  const webLen = Math.floor((chantEnd + 3.2) * SR), wL = L.slice(0, webLen), wR = R.slice(0, webLen);
  for (let i = 0; i < webLen; i++) { const f = Math.min(1, (webLen - i) / (2 * SR)); wL[i] *= f; wR[i] *= f; }
  writeWav(path.join(__dirname, "chant-web.wav"), wL, wR);
  console.log(`soundtrack.wav ${LEN}s, chant ends at ${chantEnd.toFixed(2)}s, peak gain ${k.toFixed(2)}`);
}
main();
