const menu=document.querySelector('#menu'),toggle=document.querySelector('.menu-toggle'),header=document.querySelector('body>header');
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
// Safari may mark programmatic dialog focus as focus-visible after a tap.
// Track input explicitly so keyboard focus stays visible without drawing a box on taps.
const markPointerInput=()=>document.documentElement.classList.add('pointer-input');
document.addEventListener('pointerdown',markPointerInput,true);
document.addEventListener('touchstart',markPointerInput,{capture:true,passive:true});
document.addEventListener('keydown',event=>{if(!event.metaKey&&!event.altKey&&!event.ctrlKey)document.documentElement.classList.remove('pointer-input')},true);
let menuClosing=false,menuTimer;
function openMenu(){if(menu.open)return;clearTimeout(menuTimer);menuClosing=false;header.classList.remove('nav-hidden');menu.showModal();menu.querySelector('.close-menu').focus({preventScroll:true});document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';requestAnimationFrame(()=>requestAnimationFrame(()=>menu.classList.add('is-open')));document.dispatchEvent(new Event('menuvisibilitychange'));}
function finishClose(){menu.close();menuClosing=false;document.body.classList.remove('menu-open');document.body.style.overflow='';toggle.setAttribute('aria-expanded','false');document.dispatchEvent(new Event('menuvisibilitychange'));}
function closeMenu(){if(!menu.open||menuClosing)return;menuClosing=true;menu.classList.remove('is-open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');if(reducedMotion.matches)finishClose();else menuTimer=setTimeout(finishClose,450);}
toggle.addEventListener('click',openMenu);menu.querySelector('.close-menu').addEventListener('click',closeMenu);
menu.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});menu.addEventListener('close',()=>{clearTimeout(menuTimer);menu.classList.remove('is-open');document.body.classList.remove('menu-open');document.body.style.overflow='';toggle.setAttribute('aria-expanded','false');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{const destination=new URL(a.href,location.href);if(destination.origin===location.origin){e.preventDefault();closeMenu();setTimeout(()=>{location.href=a.href},reducedMotion.matches?0:450);}else closeMenu();}));
let lastScroll=Math.max(0,window.scrollY),direction=0,travel=0,scrollFrame=0;
function updateNav(){scrollFrame=0;const y=Math.max(0,window.scrollY),delta=y-lastScroll;header.classList.toggle('is-scrolled',y>40);if(!menu.open&&Math.abs(delta)>1){const next=delta>0?1:-1;if(next!==direction){travel=0;direction=next;}travel+=Math.abs(delta);if(y<80)header.classList.remove('nav-hidden');else if(travel>12)header.classList.toggle('nav-hidden',direction>0);}lastScroll=y;}
window.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateNav)},{passive:true});updateNav();header.addEventListener('focusin',()=>header.classList.remove('nav-hidden'));
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{const g=b.closest('section').querySelector('.project-gallery');g.scrollBy({left:(g.querySelector('.project').getBoundingClientRect().width+parseFloat(getComputedStyle(g).columnGap))*Number(b.dataset.scroll),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}));
// Desktop galleries support dragging without treating a completed drag as a link click.
for(const gallery of document.querySelectorAll('.project-gallery')){
 const section=gallery.closest('section'),stage=gallery.closest('.gallery-stage');let drag=null,suppressUntil=0;
 const updateControls=()=>{const max=gallery.scrollWidth-gallery.clientWidth;for(const button of section.querySelectorAll('[data-scroll]'))button.disabled=Number(button.dataset.scroll)<0?gallery.scrollLeft<=2:gallery.scrollLeft>=max-2;stage?.style.setProperty('--gallery-cover-height',gallery.querySelector('.project-cover').getBoundingClientRect().height+'px')};
 gallery.addEventListener('dragstart',event=>event.preventDefault());
 gallery.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;event.preventDefault();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:gallery.scrollLeft,active:false};suppressUntil=0});
 gallery.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.active){if(Math.abs(dx)<6||Math.abs(dx)<=Math.abs(dy))return;drag.active=true;gallery.classList.add('is-dragging');gallery.setPointerCapture(event.pointerId)}event.preventDefault();gallery.scrollLeft=drag.left-dx;updateControls()});
 const finishDrag=event=>{if(!drag||event.pointerId!==drag.id)return;if(drag.active){suppressUntil=performance.now()+350;gallery.classList.remove('is-dragging');if(gallery.hasPointerCapture(event.pointerId))gallery.releasePointerCapture(event.pointerId)}drag=null;updateControls()};
 gallery.addEventListener('pointerup',finishDrag);gallery.addEventListener('pointercancel',finishDrag);gallery.addEventListener('lostpointercapture',finishDrag);
 gallery.addEventListener('click',event=>{if(event.detail>0&&performance.now()<suppressUntil){event.preventDefault();event.stopPropagation()}},true);
 gallery.addEventListener('scroll',updateControls,{passive:true});new ResizeObserver(updateControls).observe(gallery);new ResizeObserver(updateControls).observe(gallery.querySelector('.project-cover'));updateControls();
}
const playground=document.querySelector('#pixel-playground');
if(playground){
 const bodies=[];let size=195,w=0,h=0,drag=null,lastTime=0,frame=0,awake=false,visible=true,pointer={x:-9999,y:-9999,t:0};
 const layout=[[5,2],[4,2],[3,2],[2,2],[1,2],[0,2],[5,1],[4,1],[3,1],[2,1],[5,0],[4,0],[3,0]];
 function start(){if(!awake&&visible){awake=true;lastTime=performance.now();frame=requestAnimationFrame(tick)}}
 function reset(){w=playground.clientWidth;h=playground.clientHeight;size=Math.min(195,w/7.3,h/3.8);let gap=size*.2,step=size+gap,right=w-size-14,bottom=h-size-22;
 bodies.forEach((b,i)=>{const [col,row]=layout[i];b.x=right-(5-col)*step;b.y=bottom-(2-row)*step;b.vx=0;b.vy=0;b.angle=([5,9,12].includes(i)?(i===9?13:-13):0);b.spin=0;b.el.style.width=b.el.style.height=size+'px';b.el.style.borderWidth=Math.max(2,size*.03)+'px';b.el.style.setProperty('--handle',Math.max(7,size*.11)+'px');});paint();start()}
 function paint(){for(const b of bodies)b.el.style.transform=`translate(${b.x}px,${b.y}px) rotate(${b.angle}deg)`}
 for(let i=0;i<layout.length;i++){const el=document.createElement('button');el.className='pixel';el.setAttribute('aria-label',`Pixel ${i+1}. Drag to move, or press Enter to scatter.`);el.innerHTML='<span></span>';playground.append(el);const b={el,x:0,y:0,vx:0,vy:0,angle:0,spin:0};bodies.push(b);
 el.addEventListener('pointerdown',e=>{e.preventDefault();el.setPointerCapture(e.pointerId);const r=playground.getBoundingClientRect();drag={b,id:e.pointerId,ox:e.clientX-r.left-b.x,oy:e.clientY-r.top-b.y,px:e.clientX,py:e.clientY,t:performance.now()};el.style.zIndex='2';start()});
 el.addEventListener('pointermove',e=>{if(!drag||drag.b!==b)return;const r=playground.getBoundingClientRect(),now=performance.now(),dt=Math.max(8,now-drag.t);b.vx=Math.max(-35,Math.min(35,(e.clientX-drag.px)*16/dt));b.vy=Math.max(-35,Math.min(35,(e.clientY-drag.py)*16/dt));b.spin=b.vx*.11;b.x=Math.max(5,Math.min(w-size-5,e.clientX-r.left-drag.ox));b.y=Math.max(5,Math.min(h-size-5,e.clientY-r.top-drag.oy));Object.assign(drag,{px:e.clientX,py:e.clientY,t:now});paint()});
 const release=()=>{if(drag?.b===b){drag=null;el.style.zIndex='';start()}};el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
 el.addEventListener('keydown',e=>{if(['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();b.vx=e.key==='ArrowLeft'?-12:e.key==='ArrowRight'?12:(Math.random()-.5)*25;b.vy=e.key==='ArrowUp'?-12:e.key==='ArrowDown'?12:-15;b.spin=(Math.random()-.5)*5;start()}});
 }
 playground.addEventListener('pointermove',e=>{if(drag||e.pointerType==='touch')return;const r=playground.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,now=performance.now(),dt=Math.max(8,now-pointer.t);for(const b of bodies){const dx=b.x+size/2-x,dy=b.y+size/2-y,dist=Math.hypot(dx,dy);if(dist<size*.85){const speed=Math.min(15,Math.hypot(x-pointer.x,y-pointer.y)*16/dt);b.vx+=dx/(dist||1)*(2+speed*.45);b.vy+=dy/(dist||1)*(2+speed*.45);b.spin+=(dx>0?1:-1)*.4;}}pointer={x,y,t:now};start()});
 playground.addEventListener('pointerleave',()=>pointer={x:-9999,y:-9999,t:0});
 function tick(now){if(!visible){awake=false;return}let dt=Math.min(2,(now-lastTime)/16.67);lastTime=now;let energy=0;
 for(const b of bodies){if(drag?.b!==b){b.x+=b.vx*dt;b.y+=b.vy*dt;b.angle+=b.spin*dt;b.vx*=Math.pow(.965,dt);b.vy*=Math.pow(.965,dt);b.spin*=Math.pow(.96,dt)}const margin=size*.09;if(b.x<margin){b.x=margin;b.vx=Math.abs(b.vx)*.7}if(b.x>w-size-margin){b.x=w-size-margin;b.vx=-Math.abs(b.vx)*.7}if(b.y<margin){b.y=margin;b.vy=Math.abs(b.vy)*.7}if(b.y>h-size-margin){b.y=h-size-margin;b.vy=-Math.abs(b.vy)*.7}energy+=Math.abs(b.vx)+Math.abs(b.vy)+Math.abs(b.spin)}
 for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){let a=bodies[i],b=bodies[j],dx=b.x-a.x,dy=b.y-a.y,min=size*.96;if(Math.abs(dx)<min&&Math.abs(dy)<min){let overlapX=min-Math.abs(dx),overlapY=min-Math.abs(dy),axis=overlapX<overlapY?'x':'y',dir=(axis==='x'?dx:dy)>=0?1:-1,overlap=Math.min(overlapX,overlapY),v=axis==='x'?'vx':'vy';if(drag?.b!==a)a[axis]-=dir*overlap*.5;if(drag?.b!==b)b[axis]+=dir*overlap*.5;let impulse=((a[v]-b[v])*dir)*.55;if(impulse>0){if(drag?.b!==a)a[v]-=impulse*dir;if(drag?.b!==b)b[v]+=impulse*dir;a.spin-=dir*.12;b.spin+=dir*.12}}}
 paint();if(energy>.08||drag){frame=requestAnimationFrame(tick)}else awake=false;
 }
 document.querySelector('#reset-pixels').addEventListener('click',reset);new ResizeObserver(reset).observe(playground);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start()},{rootMargin:'150px'}).observe(playground);reset();
}


// A video only plays while its section is visible, including on return to the tab.
const viewportVideos=[...document.querySelectorAll('video[data-viewport-play]')],videoVisibility=new WeakMap();
function syncVideo(video){const visible=videoVisibility.get(video)&&!document.hidden&&!menu.open;if(visible){video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.play().catch(()=>{});}else video.pause();}
const videoObserver=new IntersectionObserver(entries=>{for(const entry of entries){videoVisibility.set(entry.target,entry.isIntersecting&&entry.intersectionRatio>=.15);syncVideo(entry.target)}},{threshold:[0,.15,.3]});
viewportVideos.forEach(video=>{video.muted=true;video.defaultMuted=true;videoObserver.observe(video);video.addEventListener('loadeddata',()=>syncVideo(video));});
for(const event of ['visibilitychange','menuvisibilitychange'])document.addEventListener(event,()=>viewportVideos.forEach(syncVideo));
// Restrained type reveals and image movement inspired by the reference portfolio.
if(document.body.classList.contains('home-page')&&!reducedMotion.matches){
const revealTargets=document.querySelectorAll('.statement>*,.work>small,.work>h2,.work>.gallery-stage,.gallery-controls,.about>small,.about h2,.about-row>*,.pixel-section>small,.pixel-section>h2,.contact>small,.contact-heading,.social,footer');
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-revealed');revealObserver.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -35px 0px'});
revealTargets.forEach((el,i)=>{el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',(i%2)*65+'ms');revealObserver.observe(el)});

const hero=document.querySelector('.hero');let heroVisible=true,parallaxFrame=0;new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting},{threshold:0}).observe(hero);
const updateHero=()=>{parallaxFrame=0;if(heroVisible)hero.style.setProperty('--hero-drift',Math.min(scrollY*.06,25)+'px')};window.addEventListener('scroll',()=>{if(heroVisible&&!parallaxFrame)parallaxFrame=requestAnimationFrame(updateHero)},{passive:true});
}


// Re-measure the display type when its container or fonts change, preserving both edges.
if(document.body.classList.contains('home-page')){const hero=document.querySelector('.hero');function fitHeroType(){for(const el of hero.querySelectorAll('h1,.design')){el.style.removeProperty('font-size');const allowed=hero.clientWidth;let size=parseFloat(getComputedStyle(el).fontSize);const measured=el.scrollWidth;if(measured>allowed){size*=allowed/measured;el.style.fontSize=size+'px';}}}fitHeroType();new ResizeObserver(fitHeroType).observe(hero);document.fonts.ready.then(fitHeroType);}
const mouseMedia=matchMedia('(hover:hover) and (pointer:fine)');
if(mouseMedia.matches&&!reducedMotion.matches){const pixel=document.createElement('div');pixel.className='cursor-pixel';pixel.setAttribute('aria-hidden','true');pixel.innerHTML='<span></span><span></span><span></span><span></span>';document.body.append(pixel);let x=0,y=0,targetX=0,targetY=0,frame=0,visible=false;
function paintCursor(){x+=(targetX-x)*.18;y+=(targetY-y)*.18;const angle=Math.max(-16,Math.min(16,(targetX-x)*.35));pixel.style.transform='translate3d('+x+'px,'+y+'px,0) rotate('+angle+'deg)';if(visible&&(Math.abs(targetX-x)+Math.abs(targetY-y)>.15))frame=requestAnimationFrame(paintCursor);else frame=0;}
function hideCursor(){visible=false;pixel.classList.remove('is-visible');if(frame)cancelAnimationFrame(frame);frame=0;}
function followCursor(e){if(e.pointerType!=='mouse')return;targetX=e.clientX+27;targetY=e.clientY+29;if(!visible){x=targetX;y=targetY;visible=true;pixel.classList.add('is-visible');}if(!frame)frame=requestAnimationFrame(paintCursor);}
document.addEventListener('pointermove',followCursor,{passive:true});document.addEventListener('pointerout',e=>{if(!e.relatedTarget)hideCursor()});window.addEventListener('blur',hideCursor);document.addEventListener('visibilitychange',()=>{if(document.hidden)hideCursor()});document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')hideCursor()});
// Modal dialogs live in the browser top layer, so move the same ornament with them.
document.addEventListener('menuvisibilitychange',()=>{(menu.open?menu:document.body).append(pixel)});mouseMedia.addEventListener('change',e=>{if(!e.matches)hideCursor()});reducedMotion.addEventListener('change',e=>{if(e.matches)hideCursor()});
}
// Explicit keyframes ensure the entrance runs even when a cached page paints in one frame.
if(document.body.classList.contains('home-page')){
 const hero=document.querySelector('.hero');let entranceAnimations=[];
 async function revealHero(){
  entranceAnimations.forEach(animation=>animation.cancel());
  if(reducedMotion.matches){document.documentElement.classList.remove('hero-pending');return;}
  document.body.classList.add('hero-entrance-running');
  const portrait=hero.querySelector('img');
  await Promise.race([Promise.all([document.fonts.ready,portrait.decode().catch(()=>{})]),new Promise(resolve=>setTimeout(resolve,2000))]);
  if(reducedMotion.matches){document.documentElement.classList.remove('hero-pending');document.body.classList.remove('hero-entrance-running');return;}
  const selectors=['.portrait','.welcome','h1','.design','.title'];
  entranceAnimations=selectors.map((selector,index)=>hero.querySelector(selector).animate([
   {opacity:0,transform:'translate3d(0,100px,0)',filter:'blur(5px)'},
   {opacity:1,transform:'translate3d(0,0,0)',filter:'blur(0px)'}
  ],{duration:1450,delay:160+index*110,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
  document.documentElement.classList.remove('hero-pending');
  await Promise.all(entranceAnimations.map(animation=>animation.finished.catch(()=>{})));
  entranceAnimations.forEach(animation=>animation.cancel());document.body.classList.remove('hero-entrance-running');
 }
 revealHero();window.addEventListener('pageshow',event=>{if(event.persisted)revealHero()});
 reducedMotion.addEventListener('change',event=>{if(event.matches){entranceAnimations.forEach(animation=>animation.cancel());document.documentElement.classList.remove('hero-pending');document.body.classList.remove('hero-entrance-running')}});
}

// Sample the real letter shapes; only the area brushed by the mouse turns into dust.
if(!reducedMotion.matches){
 const canvas=document.createElement('canvas');canvas.className='text-dust-canvas';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const context=canvas.getContext('2d');
 let ratio=1,frame=0,lastFrame=0;const particles=[],targets=[];
 function sizeCanvas(){ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);context.setTransform(ratio,0,0,ratio,0,0);targets.forEach(target=>target.samples=null);}
 for(const element of document.querySelectorAll('.home-page .hero h1,.home-page .hero .design,.contact-heading')){
  const ink=document.createElement('span');ink.className='dust-ink';
  const textNodes=[...element.childNodes].filter(node=>!(node.nodeType===1&&node.tagName==='SPAN'));
  textNodes.forEach(node=>ink.append(node));element.prepend(ink);
  const target={element,ink,samples:null,strength:0,x:0,y:0,lastMove:-1000,lastEmit:0,inside:false};targets.push(target);
  element.addEventListener('pointermove',event=>{if(reducedMotion.matches||document.body.classList.contains('hero-entrance-running')||(event.pointerType!=='mouse'&&target.touchId!==event.pointerId))return;
   if(target.touchId===event.pointerId&&Math.hypot(event.clientX-target.startX,event.clientY-target.startY)>7)target.touchMoved=true;
   const rect=ink.getBoundingClientRect();target.x=event.clientX-rect.left;target.y=event.clientY-rect.top;target.lastMove=performance.now();target.inside=true;target.strength=.98;
   if(!target.samples)sampleLetters(target);
   if(target.lastMove-target.lastEmit>22){emit(target);target.lastEmit=target.lastMove;}
   startDust();
  },{passive:true});
  element.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse')return;target.touchId=event.pointerId;target.startX=event.clientX;target.startY=event.clientY;target.touchMoved=false;element.setPointerCapture(event.pointerId)});
  const endTouch=event=>{if(target.touchId!==event.pointerId)return;target.touchId=null;target.inside=false;target.lastMove=-1000;startDust()};
  element.addEventListener('pointerup',endTouch);element.addEventListener('pointercancel',endTouch);element.addEventListener('lostpointercapture',endTouch);
  element.addEventListener('click',event=>{if(target.touchMoved){event.preventDefault();target.touchMoved=false}},true);
  element.addEventListener('pointerleave',()=>{target.inside=false;target.lastMove=-1000;startDust()});
 }
 function sampleLetters(target){
  const rect=target.ink.getBoundingClientRect(),buffer=document.createElement('canvas');buffer.width=Math.ceil(rect.width+4);buffer.height=Math.ceil(rect.height+8);const painter=buffer.getContext('2d',{willReadFrequently:true});
  if(!buffer.width||!buffer.height)return;const walker=document.createTreeWalker(target.ink,NodeFilter.SHOW_TEXT),range=document.createRange();let node;
  while(node=walker.nextNode()){
   const style=getComputedStyle(node.parentElement),fontSize=parseFloat(style.fontSize);painter.font=style.fontStyle+' '+style.fontWeight+' '+fontSize+'px '+style.fontFamily;painter.fillStyle=style.color;painter.textBaseline='alphabetic';
   for(let index=0;index<node.textContent.length;index++){
    const character=node.textContent[index];if(!character.trim())continue;range.setStart(node,index);range.setEnd(node,index+1);const glyph=range.getBoundingClientRect(),metrics=painter.measureText(character),ascent=metrics.fontBoundingBoxAscent||fontSize*.9,descent=metrics.fontBoundingBoxDescent||fontSize*.22;
    painter.fillText(character,glyph.left-rect.left,glyph.top-rect.top+(glyph.height-ascent-descent)/2+ascent);
   }
  }
  const {data}=painter.getImageData(0,0,buffer.width,buffer.height),points=[];const step=3;
  for(let y=0;y<buffer.height;y+=step)for(let x=0;x<buffer.width;x+=step){const i=(y*buffer.width+x)*4;if(data[i+3]>110)points.push({x,y,color:'rgb('+data[i]+','+data[i+1]+','+data[i+2]+')'});}
  target.samples=points;target.element.dataset.dustPoints=points.length;
 }
 function emit(target){
  const near=(target.samples||[]).filter(point=>Math.hypot(point.x-target.x,point.y-target.y)<78);if(!near.length)return;
  const count=Math.min(65,near.length),offset=Math.random()*near.length;
  for(let index=0;index<count;index++){
   const point=near[Math.floor((offset+index*near.length/count)%near.length)],dx=point.x-target.x,dy=point.y-target.y,distance=Math.hypot(dx,dy)||1,force=22+Math.random()*52;
   particles.push({target,x:point.x,y:point.y,color:point.color,dx:dx/distance*force+(Math.random()-.5)*25,dy:dy/distance*force-22-Math.random()*30,born:performance.now(),life:650+Math.random()*250,size:1+Math.random()*1.7});
  }
  if(particles.length>1200)particles.splice(0,particles.length-1200);
 }
 function startDust(){if(!frame&&!document.hidden&&!reducedMotion.matches)frame=requestAnimationFrame(paintDust);}
 function paintDust(now){
  frame=0;const dt=Math.min(3,(now-lastFrame)/16.67||1);lastFrame=now;context.clearRect(0,0,innerWidth,innerHeight);let active=false;const rects=new Map();
  for(const target of targets){
   const moving=target.inside&&now-target.lastMove<160,wanted=moving ? .97 : 0;target.strength+=(wanted-target.strength)*Math.min(1,.25*dt);
   if(target.strength>.015){const opacity=1-target.strength,mask='radial-gradient(circle at '+target.x+'px '+target.y+'px,rgba(0,0,0,'+opacity+') 0px,rgba(0,0,0,'+opacity+') 34px,#000 78px)';target.ink.style.maskImage=mask;target.ink.style.webkitMaskImage=mask;active=true;}
   else{target.strength=0;target.ink.style.removeProperty('mask-image');target.ink.style.removeProperty('-webkit-mask-image');}
  }
  for(let index=particles.length-1;index>=0;index--){const particle=particles[index],progress=(now-particle.born)/particle.life;if(progress>=1){particles.splice(index,1);continue;}let rect=rects.get(particle.target);if(!rect){rect=particle.target.ink.getBoundingClientRect();rects.set(particle.target,rect)}const excursion=Math.pow(Math.sin(progress*Math.PI),.8);context.globalAlpha=Math.min(1,(1-progress)*1.7)*.9;context.fillStyle=particle.color;context.fillRect(rect.left+particle.x+particle.dx*excursion,rect.top+particle.y+particle.dy*excursion,particle.size,particle.size);active=true;}
  canvas.dataset.particles=particles.length;context.globalAlpha=1;if(active)frame=requestAnimationFrame(paintDust);
 }
 function clearDust(){if(frame)cancelAnimationFrame(frame);frame=0;particles.length=0;context.clearRect(0,0,innerWidth,innerHeight);for(const target of targets){target.strength=0;target.inside=false;target.ink.style.removeProperty('mask-image');target.ink.style.removeProperty('-webkit-mask-image')}}
 sizeCanvas();window.addEventListener('resize',()=>{clearDust();sizeCanvas()},{passive:true});document.fonts.ready.then(()=>targets.forEach(target=>target.samples=null));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearDust()});document.addEventListener('menuvisibilitychange',()=>{if(menu.open)clearDust()});window.addEventListener('blur',clearDust);reducedMotion.addEventListener('change',event=>{if(event.matches)clearDust()});mouseMedia.addEventListener('change',event=>{if(!event.matches)clearDust()});
}
// Keep the Figma-style arrow directly under the mouse, separate from the eased pixel trail.
if(mouseMedia.matches){
 const pointer=document.createElement('div');pointer.className='figma-pointer';pointer.setAttribute('aria-hidden','true');const arrow=document.createElement('img');arrow.src='assets/figma-cursor.svg';arrow.alt='';arrow.width=32;arrow.height=32;pointer.append(arrow);document.body.append(pointer);let loaded=false;
 function hidePointer(){pointer.classList.remove('is-visible');document.documentElement.classList.remove('figma-cursor-active')}
 arrow.addEventListener('load',()=>loaded=true);if(arrow.complete&&arrow.naturalWidth)loaded=true;
 document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||!mouseMedia.matches){hidePointer();return;}if(!loaded)return;pointer.style.transform='translate3d('+(event.clientX-3)+'px,'+(event.clientY-3)+'px,0)';pointer.classList.add('is-visible');document.documentElement.classList.add('figma-cursor-active')},{passive:true});
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget)hidePointer()});window.addEventListener('blur',hidePointer);document.addEventListener('visibilitychange',()=>{if(document.hidden)hidePointer()});document.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse')hidePointer()});mouseMedia.addEventListener('change',event=>{if(!event.matches)hidePointer()});document.addEventListener('menuvisibilitychange',()=>{(menu.open?menu:document.body).append(pointer)});
}
