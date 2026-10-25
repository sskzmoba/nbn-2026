import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/LibreCaslonDisplay";
import { loadFont as loadText } from "@remotion/google-fonts/LibreCaslonText";
import { loadFont as loadDeva } from "@remotion/google-fonts/TiroDevanagariSanskrit";

// 45 s vertical film for WhatsApp Status: prayer → N. B. N. Sir → Guiding Lights → sessions → date → OBA.
// Soundtrack: public/soundtrack.wav, made by audio/make-soundtrack.js (chant lines are timed to it).
const display = loadDisplay().fontFamily;
const text = loadText("normal", { weights: ["400", "700"] }).fontFamily;
loadText("italic", { weights: ["400"] });
const deva = loadDeva().fontFamily;

const C = { night: "#05070d", navy: "#0b1830", gold: "#ffd38a", goldDeep: "#c99a3c", cream: "#f4efe6", muted: "#b9c1d0" };

export const FPS = 30;
export const TOTAL_FRAMES = 45 * FPS;
const s = (sec: number) => Math.round(sec * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.quad);

// Fade in over [a, a+inn], hold, fade out over [b-out, b]
function fade(frame: number, a: number, b: number, inn = 0.8, out = 0.6) {
  return interpolate(frame, [a * FPS, (a + inn) * FPS, (b - out) * FPS, b * FPS], [0, 1, 1, 0], clamp);
}

// ---------- 1. Prayer (each line appears as it is sung) ----------
const LINES = [
  { at: 1.1, deva: "असतो मा सद्गमय ।", iast: "asato mā sad gamaya", en: "Lead me from the unreal to the real" },
  { at: 7.35, deva: "तमसो मा ज्योतिर्गमय ।", iast: "tamaso mā jyotir gamaya", en: "Lead me from darkness to light", lit: true },
  { at: 13.85, deva: "मृत्योर्मा अमृतं गमय ॥", iast: "mṛtyor mā amṛtaṃ gamaya", en: "Lead me from death to immortality" },
];

const Prayer: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = fade(frame, 0, 20.4, 0.01, 1.0);
  const glow = interpolate(frame, [0, s(19)], [0.25, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ opacity: scene, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 2200, height: 2200, left: -560, top: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,102,.30) 0%, rgba(255,170,60,.10) 26%, transparent 55%)", transform: `scale(${glow})`, opacity: glow }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 86, textAlign: "center", marginTop: -40 }}>
        {LINES.map((l, i) => {
          const o = interpolate(frame, [s(l.at - 0.2), s(l.at + 0.7)], [0, 1], clamp);
          const y = interpolate(frame, [s(l.at - 0.2), s(l.at + 0.9)], [24, 0], { ...clamp, easing: Easing.out(Easing.quad) });
          const next = LINES[i + 1];
          const dim = next && !l.lit ? interpolate(frame, [s(next.at), s(next.at + 1)], [1, 0.55], clamp) : 1;
          const shine = l.lit ? interpolate(frame, [s(l.at), s(l.at + 2.5)], [0, 1], clamp) : 0;
          return (
            <div key={l.iast} style={{ opacity: o * dim, transform: `translateY(${y}px)` }}>
              <div style={{ fontFamily: deva, fontSize: 92, lineHeight: 1.45, color: l.lit ? C.gold : C.cream, textShadow: l.lit ? `0 0 ${50 * shine}px rgba(255,190,90,${0.75 * shine})` : "none" }}>{l.deva}</div>
              <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 40, color: C.cream, opacity: 0.85 }}>{l.iast}</div>
              <div style={{ fontFamily: text, fontSize: 36, letterSpacing: 1, color: C.muted, marginTop: 6 }}>{l.en}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 2. In remembrance ----------
const Remembrance: React.FC = () => {
  const frame = useCurrentFrame();
  const o = fade(frame, 19.8, 25.9, 1.4, 0.8);
  const zoom = interpolate(frame, [s(19.8), s(25.9)], [1, 1.07], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 56 }}>
      <div style={{ position: "absolute", width: 1600, height: 1600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,102,.26) 0%, transparent 55%)", top: 60 }} />
      <div style={{ width: 640, height: 640, borderRadius: "50%", overflow: "hidden", border: `6px solid rgba(255,211,138,.75)`, boxShadow: "0 0 120px rgba(255,190,90,.35)", marginTop: -60 }}>
        <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)", transform: `scale(${zoom})` }} />
      </div>
      <div style={{ textAlign: "center", color: C.cream, position: "relative" }}>
        <div style={{ fontFamily: text, fontSize: 44, letterSpacing: 4 }}>In remembrance of</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: 104, color: C.gold, letterSpacing: 2, margin: "8px 0 12px" }}>N. B. N. Sir</div>
        <div style={{ fontFamily: text, fontSize: 40, color: C.muted, letterSpacing: 2 }}>Sainik School Kazhakootam</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3–6. School backdrop, title, sessions, date, close ----------
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [s(25.3), s(26.6)], [0, 1], clamp);
  // Slow pan across the main building (image is 4100 × 1954, scaled to 1920 tall ≈ 4029 wide)
  const x = interpolate(frame, [s(25.3), s(45)], [-1650, -1300], clamp);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Img src={staticFile("school.jpg")} style={{ position: "absolute", height: 1920, width: 4029, left: x, top: 0, maxWidth: "none" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,24,48,.94) 0%, rgba(11,24,48,.78) 40%, rgba(11,24,48,.80) 70%, rgba(5,7,13,.96) 100%)" }} />
    </AbsoluteFill>
  );
};

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [s(25.6), s(26.8), s(42.0), s(42.6)], [0, 1, 1, 0], clamp);
  // After the reveal the title rises and shrinks into a header for the following scenes
  const k = interpolate(frame, [s(30.6), s(31.6)], [0, 1], { ...clamp, easing: ease });
  const sweep = interpolate(frame, [s(25.8), s(28.2)], [-60, 160], clamp);
  const tag = interpolate(frame, [s(27.0), s(28.0)], [0, 1], clamp) * (1 - k);
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", transform: `translateY(${-580 * k}px) scale(${1 - 0.48 * k})` }}>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: 210, lineHeight: 0.95, letterSpacing: 0, backgroundImage: `linear-gradient(100deg, ${C.cream} ${sweep - 30}%, #fff6dc ${sweep - 8}%, ${C.gold} ${sweep}%, #fff6dc ${sweep + 8}%, ${C.cream} ${sweep + 30}%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(255,200,110,.35))" }}>
          Guiding<br />Lights
        </div>
        <div style={{ opacity: tag, fontFamily: text, fontWeight: 400, fontSize: 50, color: C.gold, marginTop: 36, padding: "0 60px" }}>
          Celebrating Educators<br />Who Shape Generations
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SESSIONS = [
  ["Special Address", "Inspiring the Next Generation to Serve"],
  ["Fireside Chat", "The Teachers and Experiences That Shape Us"],
  ["Panel Discussion", "When Answers Are Everywhere, What Should Schools Teach?"],
  ["Keynote", "Leading Schools That Shape Generations"],
  ["Felicitation", "Honouring educators who shape generations"],
];

const Sessions: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = fade(frame, 31.4, 38.4, 0.01, 0.6);
  return (
    <AbsoluteFill style={{ opacity: scene, justifyContent: "center", padding: "260px 90px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {SESSIONS.map(([type, title], i) => {
          const at = 31.6 + i * 1.15;
          const o = interpolate(frame, [s(at), s(at + 0.5)], [0, 1], clamp);
          const x = interpolate(frame, [s(at), s(at + 0.6)], [40, 0], { ...clamp, easing: Easing.out(Easing.quad) });
          return (
            <div key={type} style={{ opacity: o, transform: `translateX(${x}px)`, borderLeft: `6px solid ${C.goldDeep}`, paddingLeft: 30 }}>
              <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: C.gold }}>{type}</div>
              <div style={{ fontFamily: text, fontWeight: 400, fontSize: 48, lineHeight: 1.18, color: C.cream, marginTop: 6 }}>{title}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const When: React.FC = () => {
  const frame = useCurrentFrame();
  const o = fade(frame, 38.4, 42.6, 0.7, 0.5);
  const y = interpolate(frame, [s(38.4), s(39.3)], [30, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream, paddingTop: 200, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: C.muted }}>SATURDAY</div>
      <div style={{ fontFamily: display, fontWeight: 400, fontSize: 118, lineHeight: 1.05, color: C.gold, margin: "10px 0 18px" }}>21 November<br />2026</div>
      <div style={{ fontFamily: text, fontWeight: 400, fontSize: 50 }}>10:00 AM – 3:00 PM</div>
      <div style={{ width: 160, height: 3, background: C.goldDeep, margin: "44px 0" }} />
      <div style={{ fontFamily: display, fontWeight: 400, fontSize: 56 }}>Cariappa Auditorium</div>
      <div style={{ fontFamily: text, fontSize: 42, color: C.muted, marginTop: 10, lineHeight: 1.35 }}>Pangode Military Station<br />Thiruvananthapuram</div>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 32, letterSpacing: 8, color: C.gold, marginTop: 40 }}>BY INVITATION</div>
    </AbsoluteFill>
  );
};

const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [s(42.5), s(43.3)], [0, 1], clamp);
  const pop = interpolate(frame, [s(42.5), s(43.4)], [0.85, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream, gap: 40 }}>
      <Img src={staticFile("oba-logo.png")} style={{ width: 320, height: 320, transform: `scale(${pop})` }} />
      <div>
        <div style={{ fontFamily: text, fontSize: 40, color: C.muted }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: 60, marginTop: 10, lineHeight: 1.15 }}>Sainik School<br />Kazhakootam</div>
      </div>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 46, color: C.gold, letterSpacing: 2, marginTop: 20 }}>nbn.sskzmoba.org</div>
    </AbsoluteFill>
  );
};

export const GuidingLights: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Audio src={staticFile("soundtrack.wav")} />
    <Prayer />
    <Remembrance />
    <Backdrop />
    <Title />
    <Sessions />
    <When />
    <Close />
  </AbsoluteFill>
);

// ---------- Link-preview image (1200 × 630) for WhatsApp / social sharing ----------
export const OgImage: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy, flexDirection: "row", alignItems: "center" }}>
    <Img src={staticFile("school.jpg")} style={{ position: "absolute", height: 630, width: 1322, left: -60, top: 0, maxWidth: "none", opacity: 0.35 }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,24,48,.65), rgba(11,24,48,.92) 55%)" }} />
    <div style={{ position: "relative", marginLeft: 70, width: 360, height: 360, borderRadius: "50%", overflow: "hidden", border: "5px solid rgba(255,211,138,.8)", boxShadow: "0 0 70px rgba(255,190,90,.35)", flexShrink: 0 }}>
      <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
    </div>
    <div style={{ position: "relative", marginLeft: 60, color: C.cream }}>
      <div style={{ fontFamily: text, fontSize: 26, letterSpacing: 2, color: C.muted }}>In remembrance of N. B. N. Sir</div>
      <div style={{ fontFamily: display, fontWeight: 400, fontSize: 104, lineHeight: 0.95, margin: "14px 0", color: C.cream }}>Guiding<br />Lights</div>
      <div style={{ fontFamily: text, fontWeight: 400, fontSize: 30, color: C.gold }}>Celebrating Educators Who Shape Generations</div>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, marginTop: 22 }}>Sat 21 Nov 2026 · Pangode, Thiruvananthapuram</div>
    </div>
  </AbsoluteFill>
);
