"""Instagram highlight reel (vertical, about 1 min 45 s) cut from the "Voices from Guiding Lights" film,
plus one short reel per guest.

Usage (in video/, after build-speakers-film.py has filled public/film/):
  python tools/build-insta-reel.py <music.mp3>
Writes src/insta-reel.json and src/insta-guests.json (timelines and captions) and the music beds in public/film/.
Lines come from the film's own clips (public/film/<id>.mp4) and captions (src/speakers-film.json).
Highlight order (user, 24 Nov 2026): Capt Breeze's question, the title over NBN Sir's portrait, Kamal, the
panel, Amala, Col Gurung, Dr Ashok, a fast felicitation table, and Prof Jancy James to close.
Cut points sit in the silence between words (found from word timings and the quietest 30 ms in each gap),
so no syllable of the next sentence slips in.
"""
import json, os, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
MUSIC = sys.argv[1]
film = json.load(open(os.path.join(ROOT, "src", "speakers-film.json"), encoding="utf-8"))
clips = {os.path.basename(i["src"])[:-4]: i for i in film["items"] if i["kind"] == "clip"}
fel = next(i for i in film["items"] if i["kind"] == "fel")

# (kind, speaker id, [(start s, end s), ...] in that speaker's clip file)
PLAN = [
    ("clip", "breeze", [(3.26, 13.2)]),      # "Think: will somebody celebrate us ... long after we are gone?"
    ("title", None, 3.8),
    ("clip", "kamal", [(0.0, 13.2)]),        # whole moderator line, ends "in our lives too."
    ("clip", "vasuki", [(10.5, 18.5)]),      # "I think education should be focused on creating ... human beings."
    ("clip", "john", [(5.86, 15.4)]),        # "The silicon capacity ... made of carbon can teach you."
    ("clip", "abhilash", [(0.0, 7.95)]),     # ends "a capsule of inspiration."
    ("clip", "amala", [(0.0, 5.43)]),        # ends "carry the word mindset"
    ("clip", "gurung", [(0.0, 7.52)]),       # ends "Teachers light the way."
    ("clip", "ashok", [(0.0, 8.7)]),         # ends "just for the sake of it,"
    ("fel", None, 8.5),
    ("clip", "jancy", [(0.0, 3.47), (6.57, 19.5)]),  # "...discover the student." / "Teaching ... every child."
    ("close", None, 5.5),
]
FPS = 30
FEL_SPEED = 0.6  # felicitation cards land 1/0.6 times faster than in the film

items, t, speech, fin = [], 0.0, [], None
for kind, sid, spec in PLAN:
    if kind == "clip":
        c = clips[sid]
        parts, caps, o = [], [], 0.0
        for a, b in spec:
            for x in c["caps"]:
                if x["t1"] > a + 0.6 and x["t0"] < b - 0.5:
                    caps.append(dict(t0=round(max(x["t0"], a) - a + o, 2), t1=round(min(x["t1"], b) - a + o, 2), text=x["text"]))
            parts.append(dict(start=a, dur=round(b - a, 2), at=round(o, 2)))
            o += b - a
        dur = round(o, 2)
        for i in range(len(caps) - 1):  # each caption ends where the next begins
            caps[i]["t1"] = min(caps[i]["t1"], caps[i + 1]["t0"])
        role = c["role"].replace("Chief Guest · ", "")
        it = dict(kind=kind, from_=round(t * FPS), dur=dur, src=c["src"], parts=parts, name=c["name"], role=role,
                  alum=c.get("alum", False), caps=caps)
        speech.append((t, t + dur))
    else:
        dur = spec
        it = dict(kind=kind, from_=round(t * FPS), dur=dur)
    if kind == "fel":
        fin = t
        it.update(cards=[dict(x, at=round(x["at"] * FEL_SPEED, 3)) for x in fel["cards"]], count=fel["count"])
    items.append(it)
    t += dur
total = t
for it in items:
    it["from"] = it.pop("from_")
json.dump(dict(total=round(total * FPS), items=items), open(os.path.join(ROOT, "src", "insta-reel.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)

# ---------- Music bed: "Kaleidoscope of Life"; quiet opening under the speakers, the lift lands on the felicitation ----------
SR = 48000
raw = os.path.join(ROOT, "insta-music.raw")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", MUSIC, "-ac", "2", "-ar", str(SR), "-f", "f32le", raw], check=True)
m = np.fromfile(raw, dtype=np.float32).reshape(-1, 2)
os.remove(raw)
LIFT, LEAD = 43.03, 8.0
P0 = items[1]["from"] / FPS  # music starts with the title (the reel opens cold on the speaker)
n = int(total * SR)
XS = int(3.0 * SR)
ramp = np.linspace(0, 1, XS, dtype=np.float32)[:, None]


def xcat(x, y):
    return np.concatenate([x[:-XS], x[-XS:] * (1 - ramp) + y[:XS] * ramp, y[XS:]])


fin_start = int((fin - LEAD - P0) * SR)
loop = m[: int(42.0 * SR)] * 2.0
body = loop
while len(body) < fin_start + XS:
    body = xcat(body, loop)
bed = xcat(body[: fin_start + XS], m[int((LIFT - LEAD) * SR):])
bed = np.concatenate([np.zeros((int(P0 * SR), 2), np.float32), bed])
bed = np.concatenate([bed, np.zeros((max(0, n - len(bed)), 2), np.float32)])[:n]
tt = np.arange(n) / SR
gain = np.ones(n, np.float32)
DUCK, R = 10 ** (-20 / 20), 0.6
for a, b in speech:
    g = np.interp(tt, [a - R * 0.5, a + R * 0.5, b - R * 0.5, b + R * 0.5], [1, DUCK, DUCK, 1], left=1, right=1)
    gain = np.minimum(gain, g)
gain *= np.clip((tt - P0) / 0.8, 0, 1) * np.clip((total - tt) / 3.0, 0, 1)
bed *= gain[:, None] * 0.55
pcm = (np.clip(bed, -1, 1) * 32767).astype(np.int16)
with wave.open(os.path.join(ROOT, "public", "film", "insta-music.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"total {total:.1f} s ({round(total * FPS)} frames); felicitation at {fin:.1f} s")

# ---------- Guest reels: each speaker's whole clip from the film, then the OBA close ----------
# Numbered in the standard guest order, then the moderator and the President.
GUESTS = ["ashok", "vasuki", "amala", "jancy", "john", "abhilash", "gurung", "kamal", "breeze"]
CLOSE = 5.0
guests = {}
for k, sid in enumerate(GUESTS, 1):
    c = clips[sid]
    dur = c["dur"]
    role = c["role"].replace("Chief Guest \u00b7 ", "Chief Guest\n")
    gi = [dict(kind="clip", **{"from": 0}, dur=dur, src=c["src"], parts=[dict(start=0, dur=dur, at=0)], name=c["name"], role=role,
               alum=c.get("alum", False), caps=c["caps"]),
          dict(kind="close", **{"from": round(dur * FPS)}, dur=CLOSE)]
    gt = dur + CLOSE
    guests[sid] = dict(num=k, total=round(gt * FPS), items=gi)
    # music: the quiet piano opening, low under the speech, up for the close
    gn = int(gt * SR)
    gb = m[:gn] * 2.0
    gb = np.concatenate([gb, np.zeros((max(0, gn - len(gb)), 2), np.float32)])[:gn]
    gtt = np.arange(gn) / SR
    gg = np.interp(gtt, [0, dur - 0.3, dur + 0.5], [DUCK, DUCK, 1]) * np.clip(gtt / 0.8, 0, 1) * np.clip((gt - gtt) / 2.5, 0, 1)
    gb *= gg[:, None].astype(np.float32) * 0.55
    with wave.open(os.path.join(ROOT, "public", "film", f"insta-music-{sid}.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(gb, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump(guests, open(os.path.join(ROOT, "src", "insta-guests.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("guest reels:", ", ".join(f"{g['num']:02d} {s} {g['total'] / FPS:.1f} s" for s, g in guests.items()))
