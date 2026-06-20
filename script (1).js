/* ============================================================
   NOVARA — interactions & animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------------- LOADER ---------------- */
(function loader(){
  const loaderEl = document.getElementById('loader');
  const ring = document.querySelector('.loader-ring-fg');
  const percentEl = document.getElementById('loaderPercent');
  const circumference = 276;
  let progress = 0;

  const interval = setInterval(()=>{
    progress += Math.random()*18;
    if(progress >= 100){
      progress = 100;
      clearInterval(interval);
      ring.style.strokeDashoffset = 0;
      percentEl.textContent = '100%';
      setTimeout(()=>{
        loaderEl.classList.add('done');
        document.body.style.overflow = 'auto';
        initPageAnimations();
      }, 350);
    } else {
      ring.style.strokeDashoffset = circumference - (circumference*progress/100);
      percentEl.textContent = Math.floor(progress) + '%';
    }
  }, 180);
})();

/* ---------------- LENIS SMOOTH SCROLL ---------------- */
let lenis;
if(window.Lenis){
  lenis = new Lenis({ lerp:0.09, smoothWheel:true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time)=>{ lenis.raf(time*1000); });
  gsap.ticker.lagSmoothing(0);
}

/* ---------------- CUSTOM CURSOR ---------------- */
(function cursor(){
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const spotlight = document.getElementById('spotlight');
  let mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;

  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    spotlight.style.left = mx+'px'; spotlight.style.top = my+'px';
  });

  function loop(){
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('[data-cursor="link"], a, button, .filter-btn, .testi-dots span').forEach(el=>{
    el.addEventListener('mouseenter', ()=>ring.classList.add('active'));
    el.addEventListener('mouseleave', ()=>ring.classList.remove('active'));
  });
})();

/* ---------------- PARTICLES CANVAS ---------------- */
(function particles(){
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let w,h,particlesArr=[];
  const colors = ['#00F5FF','#7B61FF','#FF4D8D'];
  let mouse = { x:null, y:null };

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e)=>{ mouse.x = e.clientX; mouse.y = e.clientY; });

  function Particle(){
    this.x = Math.random()*w;
    this.y = Math.random()*h;
    this.r = Math.random()*1.8+0.6;
    this.vx = (Math.random()-0.5)*0.25;
    this.vy = (Math.random()-0.5)*0.25;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.alpha = Math.random()*0.5+0.2;
  }
  const count = window.innerWidth < 768 ? 45 : 100;
  for(let i=0;i<count;i++) particlesArr.push(new Particle());

  function animate(){
    ctx.clearRect(0,0,w,h);
    particlesArr.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(mouse.x!=null){
        const dx = p.x-mouse.x, dy = p.y-mouse.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 130){
          p.x += dx/dist*0.6; p.y += dy/dist*0.6;
        }
      }
      if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---------------- NAVBAR ---------------- */
(function navbar(){
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const underline = document.getElementById('navUnderline');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', ()=>{
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  function moveUnderline(el){
    if(!el) return;
    underline.style.width = el.offsetWidth+'px';
    underline.style.left = el.offsetLeft+'px';
  }

  links.forEach(link=>{
    link.addEventListener('mouseenter', ()=>moveUnderline(link));
    link.addEventListener('mouseleave', ()=>moveUnderline(document.querySelector('.nav-link.active')));
    link.addEventListener('click', ()=>{
      links.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  setTimeout(()=>moveUnderline(document.querySelector('.nav-link.active')), 600);

  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec=>{
    ScrollTrigger.create({
      trigger:sec, start:'top 50%', end:'bottom 50%',
      onEnter:()=>setActive(sec.id), onEnterBack:()=>setActive(sec.id)
    });
  });
  function setActive(id){
    links.forEach(l=>l.classList.toggle('active', l.dataset.section===id));
    moveUnderline(document.querySelector('.nav-link.active'));
  }

  burger.addEventListener('click', ()=>{
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(l=>{
    l.addEventListener('click', ()=>{
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
})();

/* ---------------- SCROLL PROGRESS ---------------- */
(function progress(){
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const pct = (window.scrollY)/(h.scrollHeight-h.clientHeight)*100;
    bar.style.width = pct+'%';
  });
})();

/* ---------------- MAGNETIC BUTTONS ---------------- */
(function magnetic(){
  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      gsap.to(btn, { x:x*0.3, y:y*0.4, duration:0.4, ease:'power3.out' });
    });
    btn.addEventListener('mouseleave', ()=>{
      gsap.to(btn, { x:0, y:0, duration:0.5, ease:'elastic.out(1,0.4)' });
    });
    btn.addEventListener('click', (e)=>{
      const ripple = document.createElement('span');
      ripple.className='ripple';
      const r = btn.getBoundingClientRect();
      ripple.style.left = (e.clientX-r.left)+'px';
      ripple.style.top = (e.clientY-r.top)+'px';
      ripple.style.width = ripple.style.height = '10px';
      btn.appendChild(ripple);
      setTimeout(()=>ripple.remove(), 650);
    });
  });
})();

/* ---------------- TILT CARDS ---------------- */
(function tilt(){
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width - 0.5;
      const py = (e.clientY-r.top)/r.height - 0.5;
      gsap.to(card, { rotateY:px*10, rotateX:-py*10, duration:0.4, ease:'power2.out', transformPerspective:600 });
    });
    card.addEventListener('mouseleave', ()=>{
      gsap.to(card, { rotateY:0, rotateX:0, duration:0.6, ease:'power3.out' });
    });
  });
})();

/* ---------------- HERO PARALLAX ---------------- */
(function heroParallax(){
  const floats = document.querySelectorAll('.hero-float');
  window.addEventListener('mousemove', (e)=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2;
    const dx = (e.clientX-cx)/cx, dy = (e.clientY-cy)/cy;
    floats.forEach(f=>{
      const depth = parseFloat(f.dataset.depth)||0.5;
      gsap.to(f, { x:dx*30*depth, y:dy*30*depth, duration:0.6, ease:'power2.out' });
    });
    gsap.to('.hero-glow', { x:dx*40, y:dy*40, duration:0.8, ease:'power2.out' });
  });
})();

/* ---------------- PAGE ANIMATIONS (after loader) ---------------- */
function initPageAnimations(){

  /* Hero title split-reveal */
  gsap.set('.hero-title .word', { y:'110%', opacity:0 });
  gsap.to('.hero-title .word', { y:0, opacity:1, duration:1, ease:'power4.out', stagger:0.06, delay:0.1 });

  gsap.utils.toArray('.hero-eyebrow, .hero-subtitle, .hero-actions').forEach((el,i)=>{
    gsap.fromTo(el, { y:30, opacity:0 }, { y:0, opacity:1, duration:0.9, ease:'power3.out', delay:0.5+i*0.12 });
  });

  /* Generic reveal-on-scroll for [data-reveal] (excluding hero ones already handled) */
  gsap.utils.toArray('[data-reveal]').forEach(el=>{
    if(el.closest('.hero')) return;
    gsap.fromTo(el, { y:40, opacity:0 }, {
      y:0, opacity:1, duration:0.9, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    });
  });

  /* Stagger children in grids */
  gsap.utils.toArray('.services-grid, .skills-grid, .about-stats').forEach(grid=>{
    gsap.from(grid.children, {
      y:30, opacity:0, duration:0.7, ease:'power3.out', stagger:0.1,
      scrollTrigger:{ trigger:grid, start:'top 85%' }
    });
  });

  /* Counters */
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger:el, start:'top 90%', once:true,
      onEnter:()=>{
        gsap.to(el, {
          textContent:target, duration:1.6, ease:'power2.out', snap:'textContent',
          onUpdate(){ el.textContent = Math.floor(el.textContent); }
        });
      }
    });
  });

  /* Skill rings */
  document.querySelectorAll('.skill-ring').forEach(ring=>{
    const value = parseFloat(ring.dataset.value);
    const circle = ring.querySelector('.ring-fg');
    const numEl = ring.querySelector('.skill-num');
    const circumference = 2*Math.PI*60;
    ScrollTrigger.create({
      trigger:ring, start:'top 85%', once:true,
      onEnter:()=>{
        circle.style.strokeDashoffset = circumference - (circumference*value/100);
        gsap.to(numEl, { textContent:value, duration:1.6, ease:'power2.out', snap:'textContent',
          onUpdate(){ numEl.textContent = Math.floor(numEl.textContent); } });
      }
    });
  });

  /* Section title fade-left/right alternation for variety */
  gsap.utils.toArray('.section-title').forEach((el,i)=>{
    gsap.fromTo(el, { x: i%2===0 ? -30 : 30, opacity:0 }, {
      x:0, opacity:1, duration:0.9, ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    });
  });

  ScrollTrigger.refresh();
}

/* ---------------- WORK RAIL: drag + filter ---------------- */
(function workRail(){
  const rail = document.getElementById('workRail');
  const wrap = rail.parentElement;
  let isDown=false, startX, scrollLeft;

  wrap.addEventListener('mousedown', (e)=>{
    isDown = true; wrap.style.cursor='grabbing';
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  ['mouseleave','mouseup'].forEach(evt=>wrap.addEventListener(evt, ()=>{ isDown=false; wrap.style.cursor='grab'; }));
  wrap.addEventListener('mousemove', (e)=>{
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x-startX)*1.4;
  });

  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.work-card').forEach(card=>{
        const show = filter==='all' || card.dataset.cat===filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();

/* ---------------- TESTIMONIALS CAROUSEL ---------------- */
(function testimonials(){
  const track = document.getElementById('testiTrack');
  const cards = track.children;
  const dotsWrap = document.getElementById('testiDots');
  let index = 0;

  for(let i=0;i<cards.length;i++){
    const dot = document.createElement('span');
    if(i===0) dot.classList.add('active');
    dot.addEventListener('click', ()=>goTo(i));
    dotsWrap.appendChild(dot);
  }

  function goTo(i){
    index = i;
    track.style.transform = `translateX(-${i*100}%)`;
    [...dotsWrap.children].forEach((d,j)=>d.classList.toggle('active', j===i));
  }

  let auto = setInterval(()=>{ goTo((index+1)%cards.length); }, 5000);

  /* drag support */
  let startX=null;
  track.addEventListener('pointerdown', e=>{ startX = e.clientX; clearInterval(auto); });
  track.addEventListener('pointerup', e=>{
    if(startX===null) return;
    const diff = e.clientX - startX;
    if(diff < -50) goTo(Math.min(index+1, cards.length-1));
    else if(diff > 50) goTo(Math.max(index-1, 0));
    startX = null;
    auto = setInterval(()=>{ goTo((index+1)%cards.length); }, 5000);
  });
})();

/* ---------------- CONTACT FORM ---------------- */
(function contactForm(){
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('fName');
    const email = document.getElementById('fEmail');
    const message = document.getElementById('fMessage');

    [name, message].forEach(input=>{
      const field = input.closest('.field');
      if(!input.value.trim()){
        field.classList.add('invalid'); valid=false;
      } else field.classList.remove('invalid');
    });

    const emailField = email.closest('.field');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if(!emailValid){ emailField.classList.add('invalid'); valid=false; }
    else emailField.classList.remove('invalid');

    if(!valid) return;

    form.classList.add('hide');
    success.classList.add('show');
    setTimeout(()=>{
      form.reset();
      form.classList.remove('hide');
      success.classList.remove('show');
    }, 4500);
  });

  form.querySelectorAll('input, textarea').forEach(input=>{
    input.addEventListener('input', ()=> input.closest('.field').classList.remove('invalid'));
  });
})();

/* Safety: if loader js fails for any reason, ensure content visible */
window.addEventListener('load', ()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('done');
  }, 6000);
});
