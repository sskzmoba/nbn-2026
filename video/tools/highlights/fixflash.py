import cv2,numpy as np,subprocess
L,D=np.load('v3luma.npy'); n=len(L)
drop=set(range(1857,1865))|set(range(3378,3392))
flash=set()
for k in range(330,4430):   # between the opening and closing cards
    if L[k]-max(L[k-2],L[k+2])>12 and k not in drop: flash.add(k)
# 2-3 frame washes: include neighbours that are also bright vs the clean frame before the run
for k in sorted(flash):
    j=k+1
    while j<n and L[j]-L[k-2]>12 and j-k<4: flash.add(j); j+=1
flash.update(range(1735,1739))
print("drop",len(drop),'flash frames',len(flash)); print(sorted(round(k/50,2) for k in flash))
cap=cv2.VideoCapture('assembled.mp4')
p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','1920x1080','-r','50','-i','-',
  '-c:v','libx264','-crf','20','-preset','slow','-maxrate','10M','-bufsize','20M','-pix_fmt','yuv420p','v4_video.mp4'],stdin=subprocess.PIPE)
last=None;k=0;out=0
while True:
    ok,f=cap.read()
    if not ok: break
    if k in drop: k+=1; continue
    if k in flash and last is not None: f=last
    else: last=f
    p.stdin.write(f.tobytes()); k+=1; out+=1
p.stdin.close(); p.wait(); print('frames out',out, out/50,'s')
