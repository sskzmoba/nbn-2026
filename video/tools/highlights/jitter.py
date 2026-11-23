import cv2,numpy as np,sys
cap=cv2.VideoCapture(sys.argv[1]); prev=None; mot=[]
win=cv2.createHanningWindow((480,270),cv2.CV_64F)
while True:
    ok,f=cap.read()
    if not ok: break
    g=cv2.cvtColor(cv2.resize(f,(480,270)),cv2.COLOR_BGR2GRAY).astype(np.float64)
    if prev is None: mot.append((0,0,0)); prev=g; continue
    (dx,dy),r=cv2.phaseCorrelate(prev,g,win); mot.append((dx*4,dy*4,r)); prev=g
np.save('mot.npy',np.array(mot))
