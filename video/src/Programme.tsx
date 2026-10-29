import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { display, text } from "./GuidingLights";
import { THEMES } from "./Felicitation";

// Programme chart for guests and speakers (2:3, same look as the felicitation card).
// No speaker names until each one has confirmed. Navy for WhatsApp, cream for the PDF / print.

const SIZE = { title: 104, date: 54, body: 32, small: 27 };

// [time, session, details]
const ROWS: [string, string, string[]][] = [
  ["10:00 AM", "Arrival, registration and tea", []],
  ["10:30 AM", "Inaugural session", ["Welcome and tribute to N. B. N. Sir", "Special Address: Inspiring the Next Generation to Serve"]],
  ["11:00 AM", "Fireside chat", ["The Teachers and Experiences That Shape Us"]],
  ["11:30 AM", "Panel discussion", ["When Answers Are Everywhere, What Should Schools Teach?"]],
  ["12:30 PM", "Keynote address", ["Leading Schools That Shape Generations"]],
  ["1:00 PM", "Felicitation of educators", []],
  ["1:45 PM", "Vote of thanks and group photograph", []],
  ["2:00 PM", "Lunch and networking", []],
];

const FOOT = 176;

const Card: React.FC<{ theme: keyof typeof THEMES }> = ({ theme }) => {
  const T = THEMES[theme];
  const rule = (my: number) => <div style={{ width: 90, height: 2, background: T.rule, margin: `${my}px auto` }} />;
  return (
    <AbsoluteFill style={{ background: T.bg, color: T.ink, textAlign: "center" }}>
      {/* Warm light behind the portrait */}
      <div style={{ position: "absolute", width: 1100, height: 1100, left: -10, top: -400, borderRadius: "50%", background: `radial-gradient(circle, ${T.glow} 0%, transparent 55%)` }} />

      <AbsoluteFill style={{ alignItems: "center", padding: "44px 50px 0" }}>
        <div style={{ width: 140, height: 140, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(201,154,60,.85)", boxShadow: `0 0 60px ${T.glow}` }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: SIZE.small, letterSpacing: 1.5, marginTop: 14 }}>In remembrance of N. B. N. Sir</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: SIZE.title, lineHeight: 1, marginTop: 16, filter: T.titleShadow }}>Guiding Lights</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, color: T.accent, marginTop: 12 }}>Celebrating Educators Who Shape Generations</div>

        <div style={{ fontFamily: display, fontWeight: 400, fontSize: SIZE.date, color: T.accent, marginTop: 28 }}>Saturday, 21 November 2026</div>
        <div style={{ fontFamily: text, fontSize: SIZE.body, marginTop: 4 }}>Cariappa Auditorium, Pangode, Thiruvananthapuram</div>

        {rule(32)}
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: SIZE.small, letterSpacing: 6, color: T.muted, marginBottom: 28 }}>PROGRAMME</div>

        {/* Time | session, left-aligned so the times line up */}
        <div style={{ display: "grid", gridTemplateColumns: "170px auto", columnGap: 26, rowGap: 26, textAlign: "left", width: "fit-content", margin: "0 auto" }}>
          {ROWS.map(([time, session, details]) => (
            <React.Fragment key={time}>
              <div style={{ fontFamily: text, fontSize: SIZE.body, color: T.accent, textAlign: "right", lineHeight: 1.3 }}>{time}</div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontFamily: text, fontSize: SIZE.body }}>{session}</div>
                {details.map((d) => <div key={d} style={{ fontFamily: text, fontStyle: "italic", fontSize: SIZE.small, color: T.muted, marginTop: 2 }}>{d}</div>)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>

      {/* Footer strip: logo above the initiative line, centred */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: FOOT, background: T.foot, borderTop: `2px solid ${T.rule}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: 78, height: 78 }} />
        <div style={{ fontFamily: text, fontSize: 24, color: T.muted, marginTop: 6 }}>An initiative by alumni of</div>
        <div style={{ fontFamily: display, fontWeight: 400, fontSize: 38, marginTop: 2 }}>Sainik School Kazhakootam</div>
      </div>
    </AbsoluteFill>
  );
};

export const Programme: React.FC = () => <Card theme="navy" />;
export const ProgrammeCream: React.FC = () => <Card theme="cream" />;
