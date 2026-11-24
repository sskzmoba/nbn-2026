import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { display, text, C } from "./GuidingLights";

// Instagram Reel cover (1080x1920), 24 Nov 2026. Everything that matters sits inside the centre 3:4 area
// (y 240-1680) that the profile grid shows, and the title also inside the centre square (y 420-1500).
export const ReelCover: React.FC<{ kicker?: string }> = ({ kicker = "The teacher's story" }) => (
  <AbsoluteFill style={{ background: C.navy, color: C.cream }}>
    <Img src={staticFile("school.jpg")} style={{ position: "absolute", bottom: 0, width: "100%", height: 900, objectFit: "cover", objectPosition: "50% 40%", opacity: 0.75, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 45%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 45%)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.night} 0%, rgba(11,24,48,.9) 50%, rgba(11,24,48,.45) 80%, rgba(5,7,13,.7) 100%)` }} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 70px" }}>
      <div style={{ width: 330, height: 330, borderRadius: "50%", overflow: "hidden", border: "5px solid rgba(255,211,138,.85)", boxShadow: "0 0 80px rgba(255,211,138,.25)" }}>
        <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
      </div>
      <div style={{ fontFamily: text, fontSize: 36, color: C.muted, marginTop: 34 }}>In remembrance of</div>
      <div style={{ fontFamily: display, fontSize: 76, color: C.gold, lineHeight: 1.1 }}>NBN Sir</div>
      <div style={{ width: 140, height: 2, background: C.goldDeep, margin: "40px auto 34px" }} />
      <div style={{ fontFamily: display, fontSize: 150, lineHeight: 1 }}>Guiding Lights</div>
      <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 46, color: C.gold, marginTop: 26 }}>{kicker}</div>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: C.cream, marginTop: 40 }}>21 NOVEMBER 2026 · SSKZM OBA</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// Photo cover for the highlights Reel (24 Nov 2026), so the grid does not show two identical NBN Sir tiles.
// The honourees with the guests on stage, title above and line below, all inside the 3:4 grid crop.
export const ReelCoverPhoto: React.FC<{ photo?: string; kicker?: string; line?: string }> = ({
  photo = "film/ph/6795.jpg", kicker = "Highlights", line = "Educators who shape generations",
}) => (
  <AbsoluteFill style={{ background: C.navy, color: C.cream, alignItems: "center" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #13254a 0%, ${C.navy} 55%, ${C.night} 100%)` }} />
    <div style={{ position: "absolute", top: 300, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.goldDeep }}>GUIDING LIGHTS 2026</div>
      <div style={{ fontFamily: display, fontSize: 118, lineHeight: 1.05, color: C.gold, marginTop: 18 }}>{kicker}</div>
    </div>
    <div style={{ position: "absolute", top: 560, left: 40, right: 40, height: 760, borderRadius: 18, overflow: "hidden", border: "3px solid rgba(255,211,138,.8)", boxShadow: "0 20px 70px rgba(0,0,0,.55)" }}>
      <Img src={staticFile(photo)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%" }} />
    </div>
    <div style={{ position: "absolute", top: 1370, width: "100%", textAlign: "center", padding: "0 60px" }}>
      <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 50, color: C.cream }}>{line}</div>
      <div style={{ width: 120, height: 2, background: C.goldDeep, margin: "30px auto 26px" }} />
      <div style={{ fontFamily: text, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: C.muted }}>21 NOVEMBER 2026 · SSKZM OBA</div>
    </div>
  </AbsoluteFill>
);

// YouTube channel banner (2560x1440), 24 Nov 2026. Logo and name sit inside the 1546x423 safe area
// (x 507-2053, y 508-931) that every device shows; the school photo fills the rest for TVs and desktop.
export const YouTubeBanner: React.FC<{ safe?: boolean }> = ({ safe = false }) => (
  <AbsoluteFill style={{ background: C.navy, color: C.cream }}>
    <Img src={staticFile("school.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%", filter: "saturate(.75) sepia(.12)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(5,7,13,.55) 0%, rgba(11,24,48,.88) 34%, rgba(11,24,48,.92) 50%, rgba(11,24,48,.88) 66%, rgba(5,7,13,.6) 100%)` }} />
    <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, display: "flex", alignItems: "center", justifyContent: "center", gap: 56 }}>
      <Img src={staticFile("oba-logo.png")} style={{ height: 270, width: 270, objectFit: "contain", filter: "drop-shadow(0 0 30px rgba(255,211,138,.25))" }} />
      <div>
        <div style={{ fontFamily: display, fontSize: 92, lineHeight: 1.05, color: C.cream }}>SSKZM Old Boys Association</div>
        <div style={{ width: 150, height: 2, background: C.goldDeep, margin: "26px 0 24px" }} />
        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 44, color: C.gold }}>Alumni of Sainik School Kazhakootam</div>
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: C.muted, marginTop: 18 }}>THIRUVANANTHAPURAM · KERALAM</div>
      </div>
    </div>
    {safe && <div style={{ position: "absolute", left: 507, top: 508, width: 1546, height: 423, outline: "4px dashed red" }} />}
  </AbsoluteFill>
);

// Instagram Highlight circle cover (1080x1920, 24 Nov 2026). Instagram shows only a small circle from the centre,
// so everything sits inside a 760 px circle in the middle. Two versions: monogram "GL", or NBN Sir's portrait.
export const HighlightCover: React.FC<{ mode?: "monogram" | "portrait" }> = ({ mode = "monogram" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, #16295a 0%, ${C.navy} 40%, ${C.night} 100%)`, alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 760, height: 760, borderRadius: "50%", border: `10px solid ${C.goldDeep}`, boxShadow: "0 0 90px rgba(255,211,138,.25)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: C.navy }}>
      {mode === "portrait" ? (
        <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
      ) : (
        <div style={{ textAlign: "center", color: C.gold }}>
          <div style={{ fontFamily: display, fontSize: 380, lineHeight: 0.9, letterSpacing: -6 }}>GL</div>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 64, letterSpacing: 14, color: C.cream, marginTop: 30 }}>2026</div>
        </div>
      )}
    </div>
  </AbsoluteFill>
);
