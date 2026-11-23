import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { display, text, C } from "./GuidingLights";

// YouTube thumbnail for "Voices from the day" (1280x720, 24 Nov 2026): the honourees with the guests on the
// right, the title on the left, NBN Sir's portrait. Few words, large, so it reads at phone-list size.
export const YouTubeThumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Img src={staticFile("film/group.jpg")} style={{ position: "absolute", right: 0, top: 0, height: 720, width: 900, objectFit: "cover", objectPosition: "50% 40%" }} />
    <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.night} 0%, ${C.night} 30%, rgba(5,7,13,.88) 45%, rgba(5,7,13,.25) 72%, rgba(5,7,13,.1) 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 70%, rgba(5,7,13,.55) 100%)" }} />
    <div style={{ position: "absolute", left: 64, top: 46, color: C.cream }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,211,138,.85)", boxShadow: "0 0 40px rgba(255,190,90,.35)" }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: 26, lineHeight: 1.3, color: C.muted }}>In remembrance of<br /><span style={{ color: C.gold, fontSize: 34 }}>NBN Sir</span></div>
      </div>
      <div style={{ fontFamily: display, fontSize: 124, lineHeight: 0.95, color: C.gold, marginTop: 44, textShadow: "0 4px 24px rgba(0,0,0,.6)" }}>Guiding<br />Lights</div>
      <div style={{ width: 110, height: 3, background: C.goldDeep, margin: "30px 0 24px" }} />
      <div style={{ fontFamily: display, fontSize: 58, lineHeight: 1.05, textShadow: "0 3px 16px rgba(0,0,0,.7)" }}>Voices<br />from the day</div>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.gold, marginTop: 34 }}>21 NOVEMBER 2026</div>
    </div>
  </AbsoluteFill>
);
