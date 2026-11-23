import cv2,numpy as np,sys
cap=cv2.VideoCapture(sys.argv[1]); fps=cap.get(5); v=[];i=0
while True:
    ok,f=cap.read()
    if not ok: break
    g=cv2.cvtColor(cv2.resize(f,(480,270)),cv2.COLOR_BGR2GRAY)
    v.append(cv2.Laplacian(g,cv2.CV_64F).var())
v=np.array(v); n=len(v)
med=np.array([np.median(v[max(0,k-25):k+26]) for k in range(n)])
bad=(v<0.35*med)&(med>30)
# group
runs=[];k=0
while k<n:
    if bad[k]:
        s=k
        while k<n and bad[k]: k+=1
        runs.append((s,k-1))
    k+=1
for s,e in runs: print(f"{s/fps:7.2f}-{e/fps:7.2f}s ({e-s+1} frames)")
print(len(runs),"blur runs")
