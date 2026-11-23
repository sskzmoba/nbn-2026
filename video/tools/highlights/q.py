import re,sys,difflib
F="D:/temp/NBN/pho/GUIDING LIGHTS LIVE ON 21 NOVEMBER 2026 AT 10 Am To 200 PM.srt.txt"
cues=[]
for b in re.split(r'\n\s*\n',open(F,encoding='utf-8',errors='replace').read()):
    l=b.strip().split('\n')
    if len(l)<3: continue
    m=re.match(r'(\d+):(\d+):(\d+)',l[1]);
    if not m: continue
    t=int(m[1])*3600+int(m[2])*60+int(m[3])
    sp,_,tx=' '.join(l[2:]).partition(': ')
    cues.append((t,sp,tx))
def norm(s): return re.sub(r'[^a-z ]','',s.lower())
quotes=[q for q in open(sys.argv[1],encoding='utf-8').read().split('\n') if q.strip()]
for q in quotes:
    nq=norm(q); best=(0,0)
    W=max(3,len(q)//40+2)
    for i in range(len(cues)-W):
        w=norm(' '.join(c[2] for c in cues[i:i+W]))
        if not set(nq.split()[:6])&set(w.split()): continue
        r=difflib.SequenceMatcher(None,nq,w).ratio()
        if r>best[0]: best=(r,i)
    r,i=best; t=cues[i][0]
    print(f"\nQ: {q}\n=> {t//3600}:{t%3600//60:02d}:{t%60:02d} [{cues[i][1]}] ({r:.2f}) {' '.join(c[2] for c in cues[max(0,i-1):i+W+2])}")
