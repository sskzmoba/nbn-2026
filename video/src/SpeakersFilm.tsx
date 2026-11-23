import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { display, text, C, clamp, ease } from "./GuidingLights";
import film from "./speakers-film.json";
import { TableScene, Card } from "./FelicitationTable";

// "Voices from Guiding Lights": 16:9 film of the speakers' key lines (21 Nov 2026), for the guests and the community.
// Clips, captions and timings come from speakers-film.json, written by tools/build-speakers-film.py.
// Media in public/film/ (gitignored): trimmed clips, event photos (ph/), felicitation cards (fel/), music bed.

export const W = 1920, H = 1080;
type Cap = { t0: number; t1: number; text: string };
type Ph = { at: number; dur: number; srcs: string[]; zin: boolean; land: boolean };
type Tx = { t0: number; t1: number; label: string; title: string };
type Item =
  | { kind: "open"; from: number; dur: number }
  | { kind: "inter"; from: number; dur: number; photos: Ph[]; texts: Tx[] }
  | { kind: "clip"; from: number; dur: number; src: string; name: string; role: string; alum?: boolean; caps: Cap[] }
  | { kind: "fel"; from: number; dur: number; cards: Card[]; count: number }
  | { kind: "credits"; from: number; dur: number; honourees: string[]; family: Family }
  | { kind: "close"; from: number; dur: number };
const ITEMS = film.items as Item[];
export const FILM_FRAMES: number = film.total;
const FPS = 30;
const sec = (x: number) => Math.round(x * FPS);

// Fade in and out (seconds) for any scene of length dur
function edge(frame: number, dur: number, inn = 0.5, out = 0.5) {
  return interpolate(frame, [0, sec(inn), sec(dur - out), sec(dur)], [0, 1, 1, 0], clamp);
}
function wipe(frame: number, a: number, d: number): React.CSSProperties {
  const p = interpolate(frame, [sec(a), sec(a + d)], [0, 125], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const m = `linear-gradient(90deg, #000 ${p - 25}%, transparent ${p}%)`;
  return { WebkitMaskImage: m, maskImage: m };
}
const rise = (frame: number, a: number, d = 0.7) => ({
  opacity: interpolate(frame, [sec(a), sec(a + d)], [0, 1], clamp),
  transform: `translateY(${interpolate(frame, [sec(a), sec(a + d)], [22, 0], { ...clamp, easing: Easing.out(Easing.quad) })}px)`,
});

const SchoolBg: React.FC<{ dur: number; dim?: number }> = ({ dur, dim = 0.84 }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, sec(dur)], [-260, -60], clamp);
  return (
    <AbsoluteFill>
      <Img src={staticFile("school.jpg")} style={{ position: "absolute", height: 1080, width: 2266, left: x, top: 0, maxWidth: "none" }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(11,24,48,${dim}) 0%, rgba(11,24,48,${dim - 0.06}) 50%, rgba(5,7,13,.96) 100%)` }} />
    </AbsoluteFill>
  );
};

// Opening: NBN Sir's portrait glows in on a dark screen, then the title over the school. Piano from the start.
const T = 0.6; // start of the remembrance beat
const Open: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [sec(T), sec(T + 1.6), sec(T + 4.6), sec(T + 5.3)], [0, 1, 1, 0], clamp); // remembrance beat
  const glow = interpolate(frame, [sec(T), sec(T + 2.4)], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const b = interpolate(frame, [sec(T + 5.1), sec(T + 6.1)], [0, 1], clamp); // title beat
  const B = T + 0.2;
  const sweep = interpolate(frame, [sec(B + 5.2), sec(B + 7.6)], [-60, 160], clamp);
  const zoom = interpolate(frame, [sec(T), sec(T + 5.3)], [1, 1.06], clamp);
  return (
    <AbsoluteFill style={{ background: C.night, opacity: edge(frame, dur, 0.4, 0.7) }}>
      <AbsoluteFill style={{ opacity: a, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 90 }}>
        <div style={{ position: "absolute", width: 1500, height: 1500, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,196,102,${0.24 * glow}) 0%, transparent 55%)`, left: 0, top: -210 }} />
        <div style={{ width: 470, height: 470, borderRadius: "50%", overflow: "hidden", border: "5px solid rgba(255,211,138,.75)", boxShadow: `0 0 ${60 + 70 * glow}px rgba(255,190,90,${0.4 * glow})`, flexShrink: 0, opacity: glow, filter: `brightness(${0.6 + 0.4 * glow})` }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)", transform: `scale(${zoom})` }} />
        </div>
        <div style={{ color: C.cream, position: "relative" }}>
          <div style={{ fontFamily: text, fontSize: 40, letterSpacing: 3, ...rise(frame, T + 0.9) }}>In remembrance of</div>
          <div style={{ fontFamily: display, fontSize: 112, color: C.gold, margin: "4px 0 10px", ...rise(frame, T + 1.3) }}>NBN Sir</div>
          <div style={{ fontFamily: text, fontSize: 34, color: C.muted, ...rise(frame, T + 1.8) }}>Shri N Balakrishnan Nair · 1929–2016</div>
          <div style={{ fontFamily: text, fontSize: 34, color: C.muted, marginTop: 6, ...rise(frame, T + 2.0) }}>Sainik School Kazhakootam, 1962–1989</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: b }}>
        <SchoolBg dur={dur} dim={0.86} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontFamily: display, fontSize: 190, lineHeight: 1, backgroundImage: `linear-gradient(100deg, ${C.cream} ${sweep - 30}%, #fff6dc ${sweep - 8}%, ${C.gold} ${sweep}%, #fff6dc ${sweep + 8}%, ${C.cream} ${sweep + 30}%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 30px rgba(255,200,110,.35))" }}>Guiding Lights</div>
          <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 50, color: C.gold, marginTop: 22, ...wipe(frame, B + 6.2, 1.3) }}>Celebrating Educators Who Shape Generations</div>
          <div style={{ width: 150, height: 2, background: C.goldDeep, margin: "40px 0 34px", ...rise(frame, B + 7.2) }} />
          <div style={{ fontFamily: text, fontSize: 36, color: C.cream, ...rise(frame, B + 7.4) }}>Saturday, 21 November 2026 · Cariappa Auditorium, Pangode, Thiruvananthapuram</div>
          <div style={{ fontFamily: display, fontSize: 52, color: C.gold, marginTop: 44, ...rise(frame, B + 8.4, 0.9) }}>Voices from the day</div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Photo interlude: event photos with slow zoom and crossfades; section label and title over the lower part.
const Frame: React.FC<{ p: Ph }> = ({ p }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, sec(0.7), sec(p.dur - 0.7), sec(p.dur)], [0, 1, 1, 0], clamp);
  const k = interpolate(frame, [0, sec(p.dur)], p.zin ? [1.0, 1.07] : [1.07, 1.0], { ...clamp, easing: ease });
  const bg = staticFile(p.srcs[0]);
  if (p.srcs.length > 1) {
    // two to four photos side by side on a blurred backdrop: landscape cards, or portrait cards
    const n = p.srcs.length;
    const cw = Math.min(p.land ? 860 : 500, (1760 - 46 * (n - 1)) / n);
    const ch = p.land ? cw / 1.5 : cw * 1.416;
    return (
      <AbsoluteFill style={{ opacity: o, background: C.night }}>
        <Img src={bg} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(.4)", transform: "scale(1.15)" }} />
        <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 46, paddingBottom: 170 }}>
          {p.srcs.map((s, i) => (
            <div key={s} style={{ width: cw, height: ch, overflow: "hidden", borderRadius: 10, border: "3px solid rgba(255,211,138,.8)", boxShadow: "0 20px 60px rgba(0,0,0,.55)", ...rise(frame, 0.15 + i * 0.25, 0.8) }}>
              <Img src={staticFile(s)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${k})` }} />
            </div>
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: o, background: C.night }}>
      {/* blurred copy fills the sides of portrait photos */}
      <Img src={bg} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(.45)", transform: "scale(1.15)" }} />
      <Img src={bg} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `scale(${k})` }} />
    </AbsoluteFill>
  );
};

const Inter: React.FC<{ dur: number; photos: Ph[]; texts: Tx[] }> = ({ dur, photos, texts }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: C.night, opacity: edge(frame, dur, 0.5, 0.5) }}>
      {photos.map((p, i) => (
        <Sequence key={i} from={sec(p.at)} durationInFrames={sec(p.dur)}>
          <Frame p={p} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(5,7,13,.6) 72%, rgba(5,7,13,.92) 100%)" }} />
      {texts.map((x, i) => {
        const o = interpolate(t, [x.t0 + 0.4, x.t0 + 1.1, x.t1 - 0.6, x.t1], [0, 1, 1, 0], clamp);
        const f = frame - sec(x.t0);
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", color: C.cream, opacity: o, padding: "0 200px" }}>
            <div style={{ fontFamily: text, fontWeight: 700, fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: C.gold, ...rise(f, 0.4) }}>{x.label}</div>
            <div style={{ width: 110, height: 2, background: C.goldDeep, margin: "18px auto 20px", ...rise(f, 0.5) }} />
            <div style={{ fontFamily: display, fontSize: 60, lineHeight: 1.15, textShadow: "0 2px 12px rgba(0,0,0,.7)", ...wipe(f, 0.6, 1.0) }}>{x.title}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Clip: React.FC<{ dur: number; src: string; name: string; role: string; alum?: boolean; caps: Cap[] }> = ({ dur, src, name, role, alum, caps }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const lower = interpolate(frame, [sec(0.5), sec(1.2), sec(5.8), sec(6.5)], [0, 1, 1, 0], clamp);
  const cap = caps.find((c) => t >= c.t0 && t < c.t1);
  const capO = cap ? interpolate(t, [cap.t0, cap.t0 + 0.12, cap.t1 - 0.12, cap.t1], [0, 1, 1, 0], clamp) : 0;
  const push = interpolate(frame, [0, sec(dur)], [1.0, 1.04], clamp);
  return (
    <AbsoluteFill style={{ background: C.night, opacity: edge(frame, dur, 0.4, 0.4) }}>
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 52%, rgba(5,7,13,.55) 74%, rgba(5,7,13,.88) 100%)" }} />
      {/* Lower third: name and role */}
      <div style={{ position: "absolute", left: 90, top: 70, opacity: lower, transform: `translateX(${(1 - lower) * -24}px)`, borderLeft: `5px solid ${C.goldDeep}`, paddingLeft: 26, background: "linear-gradient(90deg, rgba(11,24,48,.82), rgba(11,24,48,0))", paddingRight: 120, paddingTop: 10, paddingBottom: 12 }}>
        <div style={{ fontFamily: display, fontSize: 54, color: C.cream }}>{name}</div>
        <div style={{ fontFamily: text, fontSize: 28, color: C.gold, marginTop: 2 }}>{role}</div>
        {alum && <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 26, color: C.cream, marginTop: 4 }}>Alumnus, Sainik School Kazhakootam</div>}
      </div>
      {/* Caption */}
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 74, textAlign: "center", opacity: capO }}>
        <span style={{ fontFamily: text, fontSize: 50, lineHeight: 1.45, color: "#fffaf0", background: "rgba(5,7,13,.62)", padding: "6px 26px", borderRadius: 6, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>{cap?.text}</span>
      </div>
    </AbsoluteFill>
  );
};

// End credits: a steady scroll over the school that runs fully off the top of the screen; the final slide follows.
// Guest categories as in the programme (user, 23 Nov 2026).
const GUESTS_OF_HONOUR: [string, string][] = [
  ["Dr K Vasuki IAS", ""],
  ["Smt Amala Akkineni", ""],
  ["Prof Dr Jancy James", ""],
  ["Dr TR John", "Alumnus, Sainik School Kazhakootam"],
  ["Shri R Abhilash", ""],
];
const SPECIAL_GUESTS = ["Col Sidharth Karanbir Gurung", "Col Abhishek Vohra"];
const COMMITTEE = [
  "Capt(IN) KM Breeze Antony", "Sqn Ldr Pradeep Kumar (Retd)",
  "Col Pramod M", "Lt Col Arun Sathyan",
  "Manu G", "Vinod V",
];
type Family = { principal: string[]; later: string[]; teacher: string[] };

const Credits: React.FC<{ dur: number; honourees: string[]; family: Family }> = ({ dur, honourees, family }) => {
  const frame = useCurrentFrame();
  // steady scroll (gentle start), from the title low on screen to the last line gone off the top
  const p = interpolate(frame, [sec(1.0), sec(dur - 0.6)], [0, 1], { ...clamp, easing: Easing.bezier(0.35, 0, 0.75, 1) });
  const label: React.CSSProperties = { fontFamily: text, fontWeight: 700, fontSize: 24, letterSpacing: 7, textTransform: "uppercase", color: C.gold, marginBottom: 14 };
  const name: React.CSSProperties = { fontFamily: text, fontSize: 36, lineHeight: 1.45 };
  const note: React.CSSProperties = { fontFamily: text, fontStyle: "italic", fontSize: 25, color: "#d9cfb8", marginTop: -4, marginBottom: 8 };
  const block: React.CSSProperties = { marginBottom: 70 };
  const two = (list: string[], size = 32) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 90, width: 1240, margin: "0 auto" }}>
      {list.map((h, i) => {
        const lone = list.length % 2 === 1 && i === list.length - 1; // an odd last name sits centred under both columns
        return <div key={i} style={{ ...name, fontSize: size, textAlign: lone ? "center" : i % 2 ? "left" : "right", gridColumn: lone ? "1 / 3" : undefined }}>{h}</div>;
      })}
    </div>
  );
  const fade = "linear-gradient(180deg, transparent 0%, #000 13%, #000 87%, transparent 100%)";
  return (
    <AbsoluteFill style={{ opacity: edge(frame, dur, 0.7, 0.5) }}>
      <SchoolBg dur={dur} dim={0.92} />
      <AbsoluteFill style={{ WebkitMaskImage: fade, maskImage: fade }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", color: C.cream,
          transform: `translateY(calc(${360 * (1 - p)}px - ${p * 100}%))` }}>
          <div style={{ fontFamily: display, fontSize: 84, color: C.gold, marginBottom: 70 }}>With gratitude</div>
          <div style={block}><div style={label}>Chief Guest</div><div style={{ ...name, fontSize: 44 }}>Dr B Ashok IAS</div></div>
          <div style={block}>
            <div style={label}>Guests of Honour</div>
            {GUESTS_OF_HONOUR.map(([g, n]) => (
              <div key={g}><div style={name}>{g}</div>{n && <div style={note}>{n}</div>}</div>
            ))}
          </div>
          <div style={block}>
            <div style={label}>Special Guests</div>
            {SPECIAL_GUESTS.map((g) => <div key={g} style={name}>{g}</div>)}
          </div>
          <div style={block}>
            <div style={label}>Moderator</div>
            <div style={name}>Kamal Krishnan PS</div>
            <div style={note}>Alumnus, Sainik School Kazhakootam</div>
          </div>
          <div style={block}>
            <div style={label}>Principals and heads of schools honoured</div>
            {two(honourees)}
          </div>
          <div style={block}>
            <div style={label}>From the Sainik School Kazhakootam family</div>
            {family.principal.map((h) => <div key={h}><div style={name}>{h}</div><div style={note}>Former Principal</div></div>)}
            <div style={{ ...note, marginTop: 22 }}>Former teachers, later heads of schools</div>
            {family.later.map((h) => <div key={h} style={name}>{h}</div>)}
            <div style={{ ...note, marginTop: 22 }}>Former teacher</div>
            {family.teacher.map((h) => <div key={h} style={name}>{h}</div>)}
          </div>
          <div style={block}>
            <div style={label}>Organising committee</div>
            {two(COMMITTEE, 34)}
          </div>
          <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 36, lineHeight: 1.5, color: C.cream, marginTop: 30 }}>
            To the Principal, officers, teachers and staff of Sainik School Kazhakootam,<br />
            and to every alumnus and friend who joined us, in the auditorium and online:
          </div>
          <div style={{ fontFamily: display, fontSize: 64, color: C.gold, marginTop: 18 }}>thank you.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Final slide, still: NBN Sir, then the OBA and the website.
const Close: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [sec(1.4), sec(2.3)], [0.86, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return (
    <AbsoluteFill style={{ background: C.night, opacity: edge(frame, dur, 0.8, 1.6) }}>
      <div style={{ position: "absolute", width: 1600, height: 1600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,196,102,.14) 0%, transparent 55%)", left: 160, top: -300 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", color: C.cream }}>
        <div style={{ fontFamily: text, fontSize: 32, color: C.muted, letterSpacing: 2, ...rise(frame, 0.3) }}>In remembrance of</div>
        <div style={{ fontFamily: display, fontSize: 92, color: C.gold, lineHeight: 1.1, ...rise(frame, 0.6) }}>NBN Sir</div>
        <div style={{ width: 140, height: 2, background: C.goldDeep, margin: "34px 0 34px", ...rise(frame, 1.1) }} />
        <Img src={staticFile("oba-logo.png")} style={{ width: 170, height: 170, transform: `scale(${pop})`, opacity: interpolate(frame, [sec(1.4), sec(1.9)], [0, 1], clamp) }} />
        <div style={{ fontFamily: text, fontSize: 30, color: C.muted, marginTop: 24, ...rise(frame, 1.9) }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontSize: 62, marginTop: 4, ...rise(frame, 2.1) }}>Sainik School Kazhakootam</div>
        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 32, color: "#d9cfb8", marginTop: 14, ...rise(frame, 2.5) }}>Supported by the 1991 Batch</div>
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: 44, color: C.gold, marginTop: 40, letterSpacing: 1, ...rise(frame, 3.0) }}>nbn.sskzmoba.org</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SpeakersFilm: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Audio src={staticFile("film/music.wav")} />
    {ITEMS.map((it, i) => (
      <Sequence key={i} from={it.from} durationInFrames={sec(it.dur)}>
        {it.kind === "open" && <Open dur={it.dur} />}
        {it.kind === "inter" && <Inter dur={it.dur} photos={it.photos} texts={it.texts} />}
        {it.kind === "clip" && <Clip dur={it.dur} src={it.src} name={it.name} role={it.role} alum={it.alum} caps={it.caps} />}
        {it.kind === "fel" && <TableScene dur={it.dur} cards={it.cards} count={it.count} />}
        {it.kind === "credits" && <Credits dur={it.dur} honourees={it.honourees} family={it.family} />}
        {it.kind === "close" && <Close dur={it.dur} />}
      </Sequence>
    ))}
  </AbsoluteFill>
);
