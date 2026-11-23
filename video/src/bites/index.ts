import { BiteProps } from "../SpeakerBite";
import breeze from "./breeze.json";
import pramodArun from "./pramod-arun.json";
import gurung from "./gurung.json";
import vasuki from "./vasuki.json";
import kamal from "./kamal.json";
import jancy from "./jancy.json";
import john from "./john.json";
import abhilash from "./abhilash.json";
import ashok from "./ashok.json";
import amala from "./amala.json";

// One entry per speaker bite (composition id = "Bite-" + key). Captions and clip lists come from reel/prep_bite.py.
export const BITES: Record<string, BiteProps> = {
  breeze: {
    data: breeze, video: "breeze/cut.mp4",
    heading: "The OBA President on NBN Sir", title: "The OBA President\non NBN Sir",
    name: "Capt(IN) KM Breeze Antony", role: "President, SSKZM OBA, and a student of NBN Sir",
    cutaway: { src: "nbn-sir.jpg", until: 3.9 },
  },
  "pramod-arun": {
    data: pramodArun, video: "breeze/pramod-arun.mp4",
    heading: "The welcome and the thanks", title: "The welcome\nand the thanks",
    name: "Col Pramod M · Lt Col Arun Sathyan", role: "Master of Ceremonies · Vice President, SSKZM OBA",
    people: [
      { clip: 0, name: "Col Pramod M", role: "Master of Ceremonies, alumnus" },
      { clip: 2, name: "Lt Col Arun Sathyan", role: "Vice President, SSKZM OBA" },
    ],
  },
  gurung: {
    data: gurung, video: "breeze/gurung.mp4",
    heading: "Inspiring the next generation to serve", title: "Inspiring the next\ngeneration to serve",
    name: "Col Sidharth Karanbir Gurung", role: "Deputy Commander, 91 Infantry Brigade",
  },
  vasuki: {
    data: vasuki, video: "breeze/vasuki.mp4",
    heading: "Knowledge and wisdom", title: "Knowledge\nand wisdom",
    name: "Dr K Vasuki IAS", role: "Secretary to the Governor of Keralam",
  },
  kamal: {
    data: kamal, video: "breeze/kamal.mp4",
    heading: "When answers are everywhere", title: "When answers\nare everywhere",
    name: "Kamal Krishnan PS", role: "Moderator, and an alumnus of the 1991 batch",
  },
  jancy: {
    data: jancy, video: "breeze/jancy.mp4",
    heading: "Discover the student", title: "Discover\nthe student",
    name: "Prof Dr Jancy James", role: "Founder Vice Chancellor, Central University of Kerala",
  },
  john: {
    data: john, video: "breeze/john.mp4",
    heading: "Silicon skills, carbon capacity", title: "Silicon skills,\ncarbon capacity",
    name: "Dr TR John", role: "Chief of Medical Services, Aster Medcity, Kochi",
  },
  abhilash: {
    data: abhilash, video: "breeze/abhilash.mp4",
    heading: "A capsule of inspiration", title: "A capsule\nof inspiration",
    name: "R Abhilash", role: "Innovator and entrepreneur",
  },
  ashok: {
    data: ashok, video: "breeze/ashok.mp4",
    heading: "Knowledge and consciousness", title: "Knowledge and\nconsciousness",
    name: "Dr B Ashok IAS", role: "Principal Secretary, Higher Education, Government of Keralam",
  },
  amala: {
    data: amala, video: "breeze/amala.mp4",
    heading: "Carry the word mindset", title: "Carry the word\nmindset",
    name: "Amala Akkineni", role: "Director, Annapurna College of Film and Media",
  },
};
