# python sheet.py video.mp4 out.jpg t1 t2 ...   (frames side by side, 320 px wide each, with time labels)
import sys, subprocess, cv2, numpy as np, tempfile, os
v, out, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3:]]
tiles = []
for t in ts:
    p = os.path.join(tempfile.gettempdir(), f"sh_{t}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", v, "-frames:v", "1", "-vf", "scale=320:-1", p], check=True)
    im = cv2.imread(p); cv2.putText(im, f"{t:g}", (5, 22), 0, .7, (0, 255, 255), 2); tiles.append(im)
h = max(i.shape[0] for i in tiles); tiles = [cv2.copyMakeBorder(i, 0, h - i.shape[0], 0, 0, cv2.BORDER_CONSTANT) for i in tiles]
rows = [np.hstack(tiles[i:i + 6] + [np.zeros_like(tiles[0])] * (6 - len(tiles[i:i + 6]))) for i in range(0, len(tiles), 6)]
cv2.imwrite(out, np.vstack(rows))
