import {SiteContent,SiteRender} from './global/content.js';
import {Menu} from './global/navbar.js';
import {Portfolio} from './pages/our-work.js';
import {Motion,Experience} from './pages/home.js';
import {initCareer} from './pages/career.js';
// Brief page preparation indicator; bounded so a slow asset never blocks entry.
const loader=document.createElement('div');loader.className='vc-loader';loader.setAttribute('aria-hidden','true');loader.innerHTML='<div><strong>v<span>✳</span></strong><p>VELORA CODE</p><div class="vc-loader-count"><span>0</span><small>%</small></div><i></i></div>';document.body.append(loader);
const loaderNumber=loader.querySelector('.vc-loader-count span'),loaderBar=loader.querySelector('i');
const loaderStart=performance.now();let loaderReady=document.readyState==='complete',loaderProgress=0,loaderFinished=false;
addEventListener('load',()=>{loaderReady=true;},{once:true});
const clearLoader=()=>{if(loaderFinished)return;loaderFinished=true;loaderNumber.textContent='100';loaderBar.style.transform='scaleX(1)';setTimeout(()=>{loader.classList.add('vc-loader-done');setTimeout(()=>loader.remove(),600);},350);};
const updateLoader=now=>{if(loaderFinished)return;const elapsed=now-loaderStart;const target=loaderReady?Math.min(100,elapsed/40):Math.min(92,elapsed/45);loaderProgress=Math.max(loaderProgress,target);loaderNumber.textContent=String(Math.floor(loaderProgress));loaderBar.style.transform='scaleX('+(loaderProgress/100)+')';if(loaderProgress>=100||elapsed>=5000)clearLoader();else requestAnimationFrame(updateLoader);};
requestAnimationFrame(updateLoader);setTimeout(clearLoader,5200);
// js/theme.js
// Light/dark choice is shared across all pages.
const Theme = {
  init() {
    let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    try { theme = localStorage.getItem('velora-theme') || theme; } catch (_) {}
    this.set(theme);
    document.querySelector('.vc-theme').addEventListener('click', () => this.set(document.body.dataset.theme === 'light' ? 'dark' : 'light'));
  },
  set(theme) {
    const selected = theme === 'dark' ? 'dark' : 'light';
    document.body.dataset.theme = selected;
    const button = document.querySelector('.vc-theme');
    button.firstElementChild.textContent = selected === 'light' ? '☾' : '☀';
    button.setAttribute('aria-label', `Switch to ${selected === 'light' ? 'dark' : 'light'} theme`);
    try { localStorage.setItem('velora-theme', selected); } catch (_) {}
  }
};

// js/dialogs.js
const Dialogs = {
  init() {
    const dialog = document.querySelector('#detail-dialog');
    document.querySelector('.vc-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-service], [data-contact]');
      if (!button) return;
      if ('service' in button.dataset) {
        const service = SiteContent.services[button.dataset.service];
        SiteRender.dialog(`<p class="vc-eyebrow">HOW WE CAN HELP</p><h2 id="dialog-title">${service.title}</h2><p>${service.text}</p><p>${service.tags}</p><button class="vc-button" data-contact>Let’s talk about it <span>↗</span></button>`);
      } else {
        dialog.close();
        this.contact();
      }
    });
  },
  contact() {
    SiteRender.dialog(`<p class="vc-eyebrow">LET’S MAKE SOMETHING GOOD</p><h2 id="dialog-title">Tell us what’s<br>on your mind.</h2><p>A website, a new brand, or an idea you haven’t quite figured out yet. Start with a few details.</p><form id="contact-form"><label>Your name<input name="name" autocomplete="name" required placeholder="Alex Morgan" maxlength="100"></label><label>Your email<input name="email" type="email" autocomplete="email" required placeholder="you@company.com" maxlength="150"></label><label>A little about your project<textarea name="project" required placeholder="I have an idea for…" rows="4" maxlength="3000"></textarea></label><button class="vc-button" type="submit">${SiteContent.contactEmail ? 'Prepare email' : 'Preview my message'} <span>↗</span></button><p class="vc-form-note">${SiteContent.contactEmail ? 'Opens your email app with a draft. You choose when to send.' : 'Preview mode — your information stays in this browser and is not sent.'}</p><p id="contact-status" role="status"></p></form>`);
    document.querySelector('#contact-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const message = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('project')}`;
      if (SiteContent.contactEmail) location.href = `mailto:${encodeURIComponent(SiteContent.contactEmail)}?subject=${encodeURIComponent('A new project for Velora Code')}&body=${encodeURIComponent(message)}`;
      document.querySelector('#contact-status').textContent = SiteContent.contactEmail ? 'Your email draft is ready in your email app.' : `Your message preview (not sent):\n\n${message}`;
    });
  }
};

// js/main.js
// Shared entry point: each feature lives in its own small file.
SiteRender.render(SiteContent);
Theme.init();
Menu.init();
Portfolio.init();
Dialogs.init();
Motion.init();
Experience.init();

// Newsletter handoff and real company details are configured above.
const newsletter=document.querySelector('#newsletter-form');
if(newsletter)newsletter.addEventListener('submit',e=>{e.preventDefault();const status=document.querySelector('#newsletter-status');if(SiteContent.newsletterUrl){location.href=SiteContent.newsletterUrl;}else{status.textContent='Newsletter signup is not open yet. Please check back soon. Your email has not been saved.';}});
const details=document.querySelector('.vc-contact-details');
if(details){const rows=details.querySelectorAll('a,p');if(SiteContent.contactEmail){rows[0].href='mailto:'+SiteContent.contactEmail;rows[0].lastChild.textContent=' '+SiteContent.contactEmail;}if(SiteContent.contactPhone)rows[1].lastChild.textContent=' '+SiteContent.contactPhone;if(SiteContent.location)rows[2].lastChild.textContent=' '+SiteContent.location;}
const reviewPanel=document.querySelector('#client-reviews');
if(reviewPanel){
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const real=SiteContent.reviews.length>0;
 const entries=real?SiteContent.reviews:Array.from({length:6},(_,i)=>({quote:'Your client’s words belong here.',name:'Client review '+String(i+1).padStart(2,'0'),company:'Awaiting an approved quote'}));
 reviewPanel.classList.add('vc-review-collection');reviewPanel.hidden=false;
 reviewPanel.innerHTML='<header class="vc-review-heading"><div><p class="vc-eyebrow">CLIENT PERSPECTIVES</p><h2>Different stories.<br><span class="vc-gradient">Shared confidence.</span></h2></div><p>'+(real?'In their words. A closer look at the people behind the projects.':'Review layout preview — these six spaces are ready for your real customer quotes.')+'</p></header><div class="vc-review-grid">'+entries.map((r,i)=>'<article class="vc-client-note"><div class="vc-note-top"><span>'+String(i+1).padStart(2,'0')+' / CLIENT PERSPECTIVE</span><i aria-hidden="true">↗</i></div><blockquote>'+escape(r.quote)+'</blockquote><footer><span class="vc-client-monogram" aria-hidden="true">'+(real?escape(r.name.trim().split(/\s+/).map(s=>s[0]).slice(0,2).join('')):'VC')+'</span><div><strong>'+escape(r.name)+'</strong><p>'+escape(r.company)+'</p></div></footer></article>').join('')+'</div>';
}
document.querySelectorAll('.vc-studio-strip').forEach(strip=>strip.querySelectorAll('span').forEach(s=>{s.innerHTML=s.textContent.split('✳').map(t=>t.trim()?'<b>'+t.trim()+'</b><i>✳</i>':'').join('');}));

// An overlapping deck: the front review lifts away and returns to the back.
const reviewRail=document.querySelector('.vc-review-grid');
if(reviewRail){
 const cards=[...reviewRail.children],count=cards.length;
 reviewRail.classList.add('vc-review-deck');reviewRail.tabIndex=0;
 reviewRail.setAttribute('role','region');reviewRail.setAttribute('aria-label','Customer reviews. Swipe or use left and right arrow keys to browse.');
 const hint=document.createElement('p');hint.className='vc-review-hint';hint.innerHTML='<span>SWIPE TO EXPLORE</span><span class="vc-review-position"></span>';reviewRail.after(hint);
 let current=0,drag=null,distance=0,busy=false;
 const quiet=matchMedia('(prefers-reduced-motion:reduce)');
 const paint=()=>{cards.forEach((card,i)=>{const layer=(i-current+count)%count;card.style.zIndex=count-layer;card.style.opacity=layer<3?'1':'0';card.style.transform='translate3d(0,'+(layer*18)+'px,'+(-layer*45)+'px) scale('+(1-layer*.045)+') rotate('+(layer===0?0:layer%2?-2:2)+'deg)';card.style.pointerEvents=layer===0?'auto':'none';card.inert=layer!==0;card.setAttribute('aria-hidden',String(layer!==0));});hint.lastChild.textContent=String(current+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');};
 const turn=async direction=>{if(busy||count<2)return;busy=true;const card=cards[current];if(!quiet.matches){await card.animate([{transform:card.style.transform,opacity:1},{transform:'translate3d('+(direction*115)+'%, -25px, 80px) rotate('+(direction*15)+'deg)',opacity:0}],{duration:380,easing:'cubic-bezier(.3,.7,.2,1)',fill:'forwards'}).finished.catch(()=>{});}current=(current+1)%count;card.getAnimations().forEach(a=>a.cancel());paint();busy=false;};
 reviewRail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(e.key==='ArrowRight'?-1:1);}});
 reviewRail.addEventListener('pointerdown',e=>{if(busy||(e.pointerType==='mouse'&&e.button!==0))return;drag=e.clientX;distance=0;reviewRail.setPointerCapture(e.pointerId);reviewRail.classList.add('vc-dragging');});
 reviewRail.addEventListener('pointermove',e=>{if(drag===null||busy)return;distance=e.clientX-drag;cards[current].style.transform='translate3d('+distance+'px,0,30px) rotate('+(quiet.matches?0:distance/22)+'deg)';});
 const release=cancel=>{if(drag===null)return;drag=null;reviewRail.classList.remove('vc-dragging');if(!cancel&&Math.abs(distance)>Math.min(65,reviewRail.clientWidth*.18))turn(distance<0?-1:1);else paint();};
 reviewRail.addEventListener('pointerup',()=>release(false));reviewRail.addEventListener('pointercancel',()=>release(true));reviewRail.addEventListener('lostpointercapture',()=>release(true));
 const measure=()=>reviewRail.style.height=(Math.max(...cards.map(c=>c.offsetHeight))+50)+'px';new ResizeObserver(measure).observe(reviewRail);paint();measure();
}

// A ring follows the mouse; its smaller dot eases towards the ring.
const cursorMedia=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
const ring=document.createElement('span'),dot=document.createElement('span');ring.className='vc-cursor-ring';dot.className='vc-cursor-dot';[ring,dot].forEach(el=>{el.setAttribute('aria-hidden','true');document.body.append(el);});
let cursorFrame=0,cursorActive=false,mx=0,my=0,rx=0,ry=0,dx=0,dy=0;
const cursorPaint=()=>{rx+=(mx-rx)*.3;ry+=(my-ry)*.3;dx+=(rx-dx)*.1;dy+=(ry-dy)*.1;ring.style.transform='translate3d('+rx+'px,'+ry+'px,0) translate(-50%,-50%)';dot.style.transform='translate3d('+dx+'px,'+dy+'px,0) translate(-50%,-50%)';if(cursorActive&&(Math.abs(mx-dx)+Math.abs(my-dy)>.1))cursorFrame=requestAnimationFrame(cursorPaint);else{dot.style.transform=ring.style.transform;cursorFrame=0;}};
const hideCursor=()=>{cursorActive=false;document.body.classList.remove('vc-cursor-active');cancelAnimationFrame(cursorFrame);cursorFrame=0;};
document.addEventListener('pointermove',e=>{if(!cursorMedia.matches||e.pointerType!=='mouse'){hideCursor();return;}mx=e.clientX;my=e.clientY;if(!cursorActive){rx=dx=mx;ry=dy=my;cursorActive=true;document.body.classList.add('vc-cursor-active');}ring.classList.toggle('vc-cursor-hover',!!e.target.closest('a,button,input,textarea,.vc-review-loop'));if(!cursorFrame)cursorFrame=requestAnimationFrame(cursorPaint);},{passive:true});
document.documentElement.addEventListener('pointerleave',hideCursor);window.addEventListener('blur',hideCursor);cursorMedia.addEventListener('change',hideCursor);document.addEventListener('visibilitychange',()=>{if(document.hidden)hideCursor();});

initCareer();
