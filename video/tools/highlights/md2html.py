import sys,re,markdown
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
out=[]
for i,l in enumerate(lines):
    if l.startswith('#GuidingLights') or l.startswith('# GuidingLights'): l='\'+l.lstrip('# ').join(['#',''])
    if re.match(r'\s*[-*] ',l) and out and out[-1].strip() and not re.match(r'\s*([-*]|\d+\.) ',out[-1]): out.append('')
    out.append(l)
md='\n'.join(out)
md=re.sub(r'(?<![(\[<])(https://[^\s)]+)',r'<\1>',md)
body=markdown.markdown(md,extensions=['tables','sane_lists'])
body=body.replace('<blockquote>','').replace('</blockquote>','').replace('<hr />','')
open(sys.argv[2],'w',encoding='utf-8').write('<html><head><meta charset="utf-8"></head><body>'+body+'</body></html>')
