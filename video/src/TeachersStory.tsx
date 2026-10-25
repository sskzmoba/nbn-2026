import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, display, text, s, clamp, ease, fade, wipe, Backdrop, Title, Sessions, When, Close } from "./GuidingLights";

// "Teacher's story" version of the 45 s film (no chant): a short story of N. B. N. Sir over solo
// piano, then the same title, sessions, date and closing scenes as GuidingLights (from 25.3 s).
// Soundtrack: public/story-soundtrack.wav, made by audio/make-story-soundtrack.js. The piano is
// quiet under "1962." and the young master, and lifts at 7.9 s as "For 27 years…" appears.

// A warm light that grows through the story, as if a lamp were being lit
const Glow: React.FC = () => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [0, s(24)], [0.15, 1], { ...clamp, easing: ease });
  const o = fade(frame, 0, 26.2, 0.01, 1.0);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", width: 2200, height: 2200, left: -560, top: -140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,102,.30) 0%, rgba(255,170,60,.10) 26%, transparent 55%)", transform: `scale(${g})`, opacity: g }} />
    </AbsoluteFill>
  );
};

// One line of the story: fades and rises in at `a`, fades out at `b`
const Line: React.FC<{ a: number; b: number; size?: number; color?: string; children: React.ReactNode }> = ({ a, b, size = 80, color = C.cream, children }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, a, b, 0.9, 0.6);
  const y = interpolate(frame, [s(a), s(a + 1.1)], [28, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", padding: "0 100px", marginTop: -60 }}>
      <div style={{ transform: `translateY(${y}px)`, fontFamily: display, fontWeight: 400, fontSize: size, lineHeight: 1.22, color, textAlign: "center" }}>{children}</div>
    </AbsoluteFill>
  );
};

// A story line revealed at reading pace from `a`, one word (or one line) every `step` seconds;
// fades out at `b`
const Words: React.FC<{ a: number; b: number; lines: string[]; step?: number; byLine?: boolean }> = ({ a, b, lines, step = 0.24, byLine = false }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [s(b - 0.6), s(b)], [1, 0], clamp);
  let n = 0;
  const unit = (key: React.Key, content: string) => {
    const at = a + step * n++;
    const o = interpolate(frame, [s(at), s(at + 0.5)], [0, 1], clamp);
    const y = interpolate(frame, [s(at), s(at + 0.6)], [14, 0], { ...clamp, easing: Easing.out(Easing.quad) });
    return <span key={key} style={{ display: "inline-block", opacity: o, transform: `translateY(${y}px)` }}>{content}</span>;
  };
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: "center", justifyContent: "center", padding: "0 100px", marginTop: -60 }}>
      <div style={{ fontFamily: display, fontWeight: 400, fontSize: 80, lineHeight: 1.22, color: C.cream, textAlign: "center" }}>
        {lines.map((line, li) => (
          <div key={li}>
            {byLine ? unit(li, line) : line.split(" ").map((w, wi) => <React.Fragment key={wi}>{wi > 0 && " "}{unit(wi, w)}</React.Fragment>)}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const QUALITIES =["Curiosity.", "Confidence.", "Humility.", "Compassion."];

const Qualities: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = fade(frame, 12.3, 18.2, 0.01, 0.7);
  return (
    <AbsoluteFill style={{ opacity: scene, alignItems: "center", justifyContent: "center", marginTop: -60 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 34, textAlign: "center" }}>
        {QUALITIES.map((q, i) => {
          const at = 12.4 + i * 1.05;
          const o = interpolate(frame, [s(at), s(at + 0.7)], [0, 1], clamp);
          const y = interpolate(frame, [s(at), s(at + 0.8)], [24, 0], { ...clamp, easing: Easing.out(Easing.quad) });
          return <div key={q} style={{ opacity: o, transform: `translateY(${y}px)`, fontFamily: display, fontWeight: 400, fontSize: 96, color: C.gold }}>{q}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const Portrait: React.FC = () => {
  const frame = useCurrentFrame();
  const o = fade(frame, 18.0, 22.6, 1.2, 0.7);
  const zoom = interpolate(frame, [s(18), s(22.6)], [1, 1.06], clamp);
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 56 }}>
      <div style={{ width: 640, height: 640, borderRadius: "50%", overflow: "hidden", border: "6px solid rgba(255,211,138,.75)", boxShadow: "0 0 120px rgba(255,190,90,.35)", marginTop: -60 }}>
        <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)", transform: `scale(${zoom})` }} />
      </div>
      <div style={{ textAlign: "center", color: C.cream }}>
        <div style={{ ...wipe(frame, 18.7, 1.2), fontFamily: display, fontWeight: 400, fontSize: 104, color: C.gold, letterSpacing: 2 }}>N. B. N. Sir</div>
        <div style={{ ...wipe(frame, 19.7, 1.0), fontFamily: text, fontSize: 44, color: C.muted, letterSpacing: 4, marginTop: 8 }}>1929 – 2016</div>
      </div>
    </AbsoluteFill>
  );
};

export const TeachersStory: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Audio src={staticFile("story-soundtrack.wav")} />
    <Glow />
    <Line a={0.4} b={2.9} size={230} color={C.gold}>1962.</Line>
    <Words a={3.0} b={7.6} lines={["A young science master", "walks into a classroom,", "right here at Pangode."]} />
    <Words a={7.8} b={12.2} lines={["For 27 years,", "and long after,", "he taught us", "far more than science."]} />
    <Qualities />
    <Portrait />
    <Words a={22.6} b={25.6} step={0.55} byLine lines={["Every one of us", "has had a teacher", "like him."]} />
    <Backdrop />
    <Title />
    <Sessions />
    <When />
    <Close />
  </AbsoluteFill>
);
