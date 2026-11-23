# usage: bash render_bite.sh <key> <output-name>  -> out/<name>.mp4, -whatsapp.mp4, copies to D:\temp\NBN\bites
k=$1; n=$2; mkdir -p /d/temp/NBN/bites
npx remotion render src/index.ts Bite-$k out/$n.mp4 --codec=h264 --crf=20 --log=error 2>&1 | grep -v "Failed to load" | tail -3
ffmpeg -v error -y -i out/$n.mp4 -vf scale=720:1280 -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart out/$n-whatsapp.mp4
cp out/$n.mp4 out/$n-whatsapp.mp4 /d/temp/NBN/bites/ && ls -la /d/temp/NBN/bites/$n*
