// Builds the soundtrack for the "Teacher's story" version of the video (no chant).
//   node audio/make-story-soundtrack.js <piano.wav> [track]
// track = "kaleidoscope" (default) or "inspiring"; each WAV is decoded from _source/audio/:
//   kaleidoscope: kaleidoscope-of-life-alexgrohl.mp3 ("Kaleidoscope Of Life", AlexGrohl)
//   inspiring:    inspiring-moment-leberch.mp3       ("Inspiring Moment", leberch)
// Both are Pixabay Content Licence. The bells are synthesised.
const path = require("path");
const { SR, readWav, writeWav, reverb, bell } = require("./make-soundtrack");

const LEN = 45;              // video length, seconds
const TRACKS = {
  // Quiet piano until 43.03 s, then the full, intense section: starting at 35.13 s puts that
  // lift at 7.9 s, as "For 27 years, and long after, he taught us…" appears. E-flat major.
  kaleidoscope: { start: 35.13, bellHz: 783.99, fadeOut: 3.5 },   // bell on G5
  // The piece's new section (62.0 s) lands on the title reveal at 25.6 s. Centres on G#.
  inspiring: { start: 36.4, bellHz: 830.61, fadeOut: 3 },         // bell on G#5
};
const BELLS = [[0.25, 0.10], [25.6, 0.06]]; // [time, level]: opening chime, title reveal

function main() {
  const name = process.argv[3] || "kaleidoscope";
  const { start, bellHz, fadeOut } = TRACKS[name];
  const [pL, pR] = readWav(process.argv[2]);
  const N = LEN * SR, L = new Float32Array(N), R = new Float32Array(N), a = Math.floor(start * SR);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    // Piano fades in under the opening chime and out at the end
    const g = Math.min(1, Math.max(0, (t - 0.4) / 1.6)) * Math.min(1, (LEN - t) / fadeOut);
    L[i] = (pL[a + i] || 0) * g;
    R[i] = (pR[a + i] || 0) * g;
  }
  for (const [at, level] of BELLS) {
    const s = bell(bellHz, 5), w = reverb(s), o = Math.floor(at * SR);
    for (let i = 0; i < s.length && o + i < N; i++) {
      const v = (s[i] * 0.6 + w[i] * 0.6) * level;
      L[o + i] += v; R[o + i] += v;
    }
  }
  // Normalise to -1 dBFS
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const k = 0.89 / peak;
  for (let i = 0; i < N; i++) { L[i] *= k; R[i] *= k; }
  writeWav(path.join(__dirname, "..", "public", "story-soundtrack.wav"), L, R);
  console.log(`story soundtrack (${name}): ${LEN}s from ${start}s, peak gain ${k.toFixed(2)}`);
}
main();
