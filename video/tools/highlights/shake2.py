import cv2,numpy as np,sys
cap=cv2.VideoCapture(sys.argv[1]); fps=cap.get(5)
prev=None; mot=[]; cut=[]
win=cv2.createHanningWindow((480,270),cv2.CV_64F)
while True:
    ok,f=cap.read()
    if not ok: break
    g=cv2.cvtColor(cv2.resize(f,(480,270)),cv2.COLOR_BGR2GRAY).astype(np.float64)
    if prev is None: mot.append((0,0,0)); prev=g; continue
    (dx,dy),r=cv2.phaseCorrelate(prev,g,win)
    mot.append((dx*4,dy*4,r)); prev=g   # in 1920px units
mot=np.array(mot); n=len(mot)
ok=(mot[:,2]>0.15)&(np.abs(mot[:,0])<120)&(np.abs(mot[:,1])<120)
dx=np.where(ok,mot[:,0],np.nan); dy=np.where(ok,mot[:,1],np.nan)
def smooth(a,k):
    out=np.full_like(a,np.nan)
    for i in range(len(a)):
        s=a[max(0,i-k):i+k+1]; s=s[~np.isnan(s)]
        if len(s): out[i]=s.mean()
    return out
jx=dx-smooth(dx,int(fps*0.25)); jy=dy-smooth(dy,int(fps*0.25))
j=np.sqrt(jx**2+jy**2)
fpsi=int(round(fps))
for s in range(int(np.ceil(n/fpsi))):
    seg=j[s*fpsi:(s+1)*fpsi]; seg=seg[~np.isnan(seg)]
    pan=np.nanmean(np.sqrt(dx[s*fpsi:(s+1)*fpsi]**2+dy[s*fpsi:(s+1)*fpsi]**2)) if len(seg) else 0
    m=seg.mean() if len(seg) else 0
    print(f"{s:3d}s shake {m:5.2f} motion {pan:5.1f} {'#'*int(m*3)}")
