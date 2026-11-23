import cv2,numpy as np,sys
cap=cv2.VideoCapture(sys.argv[1]); fps=cap.get(5)
sh=[];df=[];prev=None
while True:
    ok,f=cap.read()
    if not ok: break
    s=cv2.resize(f,(240,135)); g=cv2.cvtColor(cv2.resize(f,(480,270)),cv2.COLOR_BGR2GRAY)
    sh.append(cv2.Laplacian(g,cv2.CV_64F).var())
    df.append(0 if prev is None else float(np.abs(s.astype(int)-prev).mean())); prev=s.astype(int)
np.save('sharp.npy',np.array(sh)); np.save('diff.npy',np.array(df)); print(len(sh),fps)
