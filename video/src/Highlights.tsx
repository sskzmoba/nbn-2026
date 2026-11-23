import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { display, text, C } from "./GuidingLights";

// Opening and closing cards for the event highlights film (16:9, 1920 × 1080, 50 fps, same as the camera master).
// The middle of the film is the editor's cut; tools/highlights (scratchpad scripts) join it with these cards.
export const HL_FPS = 50;
export const INTRO_SEC = 6.4;
export const OUTRO_SEC = 7.6;
const f = (sec: number) => Math.round(sec * HL_FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);

// Fade + small rise, starting at `a` seconds
const rise = (frame: number, a: number, dur = 0.9): React.CSSProperties => {
  const p = interpolate(frame, [f(a), f(a + dur)], [0, 1], { ...clamp, easing: easeOut });
  return { opacity: p, transform: `translateY(${(1 - p) * 18}px)` };
};

// Left-to-right "writing" reveal (as in the films and cards)
const write = (frame: number, a: number, dur: number): React.CSSProperties => {
  const p = interpolate(frame, [f(a), f(a + dur)], [0, 125], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const m = `linear-gradient(90deg, #000 ${p - 25}%, transparent ${p}%)`;
  return { WebkitMaskImage: m, maskImage: m };
};

// School building, slow pan, under the navy veil used on the website hero
const School: React.FC<{ from: number; to: number; dur: number; veil: string; top?: number }> = ({ from, to, dur, veil, top = -80 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, f(dur)], [from, to], clamp);
  return (
    <AbsoluteFill>
      {/* 4100 × 1954 scaled to 1240 tall ≈ 2602 wide */}
      <Img src={staticFile("school.jpg")} style={{ position: "absolute", height: 1240, width: 2602, left: x, top, maxWidth: "none", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 30%)" }} />
      <AbsoluteFill style={{ background: veil }} />
    </AbsoluteFill>
  );
};

const Rule: React.FC<{ frame: number; a: number; w?: number }> = ({ frame, a, w = 220 }) => {
  const p = interpolate(frame, [f(a), f(a + 0.8)], [0, 1], { ...clamp, easing: easeOut });
  return <div style={{ width: w * p, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto" }} />;
};

export const HighlightsIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [0, f(0.7)], [0, 1], clamp);
  const sweep = interpolate(frame, [f(1.1), f(3.3)], [-60, 160], clamp);
  const title = interpolate(frame, [f(0.9), f(1.9)], [0, 1], { ...clamp, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ opacity: inn }}>
        <School from={-520} to={-300} dur={INTRO_SEC} top={110}
          veil="radial-gradient(ellipse at 50% 48%, rgba(11,24,48,.70) 0%, rgba(11,24,48,.86) 55%, rgba(5,7,13,.97) 100%)" />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream }}>
        <div style={{ ...rise(frame, 0.4), fontFamily: text, fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: C.muted }}>
          In remembrance of NBN Sir
        </div>
        <div style={{ opacity: title, transform: `scale(${0.96 + 0.04 * title})`, fontFamily: display, fontWeight: 400, fontSize: 190, lineHeight: 1, margin: "26px 0 30px",
          backgroundImage: `linear-gradient(100deg, ${C.cream} ${sweep - 30}%, #fff6dc ${sweep - 8}%, ${C.gold} ${sweep}%, #fff6dc ${sweep + 8}%, ${C.cream} ${sweep + 30}%)`,
          WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(255,200,110,.30))" }}>
          Guiding Lights
        </div>
        <Rule frame={frame} a={1.9} w={260} />
        <div style={{ ...write(frame, 2.2, 1.3), fontFamily: text, fontSize: 50, color: C.gold, marginTop: 30 }}>
          Celebrating Educators Who Shape Generations
        </div>
        <div style={{ ...rise(frame, 3.4), fontFamily: text, fontSize: 34, letterSpacing: 2, marginTop: 34 }}>
          Saturday, 21 November 2026 · Cariappa Auditorium, Pangode
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const HighlightsOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [0, f(0.6)], [0, 1], clamp);
  const out = interpolate(frame, [f(OUTRO_SEC - 0.9), f(OUTRO_SEC)], [1, 0], clamp);
  const pop = interpolate(frame, [f(2.4), f(3.3)], [0.88, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const logo = interpolate(frame, [f(2.4), f(3.1)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <AbsoluteFill style={{ opacity: inn * out }}>
        <School from={-300} to={-480} dur={OUTRO_SEC}
          veil="linear-gradient(180deg, rgba(11,24,48,.88) 0%, rgba(11,24,48,.90) 50%, rgba(5,7,13,.97) 100%)" />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream }}>
          <div style={{ ...rise(frame, 0.3), fontFamily: display, fontWeight: 400, fontSize: 120, color: C.gold, lineHeight: 1 }}>With gratitude</div>
          <div style={{ ...rise(frame, 1.0), fontFamily: text, fontSize: 38, lineHeight: 1.45, marginTop: 28 }}>
            to our guests, the principals and teachers we honoured,<br />and everyone who made the day possible
          </div>
          <div style={{ marginTop: 48 }}><Rule frame={frame} a={1.9} w={300} /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 44, marginTop: 48, opacity: logo }}>
            <Img src={staticFile("oba-logo.png")} style={{ width: 170, height: 170, transform: `scale(${pop})` }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: text, fontSize: 30, letterSpacing: 1, color: C.muted }}>An initiative by alumni of</div>
              <div style={{ fontFamily: display, fontWeight: 400, fontSize: 64, marginTop: 6, whiteSpace: "nowrap" }}>Sainik School Kazhakootam</div>
              <div style={{ ...rise(frame, 3.4, 0.7), fontFamily: text, fontWeight: 700, fontSize: 38, color: C.gold, letterSpacing: 2, marginTop: 14 }}>nbn.sskzmoba.org</div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
