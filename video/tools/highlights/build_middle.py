import json,subprocess,numpy as np,os
M="D:/temp/NBN/Guiding Lights.mov"
plan=json.load(open('plan.json')); df=np.load('diff.npy')
pieces=[]
for p in plan:
    s,e=p['s'],p['e']
    if p['shake']>=0.7:
        cuts=[s]+[k for k in range(s+1,e+1) if df[k]>40]+[e+1]
        for a,b in zip(cuts[:-1],cuts[1:]):
            if b-a>=4: pieces.append((a,b-1,True))
    else: pieces.append((s,e,False))
lst=[]
for i,(a,b,stab) in enumerate(pieces):
    out=f"seg/p{i:03d}.mp4"; lst.append(out)
    ss=a/50; t=(b-a+1)/50
    base=['ffmpeg','-v','error','-y','-ss',f'{ss:.3f}','-i',M,'-frames:v',str(b-a+1),'-an']
    enc=['-c:v','libx264','-crf','12','-preset','medium','-pix_fmt','yuv420p','-r','50']
    if stab and b-a>=15:
        trf=f"seg/p{i:03d}.trf"
        subprocess.run(base+['-vf',f'vidstabdetect=shakiness=5:accuracy=15:result={trf}','-f','null','-'],check=True)
        vf=f'vidstabtransform=input={trf}:smoothing=12:optzoom=0:zoom=4:interpol=bicubic,unsharp=5:5:0.4'
    elif stab:
        vf='scale=iw*1.04:ih*1.04,crop=1920:1080'
    else: vf='null'
    subprocess.run(base+['-vf',vf]+enc+[out],check=True)
    print(i,a,b,stab,flush=True)
open('seg/list.txt','w').write(''.join(f"file '{os.path.basename(x)}'\n" for x in lst))
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','seg/list.txt','-c','copy','middle.mp4'],check=True)
