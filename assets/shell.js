/* ============================================================================
   shell.js — shared chrome for BOTH pages (education + tools):
   theme toggle, sidebar nav + scroll-spy, in-page smooth scrolling, mobile
   drawer, tab panes, and reveal-on-scroll. Safe to load on any page.
   ============================================================================ */
"use strict";
(function(){
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

/* ============================================================
   THEME
   ============================================================ */
const root = document.documentElement;
function setTheme(t){ root.dataset.theme = t; try{ localStorage.setItem('tm-theme', t); }catch(e){} }
$('#themeBtn').addEventListener('click', ()=> setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ============================================================
   NAV · SCROLL-SPY · PROGRESS BAR
   ============================================================ */
const main = $('#main');
const sections = $$('.section');
const navItems = $$('.nav-item');
const bar = $('#scrollbar');
const crumb = $('#crumbTitle');
const toTop = $('#toTop');
let ticking = false;

function onScroll(){
  const st = main.scrollTop;
  const h = main.scrollHeight - main.clientHeight;
  if(bar) bar.style.width = (h > 0 ? (st/h*100) : 0) + '%';
  if(toTop) toTop.hidden = st < 400;
  let active = sections[0];
  for(const s of sections){ if(s.offsetTop - st <= 130) active = s; }
  if(active){
    navItems.forEach(n => n.classList.toggle('is-active', n.dataset.nav === active.id));
    if(crumb) crumb.textContent = active.dataset.section;
  }
}
main.addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(()=>{ onScroll(); ticking = false; }); ticking = true; } });
if(toTop) toTop.addEventListener('click', ()=> main.scrollTo({ top:0, behavior:'smooth' }));

const body = document.body;
const menuBtn = $('#menuBtn');
menuBtn.addEventListener('click', ()=>{
  const open = body.classList.toggle('nav-open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
/* explicit smooth-scroll for in-page links (robust inside the custom scroll container) */
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block:'start' });
    try{ history.replaceState(null, '', '#'+id); }catch(err){}
    body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded','false');
  });
});
document.addEventListener('click', e=>{
  if(body.classList.contains('nav-open') && !e.target.closest('.sidebar') && !e.target.closest('#menuBtn')){
    body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded','false');
  }
});

/* ============================================================
   TABS
   ============================================================ */
$$('.tabs').forEach(tabs=>{
  const scope = tabs.parentElement;
  tabs.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.querySelectorAll('.tab').forEach(t=> t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const id = tab.dataset.tab;
      scope.querySelectorAll('.tabpane').forEach(p=> p.classList.toggle('is-active', p.dataset.pane === id));
    });
  });
});

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
function initReveal(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    $$('.reveal').forEach(r=> r.classList.add('in')); return;
  }
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { root:main, rootMargin:'0px 0px -6% 0px', threshold:0.05 });
  $$('.reveal').forEach(r=> obs.observe(r));
}

initReveal();
onScroll();
})();
