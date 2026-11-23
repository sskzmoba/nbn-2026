# Builds the cut (landscape, all clips joined) and caption data for the Voice of the Kazak reel.
import json, subprocess, os
SRC = r"D:\temp\NBN\breeze\breeze-nbn-segment.mp4"
OUT = r"D:\claudecode\oba\events\nbn-2026\.claude\worktrees\guiding-lights-nov-21-0b03f4\video\public\breeze"
DATA = r"D:\claudecode\oba\events\nbn-2026\.claude\worktrees\guiding-lights-nov-21-0b03f4\video\src\breezeReel.json"
CLIPS = [(54.0, 66.0), (89.2, 98.9), (126.5, 148.3), (409.7, 421.4), (433.2, 446.9), (470.4, 480.0), (492.75, 513.2)]
FIX = {438.53: "if you", 438.93: "scratch", 130.82: "realised", 128.12: "Malayalam-", 128.44: "medium", 501.91: "Think:"}
EMPH = [(56.1, 57.5), (97.0, 97.1), (98.29, 98.4), (138.0, 138.85), (144.9, 145.1), (414.9, 416.8), (420.2, 421.2), (443.0, 444.6), (477.8, 479.2), (495.1, 495.7), (504.9, 508.4), (509.4, 511.3)]
BREAKS = {59.46, 61.90, 63.92, 91.80, 94.46, 96.16, 97.40, 127.82, 129.80, 132.60, 135.64, 139.18, 141.74, 144.38, 146.66,
          413.73, 417.07, 419.39, 433.41, 437.57, 441.71, 444.65, 473.45, 476.41, 492.83, 495.15, 498.79, 501.91, 504.31, 509.49}
FIX.update({409.77: "Here", 492.83: "We"})
EMPH[:] = [r for r in EMPH if r != (504.9, 508.4)] + [(504.9, 506.0)]
W = json.load(open(r"D:\temp\NBN\breeze\words.json"))
fps = 30
# 1. cut video: trim each clip, short audio fades, concat, loudness to -16 LUFS
parts, t, clips = [], 0.0, []
fc = []
for i, (a, b) in enumerate(CLIPS):
    d = b - a
    fc.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,fps={fps}[v{i}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.06,afade=t=out:st={d-0.12:.3f}:d=0.12[a{i}]")
    clips.append({"start": round(t, 3), "dur": round(d, 3)})
    t += d
fc.append("".join(f"[v{i}][a{i}]" for i in range(len(CLIPS))) + f"concat=n={len(CLIPS)}:v=1:a=1[v][a0];[a0]loudnorm=I=-16:TP=-1.5:LRA=11[a]")
os.makedirs(OUT, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
                "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                os.path.join(OUT, "cut.mp4")], check=True)
# 2. captions: words mapped to cut time, split into short pages
pages = []
for ci, (a, b) in enumerate(CLIPS):
    ws = [w for w in W if a - 0.05 <= w[0] < b]
    page = []
    def flush():
        if page: pages.append({"clip": ci, "words": page.copy()}); page.clear()
    for j, (s, e, txt) in enumerate(ws):
        txt = FIX.get(s, txt.strip())
        off = clips[ci]["start"] - a
        emph = any(x <= s <= y for x, y in EMPH)
        if page and round(s, 2) in BREAKS: flush()
        page.append({"t": txt, "s": round(s + off, 3), "e": round(min(e, b) + off, 3), "g": emph})
    flush()
# join "Malayalam-" "medium"
for p in pages:
    for k in range(len(p["words"]) - 1):
        if p["words"][k]["t"].endswith("-"):
            p["words"][k]["t"] += p["words"][k + 1]["t"]; p["words"][k]["e"] = p["words"][k + 1]["e"]; p["words"][k + 1]["t"] = ""
    p["words"] = [w for w in p["words"] if w["t"]]
json.dump({"fps": fps, "total": round(t, 3), "clips": clips, "pages": pages}, open(DATA, "w"), indent=1)
print("cut", round(t, 2), "s,", len(pages), "pages")
for p in pages: print(f'{p["words"][0]["s"]:6.2f}', " ".join(("*" if w["g"] else "") + w["t"] for w in p["words"]))
