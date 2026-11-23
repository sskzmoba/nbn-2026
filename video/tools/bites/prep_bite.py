# Usage: python prep_bite.py bites/<id>.json [--nocut]
# Config (times in STREAM seconds): {"src": file, "src_start": stream second at file start, "words": words.json (file seconds),
#  "clips": [[a, b], ...], "fix": [[near, [old...], [new...]], ...], "emph": [[a, b], ...], "x": [optional crop centre per clip]}
import json, subprocess, os, sys, math
cfg = json.load(open(sys.argv[1], encoding="utf-8")); bid = os.path.splitext(os.path.basename(sys.argv[1]))[0]
VID = r"D:\claudecode\oba\events\nbn-2026\.claude\worktrees\guiding-lights-nov-21-0b03f4\video"
# sources: {"name": {"file", "start" (stream s at file start), "words"}}; a clip may name its source as a 3rd item
SRCS = cfg.get("sources") or {"main": {"file": cfg["src"], "start": cfg["src_start"], "words": cfg["words"]}}
names = list(SRCS)
W = []
for nm in names:
    o = SRCS[nm]["start"]
    W += [[round(s + o, 2), round(e + o, 2), t.strip()] for s, e, t in json.load(open(SRCS[nm]["words"]))]
W.sort(key=lambda w: w[0])
cfg["clips"] = [c if len(c) == 3 else [c[0], c[1], names[0]] for c in cfg["clips"]]
for near, old, new in cfg.get("fix", []):
    try:
        i = next(i for i, w in enumerate(W) if abs(w[0] - near) < 3 and [x[2] for x in W[i:i + len(old)]] == old)
    except StopIteration:
        sys.exit(f"fix not found near {near}: {old}")
    s, e = W[i][0], W[i + len(old) - 1][1]; step = (e - s) / max(1, len(new))
    W[i:i + len(old)] = [[round(s + k * step, 2), round(s + (k + 1) * step, 2), t] for k, t in enumerate(new)]
UK = {"realized": "realised", "honored": "honoured", "Dr.": "Dr", "Mr.": "Mr", "program": "programme", "traveled": "travelled", "color": "colour", "behavior": "behaviour", "center": "centre", "Karakotam": "Kazhakootam", "Kazakhs": "Kazaks", "honor": "honour", "defense": "defence", "Pangod": "Pangode", "Pangodee": "Pangode", "18000": "18,000"}
for w in W:
    for a, b in UK.items(): w[2] = w[2].replace(a, b)
fps = 30; fc, t, clips = [], 0.0, []
for i, (a, b, nm) in enumerate(cfg["clips"]):
    o = SRCS[nm]["start"]; si = names.index(nm)
    fa, fb, d = a - o, b - o, b - a
    fc.append(f"[{si}:v]trim={fa}:{fb},setpts=PTS-STARTPTS,fps={fps}[v{i}];[{si}:a]atrim={fa}:{fb},asetpts=PTS-STARTPTS,afade=t=in:d=0.06,afade=t=out:st={d-0.12:.3f}:d=0.12[a{i}]")
    c = {"start": round(t, 3), "dur": round(d, 3)}
    if cfg.get("x"): c["x"] = cfg["x"][i]
    if cfg.get("z"): c["z"] = cfg["z"][i]
    clips.append(c); t += d
n = len(cfg["clips"])
fc.append("".join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a0];[a0]loudnorm=I=-16:TP=-1.5:LRA=11[a]")
if "--nocut" not in sys.argv:
    inputs = sum((["-i", SRCS[nm]["file"]] for nm in names), [])
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
        "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        os.path.join(VID, "public", "breeze", bid + ".mp4")], check=True)
EMPH = [tuple(r) for r in cfg.get("emph", [])]
import re
norm = lambda x: re.sub(r"[^a-z0-9']", "", x.lower())
NW = [norm(w[2]) for w in W]
for ph in cfg.get("emph_phrases", []):
    toks = [norm(x) for x in ph.split()]
    hits = [i for i in range(len(W)) if NW[i:i + len(toks)] == toks]
    if not hits: print("emphasis phrase not found:", ph)
    for i in hits: EMPH.append((W[i][0] - 0.01, W[i + len(toks) - 1][0] + 0.01))
pages = []
for ci, (a, b, _) in enumerate(cfg["clips"]):
    off = clips[ci]["start"] - a
    ws = [{"t": tx, "s": round(s + off, 3), "e": round(min(e, b) + off, 3), "g": any(x <= s <= y for x, y in EMPH)} for s, e, tx in W if a - 0.05 <= s < b and tx]
    sents, cur = [], []
    for w in ws:
        if cur and w["s"] - cur[-1]["e"] > 1.2: sents.append(cur); cur = []
        cur.append(w)
        if w["t"][-1] in ".?!:": sents.append(cur); cur = []
    if cur: sents.append(cur)
    for st in sents:
        k = math.ceil(len(st) / 8); start = 0
        for j in range(1, k):
            ideal = round(len(st) * j / k)
            cands = [i for i in range(max(start + 3, ideal - 2), min(len(st) - 2, ideal + 3)) if st[i - 1]["t"][-1] in ",;"]
            cut = min(cands, key=lambda i: abs(i - ideal)) if cands else ideal
            while cut < len(st) - 1 and st[cut - 1]["t"][:1].isupper() and st[cut]["t"][:1].isupper(): cut += 1
            pages.append({"words": st[start:cut]}); start = cut
        pages.append({"words": st[start:]})
json.dump({"total": round(t, 3), "clips": clips, "pages": pages}, open(os.path.join(VID, "src", "bites", bid + ".json"), "w"), indent=0)
print(bid, round(t, 1), "s,", len(pages), "pages")
for p in pages: print(f'{p["words"][0]["s"]:6.1f}', " ".join(("*" if w["g"] else "") + w["t"] for w in p["words"]))
