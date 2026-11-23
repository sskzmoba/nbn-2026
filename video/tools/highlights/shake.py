import re,statistics as st,sys
fr=[]
for line in open('tr.trf'):
    if not line.startswith('Frame'): continue
    lm=re.findall(r'\(LM (-?\d+) (-?\d+) \d+ \d+ \d+ [\d.]+ ([\d.]+)\)',line)
    if len(lm)>=5:
        dx=st.median(int(a) for a,b,c in lm); dy=st.median(int(b) for a,b,c in lm)
    else: dx=dy=None
    fr.append((dx,dy))
fps=50
n=len(fr)
# jitter: per-frame motion minus local mean motion (0.4s window) -> high-frequency shake
vals=[]
for i,(dx,dy) in enumerate(fr):
    if dx is None or abs(dx)>40 or abs(dy)>40: vals.append(None); continue
    w=[f for f in fr[max(0,i-10):i+11] if f[0] is not None and abs(f[0])<=40 and abs(f[1])<=40]
    mx=sum(a for a,b in w)/len(w); my=sum(b for a,b in w)/len(w)
    vals.append(((dx-mx)**2+(dy-my)**2)**.5)
for s in range(0,n//fps+1):
    seg=[v for v in vals[s*fps:(s+1)*fps] if v is not None]
    if not seg: print(f"{s:3d}s  -"); continue
    m=sum(seg)/len(seg)
    print(f"{s:3d}s {m:5.2f} {'#'*int(m*4)}")
