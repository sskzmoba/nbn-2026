import numpy as np, json
sh=np.load('sharp.npy');df=np.load('diff.npy');mot=np.load('mot.npy');n=len(sh)
med=np.array([np.median(sh[max(0,k-25):k+26]) for k in range(n)]); r=sh/np.maximum(med,1)
START,END=350,4930
rm=np.zeros(n,bool)
for k in range(1,n-1):
    if r[k]<0.2 and r[k]<=r[k-1] and r[k]<=r[k+1]:
        a=k
        while a>k-8 and r[a-1]<0.9: a-=1
        b=k
        while b<k+8 and r[b+1]<0.9: b+=1
        rm[a:b+1]=True
rm[2822:2831]=True
rm[496:520]=True
rm[924:932]=True
keep=[];k=START
while k<=END:
    if not rm[k]:
        s=k
        while k<=END and not rm[k]: k+=1
        if k-s>=8: keep.append([s,k-1])
    else: k+=1
# shake per segment: high-frequency jitter of phase-correlation motion, ignoring cut frames
dx=mot[:,0];dy=mot[:,1];ok=(mot[:,2]>0.15)&(np.abs(dx)<120)&(np.abs(dy)<120)&(df<40)
out=[]
for s,e in keep:
    idx=[i for i in range(s+1,e+1) if ok[i]]
    if len(idx)<10: j=0
    else:
        x=dx[idx];y=dy[idx];kx=np.convolve(x,np.ones(13)/13,'same');ky=np.convolve(y,np.ones(13)/13,'same')
        j=float(np.mean(np.hypot(x-kx,y-ky)))
    out.append(dict(s=s,e=e,dur=round((e-s+1)/50,2),shake=round(j,2)))
json.dump(out,open('plan.json','w'),indent=0)
tot=sum(o['dur'] for o in out)
for o in out: print(o)
print(len(out),'segments',round(tot,2),'s; removed',int(rm[START:END+1].sum()),'frames')
