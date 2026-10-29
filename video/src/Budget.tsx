import React from "react";
import { AbsoluteFill } from "remotion";
import { display, text } from "./GuidingLights";
import { THEMES } from "./Felicitation";

// Rough budget for the organising group's WhatsApp (2026-10-29). An image, because WhatsApp
// does not keep table formatting. Cream theme.

const T = THEMES.cream;

// [item, option A, option B, sub-row]
const ROWS: [string, string, string, boolean?][] = [
  ["Transport (guests)", "25,000", "25,000"],
  ["Mementos: principals @ ₹700", "21,000", "35,000"],
  ["Mementos: 6 guests @ ₹1,000", "6,000", "6,000"],
  ["Food @ ₹200 per head", "15,000", "20,000"],
  ["Stationery, stage décor, printing", "10,000", "10,000"],
];

const cell: React.CSSProperties = { padding: "18px 22px", fontSize: 34, borderBottom: `1px solid rgba(201,154,60,.45)` };
const num: React.CSSProperties = { ...cell, textAlign: "right", fontVariantNumeric: "tabular-nums lining-nums", whiteSpace: "nowrap" };

export const Budget: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg, color: T.ink, fontFamily: text, padding: "60px 50px", alignItems: "center" }}>
    <div style={{ fontFamily: display, fontSize: 72, lineHeight: 1 }}>Guiding Lights</div>
    <div style={{ fontSize: 36, color: T.accent, marginTop: 10 }}>Rough budget (₹)</div>
    <div style={{ width: 90, height: 2, background: T.rule, margin: "30px auto" }} />

    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ ...cell, textAlign: "left" }} />
          <th style={{ ...num, fontWeight: 700, color: T.accent }}>Option A</th>
          <th style={{ ...num, fontWeight: 700, color: T.accent }}>Option B</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ background: "rgba(201,154,60,.10)" }}>
          <td style={{ ...cell, fontWeight: 700 }}>Principals</td>
          <td style={{ ...num, fontWeight: 700 }}>30</td>
          <td style={{ ...num, fontWeight: 700 }}>50</td>
        </tr>
        <tr style={{ background: "rgba(201,154,60,.10)" }}>
          <td style={{ ...cell, fontWeight: 700 }}>Total attendees</td>
          <td style={{ ...num, fontWeight: 700 }}>75</td>
          <td style={{ ...num, fontWeight: 700 }}>100</td>
        </tr>
        {ROWS.map(([item, a, b]) => (
          <tr key={item}>
            <td style={cell}>{item}</td>
            <td style={num}>{a}</td>
            <td style={num}>{b}</td>
          </tr>
        ))}
        <tr>
          <td style={{ ...cell, fontFamily: display, fontSize: 44, borderBottom: `3px solid ${T.rule}` }}>Total</td>
          <td style={{ ...num, fontFamily: display, fontSize: 44, color: T.accent, borderBottom: `3px solid ${T.rule}` }}>77,000</td>
          <td style={{ ...num, fontFamily: display, fontSize: 44, color: T.accent, borderBottom: `3px solid ${T.rule}` }}>96,000</td>
        </tr>
      </tbody>
    </table>

    <div style={{ alignSelf: "stretch", marginTop: 40, fontSize: 32, lineHeight: 1.5, padding: "0 22px" }}>
      <div><b>Possible extras:</b> guest stay, photography / video, sound and projector, bouquets, certificates, 10% contingency.</div>
      <div style={{ marginTop: 22, fontFamily: display, fontSize: 44, color: T.accent }}>Realistic range: ₹1 – 1.3 lakh</div>
      <div style={{ marginTop: 14 }}>Anything above ₹1.3 lakh, we could look for sponsorship.</div>
    </div>
  </AbsoluteFill>
);
