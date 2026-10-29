import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { display, text } from "./GuidingLights";
import { THEMES } from "./Felicitation";

// Invitation to principals (honourees) showing some of the distinguished guests (2026-10-29).
// Same look as the felicitation card; tall (1080×2060) to fill a phone screen. More guests can be added
// to SPEAKERS as they confirm (a third row fits if the photos shrink a little).
// Photos: square crops in public/speakers/ (originals in _source/photos/speakers/; not in the repo).

const SIZE = { title: 96, date: 54, body: 32, small: 27 };

// [photo, name, part in the programme, lines]
const SPEAKERS: [string, string, string, React.ReactNode[]][] = [
  ["ashok.jpg", "Dr B. Ashok IAS", "Chief Guest", ["Principal Secretary, Higher Education,", "Government of Keralam", "First Vice-Chancellor, Kerala", "Veterinary University"]],
  ["amala.jpg", "Amala Akkineni", "Guest of Honour", ["Director, Annapurna College of", "Film and Media, Hyderabad", "Actor; co-founder,", "Blue Cross of Hyderabad"]],
  ["gvr.jpg", "G. Vijaya Raghavan", "Panellist", ["Founder CEO, Technopark,", "India's first technology park", "Founder and Hon. Director, CADRRE", "(autism and other disabilities)"]],
  ["vasuki.jpg", "Dr K. Vasuki IAS", "Panellist", ["Secretary to the Governor of Keralam", "Former Secretary, General Education", "Doctor, administrator and author", <>of <i>The School of Life</i></>]],
];

// Bigger-picture version (2026-10-29): large photos as in the group's sample, two short lines each.
// Photos: square crops (880×880) in public/speakers/*-l.jpg
const SPEAKERS_LARGE: [string, string, string, React.ReactNode[]][] = [
  ["ashok-l.jpg", "Dr B. Ashok IAS", "Chief Guest", ["Principal Secretary, Higher Education", "Government of Keralam"]],
  ["amala-l.jpg", "Amala Akkineni", "Guest of Honour", ["Director, Annapurna College", "of Film and Media"]],
  ["gvr-l.jpg", "G. Vijaya Raghavan", "Panellist", ["Founder CEO, Technopark", "Founder, CADRRE (autism centre)"]],
  ["vasuki-l.jpg", "Dr K. Vasuki IAS", "Panellist", ["Secretary to the Governor of Keralam", "Doctor, administrator and author"]],
];

// Wording in the style of the group's sample (2026-10-29): "Congratulations" heading, no part
// in the programme under the names, a larger footer. "chosen" is the sample's text (grammar fixed),
// "invited" a softer form of it.
const SAMPLE = {
  chosen: <>You have been chosen among a select group of school leaders<br />to be felicitated at Guiding Lights, in recognition of your<br />leadership, dedication and contribution to education.</>,
  invited: <>You have been invited to be felicitated at Guiding Lights,<br />among a select group of school leaders, in recognition of your<br />leadership, dedication and contribution to education.</>,
};

const FOOT = 170;

const Card: React.FC<{ theme: keyof typeof THEMES; large?: boolean; sample?: keyof typeof SAMPLE }> = ({ theme, large, sample }) => {
  const T = THEMES[theme];
  const foot = large ? 226 : FOOT;
  const guests = large ? SPEAKERS_LARGE : SPEAKERS;
  const rule = (my: number) => <div style={{ width: 90, height: 2, background: T.rule, margin: `${my}px auto` }} />;
  return (
    <AbsoluteFill style={{ background: T.bg, color: T.ink, textAlign: "center" }}>
      {/* Warm light behind the portrait */}
      <div style={{ position: "absolute", width: 1100, height: 1100, left: -10, top: -400, borderRadius: "50%", background: `radial-gradient(circle, ${T.glow} 0%, transparent 55%)` }} />

      <AbsoluteFill style={{ alignItems: "center", padding: "36px 30px 0" }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(201,154,60,.85)", boxShadow: `0 0 60px ${T.glow}` }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: SIZE.small, letterSpacing: 1.5, marginTop: 10 }}>In remembrance of N. B. N. Sir</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: SIZE.title, lineHeight: 1, marginTop: 12, filter: T.titleShadow }}>Guiding Lights</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, color: T.accent, marginTop: 12 }}>Celebrating Educators Who Shape Generations</div>

        {rule(20)}
        {sample && <div style={{ fontFamily: display, fontWeight: 400, fontSize: 70, color: T.accent, letterSpacing: 1, lineHeight: 1, marginBottom: 16 }}>Congratulations</div>}
        <div style={{ fontFamily: text, fontSize: SIZE.body, lineHeight: 1.45 }}>
          {sample ? SAMPLE[sample] : <>We would be honoured to felicitate you at Guiding Lights,<br />a gathering of school leaders, teachers and distinguished<br />speakers, in recognition of your leadership, dedication<br />and contribution to education.</>}
        </div>
        {/* Large versions: the school building as a band between the invitation and the guests
            (not near the venue line: Cariappa Auditorium is not at the school) */}
        {large
          ? <div style={{ width: 1080, height: 210, margin: "16px -30px 14px", overflow: "hidden" }}>
              <Img src={staticFile("school.jpg")} style={{ width: 1080, height: 210, objectFit: "cover", objectPosition: "50% 100%", maxWidth: "none", opacity: T.photo, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 35%, #000 75%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 35%, #000 75%, transparent 100%)" }} />
            </div>
          : rule(20)}

        {sample
          ? <div style={{ fontFamily: text, fontWeight: 700, fontSize: SIZE.body, marginBottom: 22 }}>The felicitation will be held in the august presence of</div>
          : <div style={{ fontFamily: text, fontWeight: 700, fontSize: SIZE.small, letterSpacing: 5, color: T.muted, marginBottom: 22 }}>IN THE DISTINGUISHED PRESENCE OF</div>}

        {/* Guests, two per row */}
        <div style={{ display: "grid", gridTemplateColumns: "510px 510px", rowGap: sample ? 20 : large ? 28 : 26 }}>
          {guests.map(([photo, name, part, lines]) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={large
                ? { width: 410, height: 410, borderRadius: 14, overflow: "hidden", border: `3px solid ${T.rule}`, boxShadow: "0 10px 30px rgba(15,37,71,.15)" }
                : { width: 190, height: 190, borderRadius: "50%", overflow: "hidden", border: `4px solid ${T.rule}` }}>
                <Img src={staticFile(`speakers/${photo}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontFamily: display, fontWeight: 400, fontSize: large ? 46 : 40, marginTop: large ? 16 : 14, lineHeight: 1.1 }}>{name}</div>
              {!large && <div style={{ fontFamily: text, fontStyle: "italic", fontSize: SIZE.small, color: T.accent, marginTop: 4 }}>{part}</div>}
              <div style={{ fontFamily: text, fontSize: SIZE.small, lineHeight: 1.3, marginTop: 8 }}>
                {lines.map((l, i) => <div key={i} style={{ color: i < 2 ? T.ink : T.muted, fontSize: large ? 28 : undefined, whiteSpace: "nowrap" }}>{l}</div>)}
              </div>
            </div>
          ))}
        </div>

        {rule(24)}
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: SIZE.date, color: T.accent }}>Saturday, 21 November 2026</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, marginTop: 6 }}>10:00 AM – 3:00 PM</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, marginTop: 4 }}>Cariappa Auditorium, Pangode, Thiruvananthapuram</div>
        <div style={{ fontFamily: text, fontStyle: "italic", fontSize: SIZE.small, marginTop: 22 }}>Kindly confirm your participation with a brief reply.</div>
      </AbsoluteFill>

      {/* Footer strip: logo above the initiative line, centred */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: foot, background: T.foot, borderTop: `2px solid ${T.rule}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: large ? 120 : 74, height: large ? 120 : 74 }} />
        <div style={{ fontFamily: text, fontSize: large ? 30 : 24, color: large ? T.ink : T.muted, marginTop: 8 }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: large ? 52 : 38, marginTop: 2 }}>Sainik School Kazhakootam</div>
      </div>
    </AbsoluteFill>
  );
};

export const Speakers: React.FC = () => <Card theme="navy" />;
export const SpeakersCream: React.FC = () => <Card theme="cream" />;
export const SpeakersLargeCream: React.FC = () => <Card theme="cream" large />;
export const SpeakersChosenCream: React.FC = () => <Card theme="cream" large sample="chosen" />;
export const SpeakersInvitedCream: React.FC = () => <Card theme="cream" large sample="invited" />;
