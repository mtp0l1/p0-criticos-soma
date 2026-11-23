// ACC-02: todo controle tocável tem pelo menos 44x44px (WCAG 2.5.8 pede 24; o sistema adota 44).
const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:360,height:800}});
  const files=fs.readdirSync('test').filter(f=>f.endsWith('.html')&&f!=='Cover.html');
  const out={}, totals={}; let n=0;
  for(const f of files){
    await p.goto('file://'+process.cwd()+'/test/'+f); await p.waitForTimeout(200);
    const r=await p.evaluate(()=>{
      const sel='button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=radio],[role=switch],[role=checkbox],[role=menuitem],[role=option]';
      const bad=[]; let total=0;
      for(const el of document.querySelectorAll(sel)){
        const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
        const r=el.getBoundingClientRect(); if(r.width===0||r.height===0) continue;
        // link dentro de texto corrido está isento (WCAG 2.5.8, exceção "inline")
        if(el.tagName==='A' && el.closest('p,label,li,span')&&getComputedStyle(el).display==='inline') continue;
        total++;
        // área ampliada por pseudo-elemento (hitArea): o ::after absoluto só conta se for maior que o elemento
        let w=r.width,h=r.height; const a=getComputedStyle(el,'::after');
        if(a&&a.content!=='none'&&a.position==='absolute'){ const pw=parseFloat(a.width), ph=parseFloat(a.height); if(!isNaN(pw)&&pw>w) w=pw; if(!isNaN(ph)&&ph>h) h=ph; }
        if(w<43.5||h<43.5) bad.push((el.getAttribute('aria-label')||el.textContent||el.tagName).trim().slice(0,24)+' '+Math.round(w)+'x'+Math.round(h));
      }
      return {bad,total};
    });
    n+=r.total; totals[f]=r.total; if(r.bad.length) out[f]=r.bad;
  }
  console.log(JSON.stringify({checked:n,fail:out},null,1)); fs.writeFileSync('touch-totals.json',JSON.stringify(totals)); await b.close();
})();
