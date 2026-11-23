"""Build the media and timeline for the "Voices from Guiding Lights" film (src/SpeakersFilm.tsx).

Usage (from video/):
  python tools/build-speakers-film.py <clips-dir> <music.mp3> <photos-dir> <felicitation-dir>

<clips-dir> holds the raw segments downloaded from the event recording with yt-dlp
(https://www.youtube.com/live/3oP4N9b-r1Q), one per name below, e.g. breeze.mp4 = 1:06:46-1:07:03.
Cut points are in seconds within each raw segment (checked with speech recognition and a loudness envelope).
<photos-dir> holds the event photos named below (from the album; felicitation photos f*.jpg have the
names on the screen blurred). <felicitation-dir> is the album's "05 Felicitation" folder: one folder per
honouree ("NN Title Name ..."), from which the collage cards and the credits list are made.
Writes public/film/<speaker>.mp4, public/film/ph/*.jpg, public/film/fel/*.jpg, public/film/music.wav and
src/speakers-film.json. (v3, 23 Nov 2026: chant removed, Kamal added, Col Gurung before the keynote,
felicitation collage of all honourees, scrolling end credits.)
Needs ffmpeg (full build) on PATH, and numpy.
"""
import json, os, subprocess, sys, wave
import numpy as np

FPS = 30
CLIPS_DIR, MUSIC, PHOTOS, FEL = sys.argv[1:5]
OUT = "public/film"
os.makedirs(OUT + "/ph", exist_ok=True)

# Raw segments (yt-dlp --download-sections "*<range>" --force-keyframes-at-cuts):
# breeze 1:06:46-1:07:03, gurung 1:13:15-1:13:55, vasukiA 1:23:33-1:23:51, vasukiB 1:28:59-1:29:13,
# jancyA 1:35:26-1:35:48, jancyB 2:10:38-2:10:58, john 1:42:32-1:42:53, abhilash 2:16:03-2:16:30,
# amalaA 2:45:29-2:45:45, amalaB 3:14:41-3:15:08, ashokA 3:26:47-3:27:15, kamal 1:20:22-1:21:14, kamalB 1:21:08-1:21:32
# Photo interludes: (photo or [three photos side by side], seconds, optional (label, title) shown from that photo on)
ARRIVAL = [("5323", 3.6, ("21 November 2026", "Welcome to Guiding Lights")), (["5351", "5371"], 3.6, None)]
SPEAKERS = [
    dict(inter=ARRIVAL),
    dict(id="breeze", name="Capt(IN) KM Breeze Antony", role="President, SSKZM OBA",
         pieces=[("breeze", 3.2, 15.6, [(3.3, "I leave you with this thought."), (6.3, "Think: will somebody celebrate us"),
                                          (10.4, "as educators and teachers"), (12.3, "long after we are gone?")])]),
    dict(inter=[("6245", 4.0, ("Panel Discussion", "When Answers Are Everywhere, What Should Schools Teach?")),
                (["6020", "6072", "6109", "6159"], 3.6, None)]),
    dict(id="kamal", name="Kamal Krishnan PS", role="Moderator, Panel Discussion", alum=True,
         pieces=[("kamal", 33.4, 38.85, [(33.4, "Imagine if a student gets up and asks:"),
                                          (36.95, "do we know what we are actually throwing away?")]),
                 ("kamalB", 6.45, 13.65, [(6.45, "Precisely these were the questions"), (8.6, "that NBN Sir taught us to ask,"),
                                          (11.95, "not just in class, in our lives too.")])]),
    dict(id="vasuki", name="Dr K Vasuki IAS", role="Secretary to the Governor of Keralam",
         pieces=[("vasukiA", 5.35, 15.55, [(5.4, "And there is a very subtle difference"), (7.6, "between facts and truth,"),
                                            (11.0, "and there's a very subtle difference"), (12.6, "between knowledge and wisdom.")]),
                 ("vasukiB", 3.55, 11.25, [(3.6, "I think education should be focused on creating"),
                                           (7.2, "happy, compassionate, loving, peaceful human beings.")])]),
    dict(id="jancy", name="Prof Dr Jancy James", role="Founder Vice Chancellor, Central University of Kerala",
         pieces=[("jancyA", 7.45, 13.7, [(7.5, "Don't teach a student, but discover the student."),
                                          (11.5, "Discover those beautiful minds before you.")]),
                 ("jancyB", 3.85, 16.5, [(3.9, "Teaching or learning is not filling up a bucket"), (7.6, "with information or knowledge."),
                                         (9.7, "It's the kindling of a fire."), (12.2, "It's the lighting up of a fire"),
                                         (14.3, "in the personality of every child.")])]),
    dict(id="john", name="Dr TR John", role="Chief of Medical Services, Aster Medcity, Kochi", alum=True,
         pieces=[("john", 3.05, 17.65, [(3.1, "Nowadays when I talk, I talk about"), (4.85, "the silicon skills and the carbon capacity."),
                                         (8.7, "The silicon capacity is what the AI can give you, or assist you,"),
                                         (13.0, "and the carbon skills only a teacher can."),
                                         (15.4, "Someone who is made of carbon can teach you.")])]),
    dict(id="abhilash", name="Shri R Abhilash", role="Innovator; founder, Bloom and Fest",
         pieces=[("abhilash", 3.55, 6.25, [(3.55, "For me, education")]),
                 ("abhilash", 12.05, 25.4, [(12.1, "is not about a truckload of information."), (15.2, "It is about a capsule of inspiration."),
                                             (17.2, "Can we be that inspiration to our children"),
                                             (20.1, "and make them feel this space belongs to you"), (22.5, "and belongs to us?"),
                                             (23.7, "And that's very important.")])]),
    dict(inter=[("6536", 3.6, ("Fireside Chat", "The Teachers and Experiences That Shape Us")), ("6499", 2.8, None)]),
    dict(id="amala", name="Smt Amala Akkineni", role="Director, Annapurna College of Film and Media",
         pieces=[("amalaB", 4.6, 9.95, [(4.7, "If you are going back with a gift from me,"), (8.5, "carry the word mindset.")]),
                 ("amalaB", 14.25, 25.45, [(14.3, "…see how your assessments can open up to new ways"),
                                            (20.0, "where the child then becomes a learner for life.")])]),
    dict(inter=[("6597", 4.2, ("Special Address", "Inspiring the Next Generation to Serve"))]),
    dict(id="gurung", name="Col Sidharth Karanbir Gurung", role="Deputy Commander, 91 Infantry Brigade",
         pieces=[("gurung", 4.6, 9.65, [(4.6, "To guide young minds, you are often"), (7.2, "the first to notice a spark in a child.")]),
                 ("gurung", 29.55, 38.05, [(29.8, "Teachers light the way."), (32.6, "I ask you to keep lighting it,"),
                                           (34.5, "and now and then to point it towards the defence forces.")])]),
    dict(inter=[("6652", 3.4, ("Keynote", "Leading Schools That Shape Generations")), ("6616", 3.0, None)]),
    dict(id="ashok", name="Dr B Ashok IAS", role="Chief Guest · Principal Secretary, Higher Education, Government of Keralam",
         pieces=[("ashokA", 3.08, 22.65, [(3.1, "Learning is inherently a very pleasurable thing."),
                                           (7.3, "There is a lot of pleasure involved in knowing new things"),
                                           (10.1, "just for the sake of it,"), (11.7, "for exploring a thing, researching a thing,"),
                                           (15.1, "delving deep into the facts…"), (20.4, "and then discovering things afresh.")])]),
]
# After the collage of all honourees: the group photo, then the school family.
FELICITATION = [
    ("6795", 6.5, ("Guiding Lights 2026", "The honourees with our guests")),
    ("6807", 5.0, ("With the school family", "Alumni, teachers and staff of Sainik School Kazhakootam")),
]

HEAD, TAIL, XF = 0.35, 0.5, 0.25  # room before/after each speaker, crossfade between pieces
OPEN, CREDITS, CLOSE = 11.8, 31.0, 10.0
PXF = 0.7  # crossfade between photos
PIANO_AT = 0.0  # piano from the first frame (the chant opening was dropped in v3)
# Collage: cards are laid one by one, slowly at first, then faster and faster; then the full board holds.
COL_LEAD, COL_FIRST, COL_LAST, COL_HOLD = 1.4, 0.6, 0.07, 3.0
FEL_PICK = {}  # folder number -> photo index, where the first photo of a folder is not the best one
TITLES = ("Mr ", "Ms ", "Mrs ", "Shri ", "Smt ")  # dropped in the credits (user, 23 Nov); Dr, Fr, Capt(IN) kept
# Honourees from the Sainik School Kazhakootam family, listed in their own group in the credits (user, 23 Nov):
# 26 former Principal; 27-31 former teachers, later heads of other institutions; 32 former teacher.
FAMILY = {"26": "principal", "27": "later", "28": "later", "29": "later", "30": "later", "31": "later", "32": "teacher"}


def run(args):
    subprocess.run(args, check=True)


def build_speaker(sp):
    """Trim pieces, join with short crossfades, normalise loudness. Returns (file, duration, captions)."""
    parts, caps, t = [], [], 0.0
    n = len(sp["pieces"])
    for i, (src, a, b, lines) in enumerate(sp["pieces"]):
        a2 = a - (HEAD if i == 0 else 0)
        b2 = b + (TAIL if i == n - 1 else 0)
        offset = t - a2  # piece-local source time -> clip time
        for j, (st, txt) in enumerate(lines):
            end = lines[j + 1][0] if j + 1 < len(lines) else b
            caps.append(dict(t0=round(st + offset, 2), t1=round(end + offset + (0.35 if j + 1 == len(lines) else 0), 2), text=txt))
        parts.append((src, a2, b2))
        t += (b2 - a2) - (XF if i < n - 1 else 0)
    # ffmpeg filter graph
    inputs, fc = [], []
    for k, (src, a2, b2) in enumerate(parts):
        inputs += ["-ss", f"{a2:.3f}", "-t", f"{b2 - a2:.3f}", "-i", os.path.join(CLIPS_DIR, src + ".mp4")]
        fc.append(f"[{k}:v]fps={FPS},scale=1920:1080,setsar=1,format=yuv420p,setpts=PTS-STARTPTS[v{k}]")
        fc.append(f"[{k}:a]aresample=48000,asetpts=PTS-STARTPTS[a{k}]")
    v, a, acc = "v0", "a0", parts[0][2] - parts[0][1]
    for k in range(1, len(parts)):
        fc.append(f"[{v}][v{k}]xfade=transition=fade:duration={XF}:offset={acc - XF:.3f}[vx{k}]")
        fc.append(f"[{a}][a{k}]acrossfade=d={XF}[ax{k}]")
        v, a = f"vx{k}", f"ax{k}"
        acc += (parts[k][2] - parts[k][1]) - XF
    fc.append(f"[{a}]loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.15,afade=t=out:st={acc - 0.3:.3f}:d=0.3,aresample=48000[aout]")
    out = os.path.join(OUT, sp["id"] + ".mp4")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", f"[{v}]", "-map", "[aout]",
         "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-t", f"{acc:.3f}", out])
    return "film/" + sp["id"] + ".mp4", round(acc, 3), caps


def photo_file(name):
    """Copy one event photo, sized for 1920 x 1080 (landscape 2400 wide, portrait 1500 high)."""
    out = os.path.join(OUT, "ph", name + ".jpg")
    if not os.path.exists(out):
        run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(PHOTOS, name + ".jpg"), "-vf",
             "scale='if(gt(iw,ih),2400,-2)':'if(gt(iw,ih),-2,1500)'", "-q:v", "3", out])
    return "film/ph/" + name + ".jpg"


def image_size(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                          "-of", "csv=p=0", path], check=True, capture_output=True, text=True).stdout.strip()
    w, h = out.split(",")[:2]
    return int(w), int(h)


def honourees():
    """One card per honouree folder (NN Title Name ...): the photo, trimmed of the dark edges, 720 px wide,
    and the name for the credits (Mr / Ms / Shri dropped; notes in brackets dropped, (Retd) kept)."""
    import re
    os.makedirs(os.path.join(OUT, "fel"), exist_ok=True)
    cards, names = [], []
    for d in sorted(os.listdir(FEL)):
        if not re.match(r"\d\d ", d) or d.startswith("00"):
            continue
        num = d[:2]
        name = re.sub(r"\s+\((?!Retd)[^)]*\)", "", d[3:]).strip()
        for tt in TITLES:
            if name.startswith(tt):
                name = name[len(tt):]
        names.append((num, name))
        fs = sorted(f for f in os.listdir(os.path.join(FEL, d)) if f.lower().endswith((".jpg", ".jpeg")))
        src = os.path.join(FEL, d, fs[FEL_PICK.get(num, 0)])
        out = os.path.join(OUT, "fel", num + ".jpg")
        if not os.path.exists(out):
            run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", "crop=iw*0.94:ih*0.94:iw*0.03:ih*0.05,scale=720:-2",
                 "-q:v", "3", out])
        cards.append("film/fel/" + num + ".jpg")
    return cards, names


def collage(t0):
    """The felicitation collage: all honourees' photos laid as cards, slow then fast (geometric spacing)."""
    cards, names = honourees()
    n = len(cards)
    r = (COL_LAST / COL_FIRST) ** (1 / max(1, n - 2))
    at, t, out = [], COL_LEAD, []
    for i in range(n):
        at.append(round(t, 3))
        t += COL_FIRST * r ** i
    rng = np.random.default_rng(21)
    for i, c in enumerate(cards):
        out.append(dict(src=c, at=at[i], rot=round(float(rng.uniform(-3.2, 3.2)), 2)))
    dur = round(at[-1] + COL_HOLD, 2)
    return dict(kind="fel", from_=t0, dur=dur, cards=out, count=n), dur, names


def interlude(spec, t0):
    """A run of photos with crossfades; returns (item, duration). Text spans run from a photo with text to the next one."""
    photos, texts, t = [], [], 0.0
    for k, (ph, d, txt) in enumerate(spec):
        names = ph if isinstance(ph, list) else [ph]
        srcs = [photo_file(x) for x in names]
        land = all(w > h for w, h in (image_size(os.path.join(PHOTOS, x + ".jpg")) for x in names))
        photos.append(dict(at=round(t, 2), dur=d + (PXF if k < len(spec) - 1 else 0), srcs=srcs, zin=k % 2 == 0, land=land))
        if txt:
            if texts:
                texts[-1]["t1"] = round(t + PXF * 0.5, 2)
            texts.append(dict(t0=round(t, 2), label=txt[0], title=txt[1]))
        t += d
    if texts:
        texts[-1]["t1"] = round(t, 2)
    return dict(kind="inter", from_=t0, dur=round(t, 2), photos=photos, texts=texts), t


items, t, speech = [dict(kind="open", from_=0, dur=OPEN)], OPEN, []
for sp in SPEAKERS:
    if "inter" in sp:
        it, d = interlude(sp["inter"], t)
        items.append(it)
        t += d
        continue
    src, dur, caps = build_speaker(sp)
    items.append(dict(kind="clip", from_=t, dur=dur, src=src, name=sp["name"], role=sp["role"], alum=sp.get("alum", False), caps=caps))
    speech.append((t, t + dur))
    t += dur
    print(f"{sp['id']}: {dur:.1f} s")
finale = t
it, d, names = collage(t)
items.append(it)
t += d
it, d = interlude(FELICITATION, t)
items.append(it)
t += d
fam = {k: [n for num, n in names if FAMILY.get(num) == k] for k in ("principal", "later", "teacher")}
items.append(dict(kind="credits", from_=t, dur=CREDITS, honourees=[n for num, n in names if num not in FAMILY], family=fam))
t += CREDITS
items.append(dict(kind="close", from_=t, dur=CLOSE))
t += CLOSE
total = t
for it in items:
    it["from"] = round(it.pop("from_") * FPS)
json.dump(dict(total=round(total * FPS), items=items), open("src/speakers-film.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------- Music bed ----------
# Quiet opening of the piano track (0-42 s) loops under the speakers; the track lifts at 43.03 s,
# so its full section is placed to start exactly as the felicitation collage begins.
SR = 48000
run(["ffmpeg", "-v", "error", "-y", "-i", MUSIC, "-ac", "2", "-ar", str(SR), "-f", "f32le", "music.raw"])
m = np.fromfile("music.raw", dtype=np.float32).reshape(-1, 2)
os.remove("music.raw")
LIFT, LEAD = 43.03, 8.0
n = int(total * SR)
XS = int(3.0 * SR)
ramp = np.linspace(0, 1, XS, dtype=np.float32)[:, None]


def xcat(x, y):  # join with an equal-gain crossfade of XS samples
    return np.concatenate([x[:-XS], x[-XS:] * (1 - ramp) + y[:XS] * ramp, y[XS:]])


P0 = int(PIANO_AT * SR)
fin_start = int((finale - LEAD) * SR) - P0  # tail starts here (piano time), so the lift lands at the finale
loop = m[: int(42.0 * SR)] * 2.0  # the quiet opening is about 8 dB softer than the lift
body = loop
while len(body) < fin_start + XS:
    body = xcat(body, loop)
bed = xcat(body[: fin_start + XS], m[int((LIFT - LEAD) * SR):])
bed = np.concatenate([np.zeros((P0, 2), np.float32), bed])
bed = np.concatenate([bed, np.zeros((max(0, n - len(bed)), 2), np.float32)])[:n]
# ducking under speech: full level elsewhere, -21 dB under clips, 0.8 s ramps
tt = np.arange(n) / SR
gain = np.ones(n, np.float32)
DUCK, R = 10 ** (-21 / 20), 0.8
for a, b in speech:
    g = np.interp(tt, [a - R * 0.5, a + R * 0.5, b - R * 0.5, b + R * 0.5], [1, DUCK, DUCK, 1], left=1, right=1)
    gain = np.minimum(gain, g)
# short fade in at the start; long fade out at the very end
gain *= np.clip((tt - PIANO_AT) / 1.2, 0, 1) * np.clip((total - tt) / 4.0, 0, 1)
bed *= gain[:, None] * 0.55
pcm = (np.clip(bed, -1, 1) * 32767).astype(np.int16)
with wave.open(os.path.join(OUT, "music.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(f"total {total:.1f} s ({round(total * FPS)} frames); finale at {finale:.1f} s")
