import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { display, text, C, clamp } from "./GuidingLights";
import film from "./speakers-film.json";

// Felicitation collage (v4, 23 Nov 2026): every honouree's stage photo is dropped onto a table like a print,
// overlapping and scattered across it, slowly at first and then faster and faster (card times from the build
// script). Prints have an ivory border with a thin gold line (user's choice from white / ivory / navy).
// Used in SpeakersFilm; the FelicitationTable composition previews it alone with the same music.

export type Card = { src: string; at: number; rot: number };
const FPS = 30;
const sec = (x: number) => Math.round(x * FPS);
const CW = 420, CH = 280;

// Card border styles that were compared (still selectable for a preview with --props).
const BORDERS: Record<string, { pad: string; inner: string; table: number }> = {
  white: { pad: "#f7f1e3", inner: "none", table: 0.12 },
  ivory: { pad: "#efe6d2", inner: "inset 0 0 0 1.5px rgba(176,132,52,.9)", table: 0.12 },
  navy: { pad: "#14284a", inner: "inset 0 0 0 1.5px rgba(255,211,138,.85)", table: 0.2 },
};

// Spread the cards evenly (a jittered grid), placed in a shuffled order so the table fills all over rather
// than row by row; every card stays inside the frame. Fixed seed, so every render is the same.
function places(n: number) {
  let s = 1121;
  const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const cols = 8, rows = Math.ceil(n / cols);
  const cells = Array.from({ length: n }, (_, i) => i).sort(() => R() - 0.5);
  return cells.map((cell) => {
    const cx = 150 + ((cell % cols) + 0.5) * (1620 / cols) + (R() - 0.5) * 120;
    const cy = 120 + (Math.floor(cell / cols) + 0.5) * (840 / rows) + (R() - 0.5) * 90;
    return {
      x: Math.min(1920 - CW / 2 - 40, Math.max(CW / 2 + 40, cx)),
      y: Math.min(1080 - CH / 2 - 34, Math.max(CH / 2 + 34, cy)),
      rot: (R() - 0.5) * 22, dx: (R() - 0.5) * 260, dy: -140 - R() * 120,
    };
  });
}

// bare: no title or count (the vertical Instagram reel draws its own around the table)
export const TableScene: React.FC<{ dur: number; cards: Card[]; count: number; border?: string; bare?: boolean }> = ({ dur, cards, count, border = "ivory", bare = false }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const B = BORDERS[border] ?? BORDERS.ivory;
  const P = React.useMemo(() => places(cards.length), [cards.length]);
  const last = cards.length ? cards[cards.length - 1].at : 0;
  const cam = interpolate(frame, [0, sec(dur)], [1.0, 1.03], clamp);
  const titleO = interpolate(t, [0.2, 0.8, 1.5, 2.2], [0, 1, 1, 0], clamp);
  const endO = interpolate(t, [last + 0.5, last + 1.3], [0, 1], clamp);
  const o = interpolate(t, [0, 0.5, dur - 0.8, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#070b14", opacity: o }}>
      {/* the table: dark navy cloth under a warm pool of light */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 75% at 50% 48%, #1d2a44 0%, #111a2d 45%, #070b14 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, rgba(255,196,102,${B.table}) 0%, transparent 50%)` }} />
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {cards.map((c, i) => {
          const f = frame - sec(c.at);
          if (f < 0) return null;
          const q = P[i];
          const p = interpolate(f, [0, sec(0.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const op = interpolate(f, [0, sec(0.12)], [0, 1], clamp);
          return (
            <div key={c.src} style={{
              position: "absolute", left: q.x - CW / 2, top: q.y - CH / 2, width: CW, height: CH, padding: 9, background: B.pad, opacity: op,
              boxShadow: `${4 + 22 * (1 - p)}px ${8 + 34 * (1 - p)}px ${16 + 40 * (1 - p)}px rgba(0,0,0,${0.55 - 0.15 * p})`,
              transform: `translate(${q.dx * (1 - p)}px, ${q.dy * (1 - p)}px) scale(${1 + 0.45 * (1 - p)}) rotate(${q.rot + 14 * (1 - p) * Math.sign(q.rot || 1)}deg)`,
            }}>
              <Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {B.inner !== "none" && <div style={{ position: "absolute", inset: 5, boxShadow: B.inner, pointerEvents: "none" }} />}
            </div>
          );
        })}
      </AbsoluteFill>
      {/* opening title on the empty table */}
      {!bare && <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream, opacity: titleO }}>
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, letterSpacing: 9, textTransform: "uppercase", color: C.gold }}>Felicitation</div>
        <div style={{ width: 120, height: 2, background: C.goldDeep, margin: "18px auto 20px" }} />
        <div style={{ fontFamily: display, fontSize: 64 }}>Educators who shape generations</div>
      </AbsoluteFill>}
      {/* the count, on a soft band once the table is full */}
      {!bare && <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", opacity: endO }}>
        <div style={{ background: "rgba(5,7,13,.8)", border: "1px solid rgba(255,211,138,.55)", borderRadius: 6, padding: "18px 46px", color: C.cream, boxShadow: "0 10px 40px rgba(0,0,0,.6)" }}>
          <span style={{ fontFamily: display, fontSize: 64, color: C.gold }}>{count}</span>
          <span style={{ fontFamily: text, fontSize: 40, marginLeft: 18 }}>educators honoured</span>
        </div>
      </div>}
    </AbsoluteFill>
  );
};

// Preview: the scene alone, with the stretch of the film's music it sits on.
const FEL = (film.items as any[]).find((i) => i.kind === "fel") as { from: number; dur: number; cards: Card[]; count: number };
export const TABLE_FRAMES = sec(FEL.dur + 1.0);
export const FelicitationTable: React.FC<{ border?: string }> = ({ border = "ivory" }) => (
  <AbsoluteFill style={{ background: C.night }}>
    <Audio src={staticFile("film/music.wav")} startFrom={FEL.from} />
    <TableScene dur={FEL.dur + 1.0} cards={FEL.cards} count={FEL.count} border={border} />
  </AbsoluteFill>
);
