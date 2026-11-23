import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { display, text, C } from "./GuidingLights";

// Portrait "speaker bites" from Guiding Lights (1080 × 1920, 30 fps): opening card with music, the speaker cropped
// from the live stream with word-timed captions (key phrases in gold), and the Guiding Lights closing card with the
// logo halo (as in the Adventures ride film). Each bite's footage and captions are made by the scratchpad script
// reel/prep_bite.py: public/breeze/<id>.mp4 (not in the repo) and src/bites/<id>.json.
export const SB_FPS = 30;
export const SB_INTRO = 3.8;
export const SB_OUTRO = 6.0;
const f = (s: number) => Math.round(s * SB_FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);

type Word = { t: string; s: number; e: number; g: boolean };
export type BiteData = { total: number; clips: { start: number; dur: number; x?: number; z?: number }[]; pages: { words: Word[] }[] };
export type BiteProps = {
  data: BiteData;
  video: string;            // file in public/, e.g. "breeze/vasuki.mp4"
  heading: string;          // top band during the talk
  title: string;            // opening card, "\n" for a line break
  name: string;
  role: string;
  cutaway?: { src: string; until: number }; // a still shown full-panel at the start (e.g. NBN Sir's portrait)
  cropX?: number;           // speaker's centre as a fraction of the frame width
  people?: { clip: number; name: string; role: string }[]; // name captions for bites with more than one speaker
};
export const biteFrames = (d: BiteData) => Math.round((SB_INTRO + d.total + SB_OUTRO) * SB_FPS);

const rise = (frame: number, a: number, dur = 0.8): React.CSSProperties => {
  const p = interpolate(frame, [f(a), f(a + dur)], [0, 1], { ...clamp, easing: easeOut });
  return { opacity: p, transform: `translateY(${(1 - p) * 16}px)` };
};

const PANEL_TOP = 200;
const PANEL_H = 1400;

// Speaker, cropped to portrait. Alternate clips are framed tighter so each cut reads as a change of shot;
// every clip pushes in slowly. A clip may set its own centre (x) and zoom (z).
const Speaker: React.FC<{ t: number; p: BiteProps }> = ({ t, p }) => {
  let ci = 0;
  p.data.clips.forEach((c, i) => { if (t >= c.start) ci = i; });
  const c = p.data.clips[ci];
  const k = Math.min(1, Math.max(0, (t - c.start) / c.dur));
  const z = (c.z ?? (ci % 2 ? 1.2 : 1.0)) * (1 + 0.035 * k);
  const W = (PANEL_H / 1080) * 1920 * z;
  const H = PANEL_H * z;
  const x = c.x ?? p.cropX ?? 0.485;
  const left = Math.min(0, Math.max(1080 - W, 540 - x * W));
  return <OffthreadVideo src={staticFile(p.video)} style={{ position: "absolute", width: W, height: H, left, top: -(H - PANEL_H) * 0.2, maxWidth: "none" }} />;
};

const Captions: React.FC<{ t: number; d: BiteData }> = ({ t, d }) => {
  const page = [...d.pages].reverse().find((pg) => t >= pg.words[0].s - 0.15);
  if (!page) return null;
  const last = page.words[page.words.length - 1];
  const op = interpolate(t, [page.words[0].s - 0.15, page.words[0].s], [0, 1], clamp) * interpolate(t, [last.e + 1.0, last.e + 1.3], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: PANEL_TOP + PANEL_H - 300, height: 260, display: "flex", alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{ fontFamily: text, fontSize: 58, lineHeight: 1.28, textAlign: "center", color: C.cream, textShadow: "0 2px 18px rgba(0,0,0,.85)" }}>
        {page.words.map((w, i) => {
          const said = t >= w.s;
          const now = said && t < w.e + 0.05;
          return (
            <span key={i} style={{ color: said && w.g ? C.gold : C.cream, opacity: said ? 1 : 0.42, fontWeight: w.g ? 700 : 400,
              textShadow: now ? "0 0 22px rgba(255,211,138,.55), 0 2px 18px rgba(0,0,0,.85)" : undefined }}>
              {w.t}{i < page.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Talk: React.FC<{ p: BiteProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const t = frame / SB_FPS;
  const cut = p.cutaway ? interpolate(t, [0, p.cutaway.until, p.cutaway.until + 0.7], [1, 1, 0], clamp) : 0;
  const n0 = p.cutaway ? p.cutaway.until + 0.9 : 0.6;
  const tags = p.people ? p.people.map((q) => ({ ...q, at: p.data.clips[q.clip].start + (q.clip === 0 ? n0 : 0.4) })) : [{ name: p.name, role: p.role, at: n0 }];
  const tag = [...tags].reverse().find((q) => t >= q.at) ?? tags[0];
  const name = interpolate(t, [tag.at, tag.at + 0.7, tag.at + 6, tag.at + 6.7], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <div style={{ position: "absolute", left: 0, top: PANEL_TOP, width: 1080, height: PANEL_H, overflow: "hidden" }}>
        <Speaker t={t} p={p} />
        {cut > 0 && p.cutaway && (
          <AbsoluteFill style={{ opacity: cut, background: C.night }}>
            <Img src={staticFile(p.cutaway.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * (t / (p.cutaway.until + 0.7))})` }} />
          </AbsoluteFill>
        )}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,24,48,0) 62%, rgba(11,24,48,.82) 84%, rgba(11,24,48,.96) 100%)" }} />
        {name > 0 && (
          <div style={{ position: "absolute", left: 40, top: 40, right: 40, opacity: name }}>
            <div style={{ display: "inline-block", background: "rgba(11,24,48,.84)", padding: "18px 26px" }}>
              <div style={{ fontFamily: text, fontSize: 40, color: C.cream }}>{tag.name}</div>
              <div style={{ fontFamily: text, fontSize: 28, color: C.gold, marginTop: 6 }}>{tag.role}</div>
            </div>
          </div>
        )}
      </div>
      <Captions t={t} d={p.data} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PANEL_TOP, background: C.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 30px" }}>
        <div style={{ fontFamily: display, fontSize: p.heading.length > 32 ? 52 : 60, color: C.cream, lineHeight: 1, textAlign: "center" }}>{p.heading}</div>
        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 30, color: C.gold, marginTop: 14 }}>Guiding Lights · SSKZM OBA</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PANEL_TOP + PANEL_H, bottom: 0, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: 120, height: 120 }} />
        <div style={{ fontFamily: text, fontSize: 30, lineHeight: 1.35, color: C.muted }}>
          An initiative by alumni of<br /><span style={{ color: C.cream, fontSize: 38 }}>Sainik School Kazhakootam</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Intro: React.FC<{ p: BiteProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [f(SB_INTRO - 0.4), f(SB_INTRO)], [1, 0], clamp);
  const lines = p.title.split("\n");
  return (
    <AbsoluteFill style={{ background: C.night, opacity: out }}>
      <Img src={staticFile("school.jpg")} style={{ position: "absolute", height: 1920, left: interpolate(frame, [0, f(SB_INTRO)], [-1400, -1250]), maxWidth: "none", opacity: 0.22 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(11,24,48,.55), rgba(5,7,13,.95) 75%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream, padding: 60 }}>
        <div style={{ ...rise(frame, 0.2), fontFamily: text, fontSize: 36, color: C.gold }}>Guiding Lights</div>
        <div style={{ ...rise(frame, 0.5), fontFamily: display, fontSize: 104, lineHeight: 1.06, margin: "40px 0 56px" }}>
          {lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div style={{ ...rise(frame, 1.0), fontFamily: text, fontSize: 46 }}>{p.name}</div>
        <div style={{ ...rise(frame, 1.3), fontFamily: text, fontStyle: "italic", fontSize: 34, color: C.muted, marginTop: 16, lineHeight: 1.35 }}>{p.role}</div>
      </AbsoluteFill>
      <div style={{ ...rise(frame, 1.9), position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: text, fontSize: 28, color: C.muted, lineHeight: 1.5 }}>
        Cariappa Auditorium, Pangode<br />21 November 2026
      </div>
    </AbsoluteFill>
  );
};

export const BrandEnd: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [0, f(0.6)], [0, 1], clamp);
  const end = interpolate(frame, [f(dur - 0.6), f(dur)], [1, 0], clamp);
  const logo = interpolate(frame, [f(0.2), f(0.9)], [0, 1], { ...clamp, easing: easeOut });
  const scale = interpolate(frame, [0, f(dur)], [0.94, 1.02]);
  const glow = interpolate(frame, [f(0.3), f(2)], [0, 1], clamp) * (0.75 + 0.25 * Math.sin(frame / 18));
  const halo = interpolate(frame, [f(1.0), f(1.5), f(2.8)], [0, 1, 0], clamp);
  const haloSize = interpolate(frame, [f(1.0), f(2.8)], [0.8, 1.7], clamp);
  return (
    <AbsoluteFill style={{ background: C.night, opacity: inn * end, alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream }}>
      <div style={{ position: "relative", width: 300, height: 300, marginBottom: 70 }}>
        <div style={{ position: "absolute", inset: -170, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,211,138,.45), rgba(201,154,60,.2) 40%, rgba(201,154,60,0) 66%)", opacity: glow }} />
        <div style={{ position: "absolute", inset: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,225,160,1) 0%, rgba(255,190,90,.55) 38%, rgba(255,170,70,0) 70%)", opacity: halo, transform: `scale(${haloSize})` }} />
        <Img src={staticFile("oba-logo.png")} style={{ position: "relative", width: 300, height: 300, opacity: logo, transform: `scale(${scale})` }} />
      </div>
      <div style={{ ...rise(frame, 0.8), fontFamily: display, fontSize: 132, lineHeight: 1 }}>Guiding Lights</div>
      <div style={{ ...rise(frame, 1.1), fontFamily: text, fontStyle: "italic", fontSize: 38, color: C.gold, marginTop: 26 }}>Celebrating educators who shape generations</div>
      <div style={{ ...rise(frame, 1.5), fontFamily: text, fontSize: 48, marginTop: 90, letterSpacing: 2 }}>SSKZM OBA</div>
      <div style={{ ...rise(frame, 1.7), fontFamily: text, fontSize: 34, color: C.muted, marginTop: 18, lineHeight: 1.4 }}>An initiative by alumni of<br />Sainik School Kazhakootam</div>
      <div style={{ ...rise(frame, 2.1), fontFamily: text, fontStyle: "italic", fontSize: 32, color: C.gold, marginTop: 44 }}>Supported by the 1991 Batch</div>
    </AbsoluteFill>
  );
};

// Music: "Kaleidoscope of Life" by AlexGrohl (Pixabay Content Licence). Its lift (43 s) lands just after the opening
// card begins; it fades out under the first words, and returns over the closing card.
const Music: React.FC<{ total: number }> = ({ total }) => {
  const talkEnd = SB_INTRO + total;
  return (
    <>
      <Sequence durationInFrames={f(SB_INTRO + 1.4)}>
        <Audio src={staticFile("breeze/music.mp3")} startFrom={f(41.6)}
          volume={(fr) => interpolate(fr, [0, f(0.4), f(SB_INTRO - 0.3), f(SB_INTRO + 1.4)], [0, 0.85, 0.85, 0], clamp)} />
      </Sequence>
      <Sequence from={f(talkEnd - 0.5)}>
        <Audio src={staticFile("breeze/music.mp3")} startFrom={f(46.0)}
          volume={(fr) => interpolate(fr, [0, f(0.9), f(SB_OUTRO - 0.4), f(SB_OUTRO + 0.5)], [0, 0.9, 0.9, 0], clamp)} />
      </Sequence>
    </>
  );
};

export const SpeakerBite: React.FC<BiteProps> = (p) => (
  <AbsoluteFill style={{ background: C.night }}>
    <Sequence durationInFrames={f(SB_INTRO)}><Intro p={p} /></Sequence>
    <Sequence from={f(SB_INTRO)} durationInFrames={f(p.data.total)}><Talk p={p} /></Sequence>
    <Sequence from={f(SB_INTRO + p.data.total)}><BrandEnd dur={SB_OUTRO} /></Sequence>
    <Music total={p.data.total} />
  </AbsoluteFill>
);
