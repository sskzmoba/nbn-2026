import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { display, text } from "./GuidingLights";
import { THEMES } from "./Felicitation";

// Square pictures for the WhatsApp group icon and status (2026-11-06). WhatsApp crops a group icon to a
// circle, so all text stays inside the circle. No guest names or photos: the guest list may change.

const Portrait: React.FC<{ size: number; glow: string }> = ({ size, glow }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: "7px solid rgba(201,154,60,.9)", boxShadow: `0 0 90px ${glow}` }}>
    <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
  </div>
);

// Version 1: N. B. N. Sir's portrait on navy
export const GroupPortrait: React.FC = () => {
  const T = THEMES.navy;
  return (
    <AbsoluteFill style={{ background: T.bg, color: T.ink, textAlign: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 1200, height: 1200, left: -60, top: -320, borderRadius: "50%", background: `radial-gradient(circle, ${T.glow} 0%, transparent 58%)` }} />
      <div style={{ marginTop: 140, position: "relative" }}><Portrait size={410} glow={T.glow} /></div>
      <div style={{ fontFamily: text, fontSize: 36, letterSpacing: 1.5, marginTop: 24, position: "relative" }}>In remembrance of N. B. N. Sir</div>
      <div style={{ fontFamily: display, fontSize: 142, lineHeight: 1, marginTop: 12, color: T.ink, filter: T.titleShadow, position: "relative" }}>Guiding Lights</div>
      <div style={{ width: 120, height: 3, background: T.rule, marginTop: 44, position: "relative" }} />
      <div style={{ fontFamily: display, fontSize: 56, color: T.accent, marginTop: 20, position: "relative" }}>21 November 2026</div>
    </AbsoluteFill>
  );
};

// Version 2: the school building on cream
export const GroupSchool: React.FC = () => {
  const T = THEMES.cream;
  return (
    <AbsoluteFill style={{ background: T.bg, color: T.ink, textAlign: "center", alignItems: "center" }}>
      <div style={{ fontFamily: text, fontSize: 36, letterSpacing: 1.5, marginTop: 140 }}>In remembrance of N. B. N. Sir</div>
      <div style={{ fontFamily: display, fontSize: 156, lineHeight: 1, marginTop: 14 }}>Guiding Lights</div>
      <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 40, color: T.accent, marginTop: 30 }}>Celebrating Educators Who Shape Generations</div>
      <Img src={staticFile("school.jpg")} style={{ width: 1080, height: 330, objectFit: "cover", objectPosition: "50% 95%", maxWidth: "none", marginTop: 40, borderTop: `4px solid ${T.rule}`, borderBottom: `4px solid ${T.rule}`, filter: "saturate(.85) sepia(.1)" }} />
      <div style={{ fontFamily: display, fontSize: 60, color: T.accent, marginTop: 36 }}>21 November 2026</div>
    </AbsoluteFill>
  );
};
