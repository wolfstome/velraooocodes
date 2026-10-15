// js/menu.js
const Menu = {
  open:false, rotation:0,
  init() {
    this.button=document.querySelector('.vc-menu');
    this.nav=document.querySelector('#navigation');
    this.mobile=matchMedia('(max-width:900px)');
    this.button.addEventListener('click',()=>this.set(!this.open));
    const page=location.pathname.split('/').pop() || 'index.html';
    this.nav.querySelectorAll('a').forEach((link,index)=>{
      link.style.setProperty('--link-order',index);
      if(new URL(link.href).pathname.split('/').pop()===page) link.setAttribute('aria-current','page');
      link.addEventListener('click',()=>this.set(false,false));
    });
    this.initWheel();
    this.mobile.addEventListener('change',()=>{this.set(false,false);this.paintWheel();});
    this.set(false,false);
    document.addEventListener('keydown',event=>{
      if(!this.open) return;
      if(event.key==='Escape') this.set(false);
      if(event.key==='Tab') {
        const elements=[...document.querySelectorAll('.vc-header a,.vc-header button')].filter(el=>el.getClientRects().length && !el.closest('[inert]'));
        const first=elements[0],last=elements.at(-1);
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
        if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
      }
    });
    document.addEventListener('click',event=>{if(this.open && !event.target.closest('.vc-header')) this.set(false);});
  },
  set(open,restore=true) {
    const next=open && this.mobile.matches;
    this.button.style.transform=next?'rotate(90deg)':'';
    this.open=next;
    this.nav.classList.toggle('vc-is-open',next);
    this.nav.inert=this.mobile.matches && !next;
    this.button.setAttribute('aria-expanded',String(next));
    this.button.setAttribute('aria-label',next?'Close menu':'Open menu');
    document.body.classList.toggle('vc-menu-open',next);
    document.querySelector('main').inert=next;
    document.querySelector('.vc-footer').inert=next;
    this.paintWheel();
    if(!next && restore) this.button.focus();
  },
  initWheel() {
    this.links=[...this.nav.querySelectorAll('a')];this.turn=0;
    const controls=document.createElement('div');controls.className='vc-wheel-controls';
    controls.innerHTML='<p>SWIPE TO EXPLORE</p><span aria-live="polite"></span>';
    this.nav.append(controls);this.counter=controls.querySelector('span');
    const move=amount=>{this.turn+=amount;this.paintWheel();};
    this.nav.addEventListener('wheel',e=>{if(!this.open)return;e.preventDefault();move(Math.max(-.45,Math.min(.45,(e.deltaY+e.deltaX)/180)));},{passive:false});
    let start=null,moved=false;
    this.nav.addEventListener('pointerdown',e=>{if(!this.open||e.target.closest('button'))return;start={x:e.clientX,y:e.clientY};moved=false;});
    this.nav.addEventListener('pointermove',e=>{if(!start)return;const delta=(e.clientY-start.y)+(e.clientX-start.x);if(Math.abs(delta)>3){moved=true;move(-delta/100);start={x:e.clientX,y:e.clientY};}});
    const end=()=>{start=null;};window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);
    this.nav.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false;}},true);
    this.nav.addEventListener('keydown',e=>{if(!this.open)return;if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();move(['ArrowDown','ArrowRight'].includes(e.key)?1:-1);this.links[((Math.round(this.turn)%this.links.length)+this.links.length)%this.links.length].focus();}});
    new ResizeObserver(()=>this.paintWheel()).observe(this.nav);
  },
  paintWheel() {
    if(!this.links)return;
    const n=this.links.length,size=this.nav.clientWidth;
    this.links.forEach((link,i)=>{
      if(!this.mobile.matches){link.removeAttribute('style');link.removeAttribute('tabindex');link.removeAttribute('aria-hidden');return;}
      const offset=((i-this.turn+n*1000+n/2)%n)-n/2,angle=(135+offset*30)*Math.PI/180,visible=Math.abs(offset)<1.45;
      link.style.setProperty('--wheel-x',(size+Math.cos(angle)*size*.67)+'px');link.style.setProperty('--wheel-y',(Math.sin(angle)*size*.67)+'px');
      link.style.setProperty('--wheel-opacity',visible?'1':'0');link.style.visibility=visible?'visible':'hidden';link.tabIndex=visible?0:-1;link.setAttribute('aria-hidden',String(!visible));
    });
    this.counter.textContent=(((Math.round(this.turn)%n)+n)%n+1)+' / '+n;
  }
};


export {Menu};
