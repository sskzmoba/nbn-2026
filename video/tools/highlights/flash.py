import cv2,numpy as np,sys
cap=cv2.VideoCapture(sys.argv[1]); fps=cap.get(5); L=[];D=[];prev=None
while True:
    ok,f=cap.read()
    if not ok: break
    s=cv2.resize(f,(160,90)).astype(np.int16); g=cv2.cvtColor(cv2.resize(f,(160,90)),cv2.COLOR_BGR2GRAY)
    L.append(g.mean()); D.append(0 if prev is None else np.abs(s-prev).mean()); prev=s
L=np.array(L);D=np.array(D);n=len(L)
np.save(sys.argv[2],np.vstack([L,D]))
# flash: frame(s) much brighter than both neighbours ~3 frames away, or single-frame outliers in content
for k in range(3,n-3):
    a=L[k]-max(L[k-3],L[k+3])
    odd=D[k]>25 and D[k+1]>25 and (k+2<n and D[k+2]<0.5*D[k])
    if a>12 or odd:
        print(f"{k/fps:7.2f}s  luma {L[k]:5.1f} (before {L[k-3]:5.1f} after {L[k+3]:5.1f})  diff {D[k]:4.0f} {D[k+1]:4.0f}  {'BRIGHT' if a>12 else ''}{' 1-FRAME' if odd else ''}")
