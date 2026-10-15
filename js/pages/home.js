import {SiteContent} from '../global/content.js';
// js/motion.js
// Small native animations: no animation library required.
const Motion = {
  init() {
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const items=[...document.querySelectorAll('.vc-service,.vc-studio-chapters article')];
    const counts=[...document.querySelectorAll('[data-count]')];
    const finish=()=>{items.forEach(el=>el.classList.add('vc-in-view'));counts.forEach(el=>el.textContent=el.dataset.count);};
    if(reduced.matches || !('IntersectionObserver' in window)){finish();}
    else {
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        entry.target.classList.add('vc-in-view');observer.unobserve(entry.target);
      }),{threshold:.15});
      items.forEach(item=>{const order=[...item.parentElement.children].indexOf(item);item.classList.add('vc-reveal');item.style.setProperty('--reveal-delay',`${order*110}ms`);observer.observe(item);});
      const stats=document.querySelector('#hero-stats');
      if(stats){const counterObserver=new IntersectionObserver(entries=>{
        if(!entries.some(e=>e.isIntersecting))return;
        counterObserver.disconnect();const start=performance.now();
        const tick=now=>{const progress=Math.min((now-start)/1700,1);const eased=1-Math.pow(1-progress,3);counts.forEach(el=>el.textContent=Math.round(Number(el.dataset.count)*eased));if(progress<1&&!reduced.matches)requestAnimationFrame(tick);else counts.forEach(el=>el.textContent=el.dataset.count);};requestAnimationFrame(tick);
      },{threshold:.35});counterObserver.observe(stats);}
      reduced.addEventListener('change',event=>{if(event.matches){observer.disconnect();finish();}});
    }
    document.querySelectorAll('[data-service-scroll]').forEach(button=>button.addEventListener('click',()=>{
      const list=document.querySelector('#service-list'),card=list.querySelector('article');
      list.scrollBy({left:Number(button.dataset.serviceScroll)*(card.getBoundingClientRect().width+16),behavior:reduced.matches?'instant':'smooth'});
    }));
  }
};

const Experience={init(){
const quiet=matchMedia('(prefers-reduced-motion: reduce)').matches;
const demo=new URLSearchParams(location.search).get('preview')==='1';
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const metrics=document.querySelector('#company-metrics');
const data=SiteContent.stats.length?SiteContent.stats:(demo?[{value:100,suffix:'+',label:'Happy customers'},{value:150,suffix:'+',label:'Completed projects'},{value:12,suffix:'',label:'Team members'}]:[]);
if(metrics&&data.length){metrics.hidden=false;metrics.innerHTML='<p class="vc-eyebrow">THE PEOPLE. THE WORK. THE NUMBERS.</p>'+(demo?'<p class="vc-preview-note">DESIGN PREVIEW — SAMPLE FIGURES</p>':'')+'<div class="vc-metrics-line">'+data.map(s=>'<div><strong><span data-metric="'+Number(s.value)+'">0</span>'+safe(s.suffix||'')+'</strong><p>'+safe(s.label)+'</p></div>').join('')+'</div>';const nums=[...metrics.querySelectorAll('[data-metric]')];const run=()=>{const start=performance.now();const tick=t=>{const p=quiet?1:Math.min(1,(t-start)/1800);nums.forEach(n=>n.textContent=Math.round(Number(n.dataset.metric)*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);};if(quiet)run();else{const o=new IntersectionObserver(e=>{if(e.some(x=>x.isIntersecting)){o.disconnect();run();}},{threshold:.25});o.observe(metrics);}}
const reviews=document.querySelector('#client-reviews');const voices=SiteContent.reviews.length?SiteContent.reviews:(demo?[{quote:'The finished website feels like our business. Clear, considered, and easy for our customers to use.',name:'Example customer',company:'Sample quote for layout preview'}]:[]);
if(reviews&&voices.length){reviews.hidden=false;reviews.innerHTML='<div><p class="vc-eyebrow">IN OUR CLIENTS’ WORDS</p><h2>Good work.<br><span class="vc-gradient">Better relationships.</span></h2>'+(demo?'<p class="vc-preview-note">DESIGN PREVIEW — ILLUSTRATIVE QUOTES</p>':'')+'</div><div><div id="review-copy" aria-live="polite"></div><div class="vc-review-controls"><span id="review-count"></span><div><button id="review-prev" aria-label="Previous review">←</button><button id="review-next" aria-label="Next review">→</button></div></div></div>';let i=0;const show=()=>{const r=voices[i];document.querySelector('#review-copy').innerHTML='<blockquote>“'+safe(r.quote)+'”</blockquote><p>'+safe(r.name)+' · '+safe(r.company)+'</p>';document.querySelector('#review-count').textContent=(i+1)+' / '+voices.length;if(!quiet)document.querySelector('#review-copy').animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'none'}],{duration:450});};document.querySelector('#review-prev').onclick=()=>{i=(i-1+voices.length)%voices.length;show();};document.querySelector('#review-next').onclick=()=>{i=(i+1)%voices.length;show();};show();}
if(reviews&&!voices.length){reviews.hidden=false;reviews.innerHTML='<div><p class="vc-eyebrow">CLIENT PERSPECTIVES</p><h2>Good work.<br><span class="vc-gradient">Better relationships.</span></h2></div><div class="vc-review-invitation"><p>Have we worked together?</p><h3>We’d love to hear<br>your side of the story.</h3><button class="vc-text-link" data-contact>Share your experience <span>↗</span></button></div>';}
const steps=[...document.querySelectorAll('#process-list article')];
const processBand=document.querySelector('.vc-process-band');
if(processBand&&steps.length&&!quiet){
 processBand.classList.add('vc-process-scroll');
 const progress=document.createElement('div');progress.className='vc-process-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML=steps.map((s,i)=>'<span><i>0'+(i+1)+'</i><b>'+s.querySelector('h3').textContent+'</b><em></em></span>').join('');document.querySelector('#process-list').append(progress);
 const paint=()=>{const rect=processBand.getBoundingClientRect(),travel=processBand.offsetHeight-innerHeight,raw=Math.max(0,Math.min(3.999,-rect.top/Math.max(1,travel)*4)),base=Math.floor(raw),t=Math.max(0,(raw-base-.6)/.4),p=base===3?3:base+t*t*(3-2*t);steps.forEach((s,i)=>{const d=i-p;s.style.transform='translateX('+(d*110)+'%)';s.style.opacity=String(Math.max(0,1-Math.abs(d)));s.inert=Math.abs(d)>.55;s.setAttribute('aria-hidden',String(Math.abs(d)>.55));});progress.querySelectorAll('span').forEach((s,i)=>s.classList.toggle('vc-current',i===Math.round(p)));};
 let queued=false;addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;paint();});}},{passive:true});addEventListener('resize',paint);paint();
}
const chapters=document.querySelectorAll('.vc-studio-chapters article');const co=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('vc-chapter-active',e.isIntersecting)),{rootMargin:'-35% 0px -10% 0px',threshold:.1});chapters.forEach(s=>co.observe(s));
const form=document.querySelector('#footer-enquiry');if(form){const status=document.querySelector('#footer-status');status.textContent=SiteContent.contactEmail?'Opens a draft in your email app.':'Email delivery awaits your business address. Your message can be prepared locally.';form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);const msg='From: '+f.get('email')+'\n\n'+f.get('message');if(SiteContent.contactEmail){location.href='mailto:'+encodeURIComponent(SiteContent.contactEmail)+'?subject=Velora%20Code%20project&body='+encodeURIComponent(msg);}else status.textContent='Message prepared, not sent:\n'+msg;};}
const up=document.querySelector('.vc-back-top'), menuButton=document.querySelector('.vc-menu'), navPanel=document.querySelector('#navigation');
let scrollFrame=0;
const updateScroll=()=>{scrollFrame=0;if(up){const visible=scrollY>450;up.classList.toggle('vc-up-visible',visible);up.tabIndex=visible?0:-1;up.style.setProperty('--page-progress',(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*360)+'deg');}};
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);},{passive:true});updateScroll();
document.querySelectorAll('.vc-back-top').forEach(a=>a.onclick=e=>{e.preventDefault();scrollTo({top:0,behavior:quiet?'instant':'smooth'});});
}};


export {Motion,Experience};
