import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { display, text } from "./GuidingLights";
import { THEMES } from "./Felicitation";

// Invitation to principals in the proportions of the organiser's sample (2026-10-30): four landscape
// photos (2 × 2) at the sample's size, the invitation leading. Cream only. Two wordings:
//   congrats  – the organiser's text ("Congratulations", one of a select group)
//   honoured  – the user's text ("We would be honoured and privileged …")
// Order (revised 2026-10-30): portrait, title, tagline; the invitation panel with date, time and venue;
// the guests; reply line; the school building at full strength; footer with the OBA logo. The school
// is not next to the venue line (Cariappa Auditorium is not at the school).
// Photos: landscape crops (600×464) in public/speakers/*-s.jpg, from the photos the organiser used.

const T = THEMES.cream;

// [photo, name, lines]
const GUESTS: [string, string, string[]][] = [
  ["ashok-s.jpg", "Dr B. Ashok IAS", ["Principal Secretary,", "Higher Education,", "Government of Keralam"]],
  ["amala-s.jpg", "Amala Akkineni", ["Director,", "Annapurna College", "of Film and Media"]],
  ["vasuki-s.jpg", "Dr K. Vasuki IAS", ["Secretary to the Governor", "of Keralam", "Doctor, Administrator", "and Author"]],
];

// How each photo sits in its tile:
//   centre – a portrait-shaped photo shown whole, a blurred copy of it filling the sides (Amala Akkineni)
//   lower  – shown slightly smaller and low, a blurred copy giving room above the head (Dr Vasuki)
const FIT: Record<string, "centre" | "lower"> = { "amala-s.jpg": "centre", "vasuki-s.jpg": "lower" };

const HEAD = { congrats: "Congratulations", honoured: <>We would be honoured and privileged<br />to felicitate you at Guiding Lights,</> };
const BODY = {
  congrats: <>You are one of a select group of school leaders chosen<br />to be felicitated at Guiding Lights, in recognition of your<br />leadership, dedication and contribution to education.</>,
  // Lines shorten from top to bottom (inverted pyramid), so the panel is evenly filled
  honoured: <>a distinguished gathering of school leaders, eminent<br />educators and inspiring speakers, in recognition<br />of your exemplary leadership, dedication and<br />invaluable contribution to education.</>,
};

// Type scale (2026-10-30): six sizes only
const F = { title: 92, head: 56, date: 44, name: 38, body: 31, small: 26 };

// Amala Akkineni's photo is small (265 px wide), so it is enlarged; a light sharpen keeps it crisp.
const SHARPEN = "amala-sharpen";
const FOOT_H = 470;

const Photo: React.FC<{ photo: string }> = ({ photo }) => {
  const src = staticFile(`speakers/${photo}`);
  const fit = FIT[photo];
  const fill = <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(.92)", transform: "scale(1.15)" }} />;
  if (fit === "centre") return (
    <>
      {fill}
      <Img src={src} style={{ position: "absolute", left: "50%", top: 0, height: "100%", transform: "translateX(-50%)", filter: `url(#${SHARPEN})`, WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }} />
    </>
  );
  if (fit === "lower") return (
    <>
      {fill}
      <Img src={src} style={{ position: "absolute", left: "4%", bottom: 0, width: "92%", height: "92%", WebkitMaskImage: "linear-gradient(180deg, transparent, #000 9%)", maskImage: "linear-gradient(180deg, transparent, #000 9%)" }} />
    </>
  );
  return <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", }} />;
};

const Card: React.FC<{ wording: keyof typeof BODY }> = ({ wording }) => {
  const congrats = wording === "congrats";
  const line = (w: number) => <div style={{ width: w, height: 2, background: T.rule }} />;
  return (
    <AbsoluteFill style={{ background: T.bg, color: T.ink, textAlign: "center" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={SHARPEN}><feConvolveMatrix order="3" kernelMatrix="0 -0.35 0 -0.35 2.4 -0.35 0 -0.35 0" preserveAlpha="true" /></filter>
      </svg>
      <div style={{ position: "absolute", width: 1100, height: 1100, left: -10, top: -420, borderRadius: "50%", background: `radial-gradient(circle, ${T.glow} 0%, transparent 55%)` }} />

      <AbsoluteFill style={{ alignItems: "center", padding: "30px 40px 0" }}>
        <div style={{ width: 112, height: 112, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(201,154,60,.85)", boxShadow: `0 0 50px ${T.glow}` }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: F.small, letterSpacing: 1.5, marginTop: 10 }}>In remembrance of N. B. N. Sir</div>
        <div style={{ fontFamily: display, fontSize: F.title, lineHeight: 1, marginTop: 10, filter: T.titleShadow }}>Guiding Lights</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12 }}>
          {line(50)}
          <div style={{ fontFamily: text, fontStyle: "italic", fontSize: F.body, color: T.accent }}>Celebrating Educators Who Shape Generations</div>
          {line(50)}
        </div>

        {/* The invitation, with date, time and venue, in one panel so it reads first */}
        <div style={{ marginTop: 26, background: "rgba(201,154,60,.11)", border: `2px solid ${T.rule}`, borderRadius: 16, padding: "24px 36px 26px", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(15,37,71,.05)" }}>
          <div style={{ fontFamily: display, fontSize: F.head, color: T.accent, lineHeight: congrats ? 1 : 1.15, marginBottom: 14 }}>{HEAD[wording]}</div>
          <div style={{ fontFamily: text, fontSize: F.body, lineHeight: 1.45 }}>{BODY[wording]}</div>
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 16px" }}>{line(90)}</div>
          <div style={{ fontFamily: display, fontSize: F.date, color: T.accent, lineHeight: 1.1 }}>Saturday, 21 November 2026</div>
          <div style={{ fontFamily: text, fontSize: F.body, marginTop: 6 }}>10:00 AM – 3:00 PM</div>
          <div style={{ fontFamily: text, fontSize: F.body, marginTop: 2 }}>Cariappa Auditorium, Pangode, Thiruvananthapuram</div>
        </div>

        <div style={{ fontFamily: text, fontSize: F.small, color: T.ink, opacity: 0.85, marginTop: 26, marginBottom: 20 }}>The felicitation will be held in the august presence of</div>

        {/* Guests, three in one row (G. Vijaya Raghavan withdrew, 2026-10-30), landscape photos at the sample's size */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 320px 320px", columnGap: 20 }}>
          {GUESTS.map(([photo, name, lines]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", width: 310, height: 240, borderRadius: 10, overflow: "hidden", border: `3px solid ${T.rule}`, boxShadow: "0 8px 24px rgba(15,37,71,.14)" }}>
                <Photo photo={photo} />
              </div>
              <div style={{ fontFamily: display, fontSize: F.name, marginTop: 10, lineHeight: 1.1 }}>{name}</div>
              <div style={{ fontFamily: text, fontSize: F.small, lineHeight: 1.3, marginTop: 4 }}>
                {lines.map(l => <div key={l} style={{ whiteSpace: "nowrap" }}>{l}</div>)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: text, fontSize: F.small, marginTop: 28 }}>Kindly confirm your participation with a brief reply.</div>
      </AbsoluteFill>

      {/* Bottom: the school building at full strength (whole clock tower, nothing over it), then the
          footer strip with the OBA logo and the initiative line */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: FOOT_H, background: T.foot, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("school.jpg")} style={{ width: 1080, height: 250, objectFit: "cover", objectPosition: "50% 95%", maxWidth: "none", borderTop: `3px solid ${T.rule}`, borderBottom: `3px solid ${T.rule}`, filter: "saturate(.8) sepia(.12)" }} />
        <Img src={staticFile("oba-logo.png")} style={{ width: 104, height: 104, marginTop: 20 }} />
        <div style={{ fontFamily: text, fontSize: F.small, marginTop: 8 }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontSize: F.date, lineHeight: 1.1 }}>Sainik School Kazhakootam</div>
      </div>
    </AbsoluteFill>
  );
};

export const InviteCongratsCream: React.FC = () => <Card wording="congrats" />;
export const InviteHonouredCream: React.FC = () => <Card wording="honoured" />;
