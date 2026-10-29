import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, display, text } from "./GuidingLights";

// Felicitation card for honourees (2:3). Two themes:
//   navy  — for WhatsApp; same navy / gold / cream as the website and the film
//   cream — for printing; navy text on cream (saves ink), deeper gold for contrast
// Real portrait, school photo and OBA logo from public/.
// Render: see build.md (four compositions: Felicitation, FelicitationCream, FelicitationOriginal,
// FelicitationOriginalCream)

export const THEMES = {
  navy: {
    bg: `linear-gradient(180deg, ${C.navy} 0%, #0a1528 55%, ${C.night} 100%)`,
    shade: `linear-gradient(180deg, ${C.navy} 0%, rgba(11,24,48,.9) 62%, rgba(11,24,48,.35) 80%, rgba(11,24,48,.15) 100%)`,
    photo: 0.6, ink: C.cream, accent: C.gold, muted: C.muted, rule: C.goldDeep,
    glow: "rgba(255,196,102,.22)", titleShadow: "drop-shadow(0 0 24px rgba(255,200,110,.25))", foot: C.night,
  },
  cream: {
    bg: "linear-gradient(180deg, #fffdf8 0%, #faf6ee 60%, #f3ead8 100%)",
    shade: "linear-gradient(180deg, #fffdf8 0%, rgba(250,246,238,.92) 62%, rgba(250,246,238,.25) 80%, rgba(250,246,238,0) 100%)",
    photo: 0.75, ink: "#0f2547", accent: "#9a6d1f", muted: "#5b6475", rule: "#c99a3c",
    glow: "rgba(201,154,60,.16)", titleShadow: "none", foot: "#f1e7d2",
  },
};

// "invite" is the suggested wording (2026-10-27): no heading, as the title is just above;
// "original" is the wording of the first card
const WORDING = {
  invite: { heading: null, intro: <>Guiding Lights brings together school leaders, teachers<br />and distinguished speakers for conversations on education.</>, body: <>We would be honoured to felicitate you on this occasion,<br />in recognition of your leadership, dedication<br />and contribution to education.</> },
  original: { heading: "Congratulations", intro: null, body: <>You have been chosen among a select group of school<br />leaders to be felicitated at Guiding Lights,<br />in recognition of your leadership, dedication<br />and contribution to education.</> },
};

// Four text sizes only (title, date, body, small); gold only for the tagline, the date and the rules
const SIZE = { title: 116, date: 60, body: 32, small: 27 };

const Rule: React.FC<{ color: string; my: number }> = ({ color, my }) => (
  <div style={{ width: 90, height: 2, background: color, margin: `${my}px auto` }} />
);

// Height of the footer strip; the school photo sits directly above it, clock tower unobstructed
const FOOT = 176;

const Card: React.FC<{ theme: keyof typeof THEMES; wording: keyof typeof WORDING }> = ({ theme, wording }) => {
  const T = THEMES[theme], W = WORDING[wording];
  return (
    <AbsoluteFill style={{ background: T.bg, color: T.ink, textAlign: "center" }}>
      {/* School photo above the footer strip, fading up into the background */}
      <Img src={staticFile("school.jpg")} style={{ position: "absolute", left: 0, bottom: FOOT, width: 1080, height: 250, objectFit: "cover", objectPosition: "50% 100%", maxWidth: "none", opacity: T.photo, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 30%)" }} />
      <AbsoluteFill style={{ background: T.shade }} />
      {/* Warm light behind the portrait */}
      <div style={{ position: "absolute", width: 1100, height: 1100, left: -10, top: -380, borderRadius: "50%", background: `radial-gradient(circle, ${T.glow} 0%, transparent 55%)` }} />

      <AbsoluteFill style={{ alignItems: "center", padding: "40px 70px 0" }}>
        <div style={{ width: 180, height: 180, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(201,154,60,.85)", boxShadow: `0 0 70px ${T.glow}` }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: SIZE.small, letterSpacing: 1.5, marginTop: 20 }}>In remembrance of N. B. N. Sir</div>

        <div style={{ fontFamily: display, fontWeight: 400, fontSize: SIZE.title, lineHeight: 1, marginTop: 20, filter: T.titleShadow }}>Guiding Lights</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, color: T.accent, marginTop: 14 }}>Celebrating Educators Who Shape Generations</div>

        <Rule color={T.rule} my={30} />

        {W.heading && <div style={{ fontFamily: display, fontWeight: 400, fontSize: 78, color: T.accent, letterSpacing: 1, marginBottom: 18 }}>{W.heading}</div>}
        {W.intro && <div style={{ fontFamily: text, fontSize: SIZE.body, lineHeight: 1.5, color: T.muted, marginBottom: 18 }}>{W.intro}</div>}
        <div style={{ fontFamily: text, fontSize: SIZE.body, lineHeight: 1.5 }}>{W.body}</div>

        <Rule color={T.rule} my={30} />

        <div style={{ fontFamily: text, fontWeight: 700, fontSize: SIZE.small, letterSpacing: 6, color: T.muted }}>SATURDAY</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: SIZE.date, color: T.accent, marginTop: 2 }}>21 November 2026</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, marginTop: 6 }}>10:00 AM – 3:00 PM</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, marginTop: 6 }}>Cariappa Auditorium, Pangode</div>
        <div style={{ fontFamily: text, fontSize: SIZE.small, color: T.muted, marginTop: 4 }}>Thiruvananthapuram</div>

        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: SIZE.small, marginTop: 30 }}>Kindly confirm your participation with a brief reply.</div>
      </AbsoluteFill>

      {/* Footer strip below the photo: logo above the initiative line, centred */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: FOOT, background: T.foot, borderTop: `2px solid ${T.rule}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: 78, height: 78 }} />
        <div style={{ fontFamily: text, fontSize: 24, color: T.muted, marginTop: 6 }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: 38, marginTop: 2 }}>Sainik School Kazhakootam</div>
      </div>
    </AbsoluteFill>
  );
};

export const Felicitation: React.FC = () => <Card theme="navy" wording="invite" />;
export const FelicitationCream: React.FC = () => <Card theme="cream" wording="invite" />;
export const FelicitationOriginal: React.FC = () => <Card theme="navy" wording="original" />;
export const FelicitationOriginalCream: React.FC = () => <Card theme="cream" wording="original" />;
