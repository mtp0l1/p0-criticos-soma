const { chromium } = require('playwright'); const fs=require('fs');
const axeSrc=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:820,height:640}});
  const errs={}; let cur='';
  p.on('pageerror',e=>{errs[cur]=(errs[cur]||[]).concat(e.message)});
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs[cur]=(errs[cur]||[]).concat(m.text())});
  const files=fs.readdirSync('test').filter(f=>f.endsWith('.html')&&f!=='Cover.html');
  const out={};
  for(const f of files){ cur=f; await p.goto('file://'+process.cwd()+'/test/'+f); await p.waitForTimeout(250);
    await p.screenshot({path:'test/'+f.replace('.html','.png'),fullPage:true});
    await p.addScriptTag({content:axeSrc});
    const r=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice'],rules:{'landmark-one-main':{enabled:false},'page-has-heading-one':{enabled:false},region:{enabled:false},'landmark-no-duplicate-banner':{enabled:false},'landmark-unique':{enabled:false}}});return r.violations.map(v=>v.id+'('+v.impact+'):'+v.nodes.length+' '+v.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | '))});
    if(r.length) out[f]=r;
  }
  console.log(JSON.stringify({errs,out},null,1)); await b.close();
})();
