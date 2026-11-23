import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { display, text, C, clamp } from "./GuidingLights";
import { TableScene, Card } from "./FelicitationTable";
import reel from "./insta-reel.json";
import guestReels from "./insta-guests.json";

// Instagram highlight reel (1080x1920, about 80 s, 24 Nov 2026): one line from each speaker, cut from the
// "Voices from Guiding Lights" clips. Timeline from tools/build-insta-reel.py. The stage video sits whole in
// a band across the middle (nobody cropped); name above, large captions below, all clear of the areas
// Instagram's own buttons cover (top ~230 px, bottom ~400 px).

const FPS = 30;
const sec = (x: number) => Math.round(x * FPS);
type Cap = { t0: number; t1: number; text: string };
type Item =
  | { kind: "clip"; from: number; dur: number; src: string; parts: { start: number; dur: number; at: number }[]; name: string; role: string; alum: boolean; caps: Cap[] }
  | { kind: "title"; from: number; dur: number }
  | { kind: "fel"; from: number; dur: number; cards: Card[]; count: number }
  | { kind: "close"; from: number; dur: number };
const ITEMS = reel.items as Item[];
export const REEL_FRAMES: number = reel.total;

const BAND_TOP = 660, BAND_H = 608; // 16:9 band, full width
const edge = (frame: number, dur: number, inn = 0.25, out = 0.25) =>
  interpolate(frame, [0, sec(inn), sec(dur - out), sec(dur)], [0, 1, 1, 0], clamp);
const rise = (frame: number, a: number, d = 0.6) => ({
  opacity: interpolate(frame, [sec(a), sec(a + d)], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [sec(a), sec(a + d)], [20, 0], { ...clamp, easing: Easing.out(Easing.quad) })}px)`,
});

const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 55% at 50% 50%, #13284a 0%, ${C.navy} 45%, ${C.night} 100%)` }} />
);

// Small running header, the same on every speaker
const Header: React.FC = () => (
  <div style={{ position: "absolute", top: 262, left: 0, right: 0, textAlign: "center" }}>
    <div style={{ fontFamily: text, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: C.gold }}>GUIDING LIGHTS 2026</div>
    <div style={{ width: 90, height: 2, background: C.goldDeep, margin: "14px auto 0" }} />
  </div>
);

// One stretch of a speaker's clip. Cuts sit in the silence between words, so only a very short audio fade
// (1 frame in, 2 out) is needed; a later part of the same speaker dips in from black over 4 frames.
const Part: React.FC<{ src: string; start: number; dur: number; first: boolean }> = ({ src, start, dur, first }) => {
  const frame = useCurrentFrame();
  const vol = (f: number) => interpolate(f, [0, 1, sec(dur) - 2, sec(dur)], [0, 1, 1, 0], clamp);
  const o = first ? 1 : interpolate(frame, [0, 4], [0, 1], clamp);
  return <OffthreadVideo src={staticFile(src)} startFrom={sec(start)} volume={vol} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: o }} />;
};

const Clip: React.FC<{ it: Extract<Item, { kind: "clip" }> }> = ({ it }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cap = it.caps.find((c) => t >= c.t0 && t < c.t1);
  const capO = cap ? interpolate(t, [cap.t0, cap.t0 + 0.1, cap.t1 - 0.1, cap.t1], [0, 1, 1, 0], clamp) : 0;
  const push = interpolate(frame, [0, sec(it.dur)], [1.0, 1.04], clamp);
  return (
    <AbsoluteFill style={{ opacity: edge(frame, it.dur) }}>
      <Backdrop />
      <Header />
      {/* name and role, just above the video */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 1920 - BAND_TOP + 34, textAlign: "center", color: C.cream }}>
        <div style={{ fontFamily: display, fontSize: 58, lineHeight: 1.1, ...rise(frame, 0.1) }}>{it.name}</div>
        <div style={{ fontFamily: text, fontSize: 28, color: C.gold, marginTop: 10, lineHeight: 1.3, whiteSpace: "pre-line", ...rise(frame, 0.25) }}>{it.role}</div>
        {it.alum && <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 26, color: C.muted, marginTop: 6, ...rise(frame, 0.35) }}>Alumnus, Sainik School Kazhakootam</div>}
      </div>
      <div style={{ position: "absolute", top: BAND_TOP, left: 0, width: 1080, height: BAND_H, overflow: "hidden", borderTop: "2px solid rgba(255,211,138,.55)", borderBottom: "2px solid rgba(255,211,138,.55)" }}>
        <div style={{ width: "100%", height: "100%", transform: `scale(${push})` }}>
          {it.parts.map((p, i) => (
            <Sequence key={i} from={sec(p.at)} durationInFrames={sec(p.dur)}>
              <Part src={it.src} start={p.start} dur={p.dur} first={i === 0} />
            </Sequence>
          ))}
        </div>
      </div>
      {/* caption, below the video */}
      <div style={{ position: "absolute", top: BAND_TOP + BAND_H + 60, left: 70, right: 70, textAlign: "center", opacity: capO }}>
        <span style={{ fontFamily: text, fontSize: 54, lineHeight: 1.4, color: "#fffaf0" }}>{cap?.text}</span>
      </div>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, sec(1.2)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: edge(frame, dur, 0.3, 0.35) }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream, paddingBottom: 60 }}>
        <div style={{ width: 300, height: 300, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(255,211,138,.75)", boxShadow: `0 0 ${50 + 60 * glow}px rgba(255,190,90,${0.4 * glow})`, opacity: glow }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: 32, letterSpacing: 2, marginTop: 30, ...rise(frame, 0.3) }}>In remembrance of <span style={{ color: C.gold }}>NBN Sir</span></div>
        <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1, color: C.gold, marginTop: 50, ...rise(frame, 0.6, 0.7) }}>Guiding</div>
        <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1, color: C.gold, ...rise(frame, 0.75, 0.7) }}>Lights</div>
        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 38, color: C.cream, marginTop: 30, ...rise(frame, 1.1) }}>Celebrating Educators Who Shape Generations</div>
        <div style={{ width: 120, height: 2, background: C.goldDeep, margin: "34px 0 28px", ...rise(frame, 1.3) }} />
        <div style={{ fontFamily: text, fontSize: 32, color: C.muted, ...rise(frame, 1.4) }}>21 November 2026 · Pangode, Thiruvananthapuram</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Fel: React.FC<{ it: Extract<Item, { kind: "fel" }> }> = ({ it }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const last = it.cards.length ? it.cards[it.cards.length - 1].at : 0;
  const endO = interpolate(t, [last + 0.4, last + 1.1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: edge(frame, it.dur, 0.3, 0.3) }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 1920 - BAND_TOP + 40, textAlign: "center", color: C.cream }}>
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: 28, letterSpacing: 9, color: C.gold, ...rise(frame, 0.1) }}>FELICITATION</div>
        <div style={{ fontFamily: display, fontSize: 60, lineHeight: 1.15, marginTop: 18, ...rise(frame, 0.3) }}>Educators who<br />shape generations</div>
      </div>
      <div style={{ position: "absolute", top: BAND_TOP, left: 0, width: 1080, height: BAND_H, overflow: "hidden", borderTop: "2px solid rgba(255,211,138,.55)", borderBottom: "2px solid rgba(255,211,138,.55)" }}>
        <div style={{ width: 1920, height: 1080, transform: `scale(${1080 / 1920})`, transformOrigin: "0 0" }}>
          <TableScene dur={it.dur + 1} cards={it.cards} count={it.count} bare />
        </div>
      </div>
      <div style={{ position: "absolute", top: BAND_TOP + BAND_H + 60, left: 0, right: 0, textAlign: "center", color: C.cream, opacity: endO }}>
        <span style={{ fontFamily: display, fontSize: 84, color: C.gold }}>{it.count}</span>
        <span style={{ fontFamily: text, fontSize: 46, marginLeft: 18 }}>educators honoured</span>
      </div>
    </AbsoluteFill>
  );
};

const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: edge(frame, dur, 0.4, 0.8) }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream, paddingBottom: 80 }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: 230, height: 230, ...rise(frame, 0.2) }} />
        <div style={{ fontFamily: text, fontSize: 32, color: C.muted, marginTop: 34, ...rise(frame, 0.5) }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontSize: 66, lineHeight: 1.1, marginTop: 8, ...rise(frame, 0.7) }}>Sainik School<br />Kazhakootam</div>
        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 32, color: "#d9cfb8", marginTop: 20, ...rise(frame, 1.0) }}>Supported by the 1991 Batch</div>
        <div style={{ width: 120, height: 2, background: C.goldDeep, margin: "44px 0 40px", ...rise(frame, 1.3) }} />
        <div style={{ fontFamily: text, fontSize: 36, ...rise(frame, 1.5) }}>Full film: link in bio</div>
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: 44, color: C.gold, marginTop: 16, ...rise(frame, 1.7) }}>nbn.sskzmoba.org</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Reel: React.FC<{ items: Item[]; music: string }> = ({ items, music }) => (
  <AbsoluteFill style={{ background: C.night }}>
    <Audio src={staticFile(music)} />
    {items.map((it, i) => (
      <Sequence key={i} from={it.from} durationInFrames={sec(it.dur)}>
        {it.kind === "clip" && <Clip it={it} />}
        {it.kind === "title" && <Title dur={it.dur} />}
        {it.kind === "fel" && <Fel it={it} />}
        {it.kind === "close" && <Close dur={it.dur} />}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const InstaReel: React.FC = () => <Reel items={ITEMS} music="film/insta-music.wav" />;

// One reel per guest (about 20 s): their whole clip from the film, then the OBA close. Posted with that guest
// as collaborator. Compositions InstaGuest-<id>, numbered in the standard guest order.
export const GUESTS = guestReels as Record<string, { num: number; total: number; items: Item[] }>;
export const InstaGuest: React.FC<{ id: string }> = ({ id }) => <Reel items={GUESTS[id].items} music={`film/insta-music-${id}.wav`} />;
