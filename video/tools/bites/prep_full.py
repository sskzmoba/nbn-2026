# Full talk (landscape, YouTube): interruptions cut, word-timed captions, plus an .srt for YouTube's own captions.
import json, subprocess, os
SRC = r"D:\temp\NBN\breeze\breeze-nbn-segment.mp4"
VID = r"D:\claudecode\oba\events\nbn-2026\.claude\worktrees\guiding-lights-nov-21-0b03f4\video"
CLIPS = [(37.6, 42.25), (44.6, 246.3), (256.5, 262.6), (286.4, 513.4), (514.9, 538.4)]
INTRO = 4.0  # seconds of title card before the talk (for the .srt offset)
REPL = [  # (near time, old tokens, new tokens)
 (114.3, ["Sanic", "school", "curriculum"], ["Sainik", "School", "Kazhakootam"]),
 (178.4, ["us,", "you", "know,", "someone"], ["a", "sermon"]),
 (192.8, ["NPSR"], ["NBN", "Sir"]), (310.8, ["NPSR"], ["NBN", "Sir"]),
 (198.8, ["Dr.", "Janci"], ["Dr", "Jancy"]), (219.2, ["eyes"], ["ice"]),
 (320.5, ["Katalmanti", "street,", "Nampali"], ["Katalmandi", "Street,", "Nampally"]),
 (346.0, ["daughter", "-in", "-law"], ["daughter-in-law"]),
 (356.6, ["Visagapatnam."], ["Visakhapatnam."]), (360.9, ["Inus", "Kananur."], ["INS", "Cannanore."]),
 (388.8, ["to", "know.", "Chip,", "paint"], ["to", "chip-paint"]), (400.4, ["scrapped"], ["scrubbed"]),
 (403.5, ["holy", "stoning."], ["holystoning."]), (407.5, ["holy", "stoning."], ["holystoning."]),
 (421.7, ["In", "being", "said,"], ["NBN", "Sir"]), (438.5, ["you", "scratches"], ["if", "you", "scratch"]),
 (300.5, ["counter", "measure"], ["countermeasure"]), (352.97, ["counter", "measure"], ["countermeasure"]),
 (371.5, ["non", "-magnetic"], ["non-magnetic"]),
 (128.1, ["Malayalam", "medium"], ["Malayalam-medium"]), (501.9, ["Think,"], ["Think:"]),
]
EMPH = [(56.1, 57.5), (97.0, 97.1), (98.29, 98.4), (138.0, 138.85), (144.9, 145.1), (414.9, 416.8), (420.2, 421.2),
        (443.0, 444.6), (477.8, 479.2), (495.1, 495.7), (504.9, 506.0), (509.4, 511.3)]
W = [[s, e, t.strip()] for s, e, t in json.load(open(r"D:\temp\NBN\breeze\words.json"))]
for near, old, new in REPL:
    i = next(i for i, w in enumerate(W) if abs(w[0] - near) < 2.5 and [x[2] for x in W[i:i + len(old)]] == old)
    s, e = W[i][0], W[i + len(old) - 1][1]
    step = (e - s) / len(new)
    W[i:i + len(old)] = [[round(s + k * step, 2), round(s + (k + 1) * step, 2), t] for k, t in enumerate(new)]
for w in W:
    w[2] = w[2].replace("realized", "realised").replace("honored", "honoured").replace("Dr.", "Dr").replace("caliber", "calibre").replace("traveled", "travelled").replace("program", "programme")
fps = 30
fc, t, clips = [], 0.0, []
for i, (a, b) in enumerate(CLIPS):
    d = b - a
    fc.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,fps={fps}[v{i}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.06,afade=t=out:st={d-0.12:.3f}:d=0.12[a{i}]")
    clips.append({"start": round(t, 3), "dur": round(d, 3)}); t += d
fc.append("".join(f"[v{i}][a{i}]" for i in range(len(CLIPS))) + f"concat=n={len(CLIPS)}:v=1:a=1[v][a0];[a0]loudnorm=I=-16:TP=-1.5:LRA=11[a]")
if "--nocut" not in os.sys.argv:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        os.path.join(VID, "public", "breeze", "full.mp4")], check=True)
pages = []
import math
for ci, (a, b) in enumerate(CLIPS):
    off = clips[ci]["start"] - a
    ws = [{"t": t_, "s": round(s_ + off, 3), "e": round(min(e_, b) + off, 3), "g": any(x <= s_ <= y for x, y in EMPH)}
          for s_, e_, t_ in W if a - 0.05 <= s_ < b]
    # sentences (also split at long pauses)
    sents, cur = [], []
    for w in ws:
        if cur and w["s"] - cur[-1]["e"] > 0.8: sents.append(cur); cur = []
        cur.append(w)
        if w["t"][-1] in ".?!:": sents.append(cur); cur = []
    if cur: sents.append(cur)
    for st in sents:
        k = math.ceil(len(st) / 10)
        start = 0
        for j in range(1, k):
            ideal = round(len(st) * j / k)
            cands = [i for i in range(max(start + 3, ideal - 2), min(len(st) - 2, ideal + 3)) if st[i - 1]["t"][-1] in ",;"]
            cut = min(cands, key=lambda i: abs(i - ideal)) if cands else ideal
            pages.append({"clip": ci, "words": st[start:cut]}); start = cut
        pages.append({"clip": ci, "words": st[start:]})
json.dump({"fps": fps, "total": round(t, 3), "clips": clips, "pages": pages}, open(os.path.join(VID, "src", "breezeFull.json"), "w"), indent=0)
def ts(x):
    x += INTRO; h, m = int(x // 3600), int(x % 3600 // 60); s = x % 60
    return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", ",")
with open(r"D:\temp\NBN\voice-of-the-kazak-ep1-breeze-full-talk.srt", "w", encoding="utf-8") as fo:
    for k, p in enumerate(pages, 1):
        fo.write(f"{k}\n{ts(p['words'][0]['s'])} --> {ts(p['words'][-1]['e'] + 0.3)}\n{' '.join(w['t'] for w in p['words'])}\n\n")
print("full", round(t, 1), "s,", len(pages), "pages")
for p in pages: print(f'{p["words"][0]["s"]:6.1f}', " ".join(w["t"] for w in p["words"]))
