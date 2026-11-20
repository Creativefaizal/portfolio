const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist');let errors=[];
for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,name),'utf8');
 for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
  const ref=match[1];if(/^(?:https?:|mailto:|data:)/.test(ref))continue;
  const file=path.resolve(root,ref.split(/[?#]/)[0]);if(!fs.existsSync(file)||!fs.statSync(file).size)errors.push(name+': missing or empty '+ref);
 }
 if(!html.includes('src="reload-top.js"'))errors.push(name+': missing reload reset');
 if(!html.includes('href="favicon.svg"'))errors.push(name+': missing favicon');
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('All pages, local assets, favicon links, and reload scripts checked.');
