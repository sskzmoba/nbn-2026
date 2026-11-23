import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { display, text, C } from "./GuidingLights";
import { BrandEnd } from "./SpeakerBite";
import data from "./breezeFull.json";

// Breeze's full talk on NBN Sir, landscape for YouTube (1920 × 1080, 30 fps). Footage public/breeze/full.mp4 and
// captions src/breezeFull.json come from the scratchpad script reel/prep_full.py. The opening card is 4.0 s so the
// SRT made by that script (offset 4.0) lines up.
const FPS = 30;
export const BT_INTRO = 4.0;
export const BT_OUTRO = 6.0;
const f = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);
type Word = { t: string; s: number; e: number; g: boolean };
const D = data as { total: number; clips: { start: number; dur: number }[]; pages: { words: Word[] }[] };
export const breezeTalkFrames = Math.round((BT_INTRO + D.total + BT_OUTRO) * FPS);

const rise = (frame: number, a: number, dur = 0.8): React.CSSProperties => {
  const p = interpolate(frame, [f(a), f(a + dur)], [0, 1], { ...clamp, easing: easeOut });
  return { opacity: p, transform: `translateY(${(1 - p) * 14}px)` };
};

const Footage: React.FC<{ t: number }> = ({ t }) => {
  let ci = 0;
  D.clips.forEach((c, i) => { if (t >= c.start) ci = i; });
  const c = D.clips[ci];
  const k = Math.min(1, Math.max(0, (t - c.start) / c.dur));
  const z = (ci % 2 ? 1.1 : 1.0) * (1 + 0.03 * k);
  return <OffthreadVideo src={staticFile("breeze/full.mp4")} style={{ position: "absolute", width: 1920 * z, height: 1080 * z, left: -(1920 * (z - 1)) / 2, top: -(1080 * (z - 1)) * 0.3, maxWidth: "none" }} />;
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const page = [...D.pages].reverse().find((pg) => t >= pg.words[0].s - 0.15);
  if (!page) return null;
  const last = page.words[page.words.length - 1];
  const op = interpolate(t, [page.words[0].s - 0.15, page.words[0].s], [0, 1], clamp) * interpolate(t, [last.e + 1.0, last.e + 1.3], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 60, display: "flex", justifyContent: "center", opacity: op }}>
      <div style={{ fontFamily: text, fontSize: 52, lineHeight: 1.3, textAlign: "center", color: C.cream, textShadow: "0 2px 16px rgba(0,0,0,.9)" }}>
        {page.words.map((w, i) => {
          const said = t >= w.s;
          return (
            <span key={i} style={{ color: said && w.g ? C.gold : C.cream, opacity: said ? 1 : 0.45, fontWeight: w.g ? 700 : 400 }}>
              {w.t}{i < page.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Talk: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const name = interpolate(t, [1.0, 1.7, 9, 9.7], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Footage t={t} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,24,48,0) 66%, rgba(11,24,48,.7) 88%, rgba(11,24,48,.9) 100%)" }} />
      <div style={{ position: "absolute", right: 44, top: 36, display: "flex", alignItems: "center", gap: 16, background: "rgba(11,24,48,.72)", padding: "12px 20px 12px 14px" }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: 64, height: 64 }} />
        <div style={{ fontFamily: text, lineHeight: 1.25 }}>
          <div style={{ fontSize: 30, color: C.cream }}>Guiding Lights</div>
          <div style={{ fontSize: 20, color: C.gold, fontStyle: "italic" }}>SSKZM OBA</div>
        </div>
      </div>
      {name > 0 && (
        <div style={{ position: "absolute", left: 70, bottom: 250, opacity: name, background: "rgba(11,24,48,.86)", padding: "18px 28px", borderLeft: `4px solid ${C.gold}` }}>
          <div style={{ fontFamily: text, fontSize: 40, color: C.cream }}>Capt(IN) KM Breeze Antony</div>
          <div style={{ fontFamily: text, fontSize: 26, color: C.gold, marginTop: 6 }}>President, SSKZM OBA, and a student of NBN Sir</div>
        </div>
      )}
      <Captions t={t} />
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [f(BT_INTRO - 0.4), f(BT_INTRO)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.night, opacity: out }}>
      <Img src={staticFile("school.jpg")} style={{ position: "absolute", width: 2200, left: interpolate(frame, [0, f(BT_INTRO)], [-200, -80]), top: -60, maxWidth: "none", opacity: 0.22 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(11,24,48,.5), rgba(5,7,13,.95) 75%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream }}>
        <div style={{ ...rise(frame, 0.2), fontFamily: text, fontSize: 34, color: C.gold }}>Guiding Lights</div>
        <div style={{ ...rise(frame, 0.5), fontFamily: display, fontSize: 104, lineHeight: 1.05, margin: "30px 0 44px" }}>The OBA President on NBN Sir</div>
        <div style={{ ...rise(frame, 1.0), fontFamily: text, fontSize: 44 }}>Capt(IN) KM Breeze Antony</div>
        <div style={{ ...rise(frame, 1.3), fontFamily: text, fontStyle: "italic", fontSize: 32, color: C.muted, marginTop: 14 }}>President, SSKZM OBA, and a student of NBN Sir</div>
        <div style={{ ...rise(frame, 1.9), fontFamily: text, fontSize: 26, color: C.muted, marginTop: 70 }}>Cariappa Auditorium, Pangode · 21 November 2026</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Music: React.FC = () => {
  const talkEnd = BT_INTRO + D.total;
  return (
    <>
      <Sequence durationInFrames={f(BT_INTRO + 1.4)}>
        <Audio src={staticFile("breeze/music.mp3")} startFrom={f(41.4)}
          volume={(fr) => interpolate(fr, [0, f(0.4), f(BT_INTRO - 0.3), f(BT_INTRO + 1.4)], [0, 0.85, 0.85, 0], clamp)} />
      </Sequence>
      <Sequence from={f(talkEnd - 0.5)}>
        <Audio src={staticFile("breeze/music.mp3")} startFrom={f(46.0)}
          volume={(fr) => interpolate(fr, [0, f(0.9), f(BT_OUTRO - 0.4), f(BT_OUTRO + 0.5)], [0, 0.9, 0.9, 0], clamp)} />
      </Sequence>
    </>
  );
};

export const BreezeTalk: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Sequence durationInFrames={f(BT_INTRO)}><Intro /></Sequence>
    <Sequence from={f(BT_INTRO)} durationInFrames={f(D.total)}><Talk /></Sequence>
    <Sequence from={f(BT_INTRO + D.total)}>
      <AbsoluteFill style={{ transform: "scale(0.82)" }}><BrandEnd dur={BT_OUTRO} /></AbsoluteFill>
    </Sequence>
    <Music />
  </AbsoluteFill>
);
