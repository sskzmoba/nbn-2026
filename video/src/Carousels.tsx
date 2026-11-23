import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { display, text, C } from "./GuidingLights";
import honourees from "./carousel-honourees.json";

// Instagram / LinkedIn carousels (1080x1350, 4:5), 24 Nov 2026. One composition per deck; each frame is one
// slide, rendered with `remotion still --frame=<n>`. Decks: honoured (32 educators), panel (quote cards),
// thanks (gratitude). Navy, gold and cream with Libre Caslon, as on the site and films.

type H = { num: string; name: string; title: string; school: string; src: string };
const HON = honourees as H[];

const Page: React.FC<{ children: React.ReactNode; n: number; of: number; bg?: string; dim?: number }> = ({ children, n, of, bg, dim = 0.82 }) => (
  <AbsoluteFill style={{ background: C.night, color: C.cream }}>
    {bg && <Img src={staticFile(bg)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />}
    <AbsoluteFill style={{ background: bg ? `linear-gradient(180deg, rgba(5,7,13,${dim - 0.25}) 0%, rgba(11,24,48,${dim}) 55%, rgba(5,7,13,.97) 100%)` : `radial-gradient(ellipse 90% 70% at 50% 40%, #13284a 0%, ${C.navy} 50%, ${C.night} 100%)` }} />
    <div style={{ position: "absolute", top: 54, left: 0, right: 0, textAlign: "center", fontFamily: text, fontWeight: 700, fontSize: 22, letterSpacing: 8, color: C.gold }}>GUIDING LIGHTS 2026</div>
    <AbsoluteFill>{children}</AbsoluteFill>
    <div style={{ position: "absolute", bottom: 40, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: text, fontSize: 22, color: C.muted }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Img src={staticFile("oba-logo.png")} style={{ width: 44, height: 44 }} />
        <span>SSKZM OBA · @sskzmoba</span>
      </div>
      <span>{n} / {of}</span>
    </div>
  </AbsoluteFill>
);

const Center: React.FC<{ children: React.ReactNode; pad?: number }> = ({ children, pad = 0 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 90px", paddingTop: pad }}>{children}</AbsoluteFill>
);
const Rule = () => <div style={{ width: 120, height: 2, background: C.goldDeep, margin: "34px auto" }} />;

// ---------- Deck 1: 32 educators honoured ----------
const PER = 4;
export const HONOURED_SLIDES = 2 + Math.ceil(HON.length / PER);
export const Honoured: React.FC = () => {
  const i = useCurrentFrame();
  const of = HONOURED_SLIDES;
  if (i === 0)
    return (
      <Page n={1} of={of} bg="film/ph/6795.jpg" dim={0.78}>
        <Center pad={330}>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: C.gold }}>FELICITATION</div>
          <div style={{ fontFamily: display, fontSize: 200, lineHeight: 1, color: C.gold, marginTop: 20 }}>{HON.length}</div>
          <div style={{ fontFamily: display, fontSize: 78, lineHeight: 1.1, marginTop: 6 }}>educators honoured</div>
          <Rule />
          <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 36, color: C.cream }}>Educators who shape generations</div>
          <div style={{ fontFamily: text, fontSize: 28, color: C.muted, marginTop: 18 }}>21 November 2026 · Cariappa Auditorium, Pangode</div>
          <div style={{ fontFamily: text, fontSize: 26, color: C.gold, marginTop: 40 }}>Swipe to see them all ›</div>
        </Center>
      </Page>
    );
  if (i === of - 1)
    return (
      <Page n={of} of={of}>
        <Center>
          <div style={{ fontFamily: display, fontSize: 92, color: C.gold }}>Thank you</div>
          <div style={{ fontFamily: text, fontSize: 38, lineHeight: 1.45, marginTop: 30 }}>for your leadership, dedication<br />and contribution to education.</div>
          <Rule />
          <div style={{ display: "flex", alignItems: "center", gap: 26, justifyContent: "center" }}>
            <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(255,211,138,.8)" }}>
              <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: text, fontSize: 28, color: C.muted }}>In remembrance of</div>
              <div style={{ fontFamily: display, fontSize: 56, color: C.gold }}>NBN Sir</div>
            </div>
          </div>
          <div style={{ fontFamily: text, fontSize: 30, color: C.muted, marginTop: 44 }}>An initiative by alumni of Sainik School Kazhakootam</div>
          <div style={{ fontFamily: text, fontStyle: "italic", fontSize: 28, color: C.gold, marginTop: 12 }}>Supported by the 1991 Batch</div>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 34, color: C.gold, marginTop: 30 }}>nbn.sskzmoba.org</div>
        </Center>
      </Page>
    );
  const group = HON.slice((i - 1) * PER, i * PER);
  return (
    <Page n={i + 1} of={of}>
      <div style={{ position: "absolute", top: 120, left: 50, right: 50, bottom: 110, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 30 }}>
        {group.map((h) => (
          <div key={h.num} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: "100%", aspectRatio: "3 / 2", overflow: "hidden", borderRadius: 8, border: "3px solid rgba(255,211,138,.75)", boxShadow: "0 12px 34px rgba(0,0,0,.5)" }}>
              <Img src={staticFile(h.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ fontFamily: display, fontSize: 36, lineHeight: 1.1, marginTop: 18 }}>{h.name}</div>
            <div style={{ fontFamily: text, fontSize: 22, color: C.gold, marginTop: 6 }}>{h.title}</div>
            <div style={{ fontFamily: text, fontSize: 22, color: C.muted, marginTop: 4, lineHeight: 1.3 }}>{h.school}</div>
          </div>
        ))}
      </div>
    </Page>
  );
};

// ---------- Deck 2: the panel, in quotes ----------
const PANEL = [
  { id: "kamal", name: "Kamal Krishnan PS", role: "Moderator · Alumnus, Sainik School Kazhakootam", q: "Precisely these were the questions that NBN Sir taught us to ask, not just in class, in our lives too." },
  { id: "vasuki", name: "Dr K Vasuki IAS", role: "Secretary to the Governor of Keralam", q: "Answers are everywhere, facts are everywhere, but wisdom is what is missing in today's world." },
  { id: "jancy", name: "Prof Dr Jancy James", role: "Founder Vice Chancellor, Central University of Kerala", q: "Teaching or learning is not filling up a bucket with information or knowledge. It's the kindling of a fire." },
  { id: "john", name: "Dr TR John", role: "Chief of Medical Services, Aster Medcity · Alumnus, Sainik School Kazhakootam", q: "The silicon capacity is what the AI can give you or assist you, and the carbon skills only a teacher can." },
  { id: "abhilash", name: "Shri R Abhilash", role: "Innovator; founder, Bloom and Fest", q: "For me, education … is not about a truckload of information. It is about a capsule of inspiration." },
];
export const PANEL_SLIDES = PANEL.length + 2;
export const Panel: React.FC = () => {
  const i = useCurrentFrame();
  const of = PANEL_SLIDES;
  if (i === 0)
    return (
      <Page n={1} of={of} bg="film/ph/6245.jpg" dim={0.86}>
        <Center pad={300}>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: C.gold }}>PANEL DISCUSSION</div>
          <Rule />
          <div style={{ fontFamily: display, fontSize: 84, lineHeight: 1.1 }}>When answers are everywhere, what should schools teach?</div>
          <div style={{ fontFamily: text, fontSize: 26, color: C.gold, marginTop: 50 }}>Swipe for the key lines ›</div>
        </Center>
      </Page>
    );
  if (i === of - 1)
    return (
      <Page n={of} of={of}>
        <Center>
          <div style={{ fontFamily: display, fontSize: 80, color: C.gold }}>Watch the full film</div>
          <div style={{ fontFamily: text, fontSize: 36, lineHeight: 1.45, marginTop: 30 }}>"Voices from the Day"<br />on YouTube: link in bio</div>
          <Rule />
          <div style={{ fontFamily: text, fontSize: 30, color: C.muted }}>An initiative by alumni of Sainik School Kazhakootam</div>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 34, color: C.gold, marginTop: 30 }}>nbn.sskzmoba.org</div>
        </Center>
      </Page>
    );
  const p = PANEL[i - 1];
  return (
    <Page n={i + 1} of={of}>
      <div style={{ position: "absolute", top: 120, left: 0, width: 1080, height: 520, overflow: "hidden", borderTop: "2px solid rgba(255,211,138,.55)", borderBottom: "2px solid rgba(255,211,138,.55)" }}>
        <Img src={staticFile(`film/q/${p.id}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", top: 690, left: 80, right: 80, textAlign: "center" }}>
        <div style={{ fontFamily: display, fontSize: 110, lineHeight: 0.6, color: C.goldDeep }}>“</div>
        <div style={{ fontFamily: display, fontSize: p.q.length > 110 ? 44 : 52, lineHeight: 1.3 }}>{p.q}</div>
        <div style={{ fontFamily: display, fontSize: 40, color: C.gold, marginTop: 34 }}>{p.name}</div>
        <div style={{ fontFamily: text, fontSize: 24, color: C.muted, marginTop: 6 }}>{p.role}</div>
      </div>
    </Page>
  );
};

// ---------- Deck 3: thank you ----------
const GUESTS = ["Dr B Ashok IAS", "Dr K Vasuki IAS", "Smt Amala Akkineni", "Prof Dr Jancy James", "Dr TR John", "Shri R Abhilash", "Col Sidharth Karanbir Gurung", "Col Abhishek Vohra", "Kamal Krishnan PS"];
const COMMITTEE = ["Capt(IN) KM Breeze Antony", "Sqn Ldr Pradeep Kumar (Retd)", "Col Pramod M", "Lt Col Arun Sathyan", "Manu G", "Vinod V"];
export const THANKS_SLIDES = 5;
export const Thanks: React.FC = () => {
  const i = useCurrentFrame();
  const of = THANKS_SLIDES;
  const list = (xs: string[], size = 40) => xs.map((x) => <div key={x} style={{ fontFamily: text, fontSize: size, lineHeight: 1.55 }}>{x}</div>);
  if (i === 0)
    return (
      <Page n={1} of={of} bg="film/ph/6807.jpg" dim={0.72}>
        <Center pad={420}>
          <div style={{ fontFamily: display, fontSize: 120, color: C.gold }}>With gratitude</div>
          <div style={{ fontFamily: text, fontSize: 34, marginTop: 20 }}>Guiding Lights was made possible by many hands.</div>
        </Center>
      </Page>
    );
  if (i === 1)
    return (
      <Page n={2} of={of}>
        <Center>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: C.gold }}>OUR GUESTS</div>
          <Rule />
          {list(GUESTS)}
        </Center>
      </Page>
    );
  if (i === 2)
    return (
      <Page n={3} of={of}>
        <Center>
          <div style={{ fontFamily: text, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: C.gold }}>ORGANISING COMMITTEE</div>
          <Rule />
          {list(COMMITTEE, 42)}
          <div style={{ fontFamily: display, fontSize: 56, color: C.gold, marginTop: 70 }}>Supported by the 1991 Batch</div>
        </Center>
      </Page>
    );
  if (i === 3)
    return (
      <Page n={4} of={of} bg="film/ph/5323.jpg" dim={0.8}>
        <Center pad={360}>
          <div style={{ fontFamily: text, fontSize: 40, lineHeight: 1.5 }}>To the Principal, officers, teachers and staff of Sainik School Kazhakootam, and to every alumnus and friend who joined us, in the auditorium and online:</div>
          <div style={{ fontFamily: display, fontSize: 96, color: C.gold, marginTop: 30 }}>thank you.</div>
        </Center>
      </Page>
    );
  return (
    <Page n={5} of={of}>
      <Center>
        <div style={{ width: 230, height: 230, borderRadius: "50%", overflow: "hidden", border: "4px solid rgba(255,211,138,.8)", margin: "0 auto" }}>
          <Img src={staticFile("nbn-sir.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "grayscale(1)" }} />
        </div>
        <div style={{ fontFamily: text, fontSize: 32, color: C.muted, marginTop: 30 }}>In remembrance of</div>
        <div style={{ fontFamily: display, fontSize: 80, color: C.gold }}>NBN Sir</div>
        <Rule />
        <div style={{ fontFamily: text, fontSize: 30, color: C.muted }}>An initiative by alumni of Sainik School Kazhakootam</div>
        <div style={{ fontFamily: text, fontWeight: 700, fontSize: 34, color: C.gold, marginTop: 30 }}>nbn.sskzmoba.org</div>
      </Center>
    </Page>
  );
};
