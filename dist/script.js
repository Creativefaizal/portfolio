const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
const gallery = document.getElementById('gallery');
const cards = [...document.querySelectorAll('.project-card')];
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const count = document.getElementById('gallery-count');
let current = 0;
function updateGallery() {
  const step = cards[1].offsetLeft - cards[0].offsetLeft;
  current = Math.min(cards.length - 1, Math.round(gallery.scrollLeft / step));
  if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 4) current = cards.length - 1;
  previous.disabled = gallery.scrollLeft < 4;
  next.disabled = gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth - 4;
  count.textContent = `${String(current + 1).padStart(2, '0')} / 03`;
}
function moveGallery(direction) {
  const target = Math.max(0, Math.min(cards.length - 1, current + direction));
  gallery.scrollTo({left: cards[target].offsetLeft - cards[0].offsetLeft, behavior: reducedMotion ? 'instant' : 'smooth'});
}
previous.addEventListener('click', () => moveGallery(-1));
next.addEventListener('click', () => moveGallery(1));
gallery.addEventListener('scroll', updateGallery, {passive:true});
window.addEventListener('resize', updateGallery);
gallery.addEventListener('keydown', event => {
  if (event.target === gallery && ['ArrowLeft','ArrowRight'].includes(event.key)) {
    event.preventDefault(); moveGallery(event.key === 'ArrowRight' ? 1 : -1);
  }
});
updateGallery();
const projects = [
  {title:'Forma', description:'A calmer place to find your space.', direction:'A warm, editorial website concept. Clear navigation, spacious layouts and tactile forms make room for the content.'},
  {title:'Orbit', description:'Small habits. A little more balance.', direction:'A wellness app concept built around small, approachable actions, a gentle visual rhythm and an easy-to-read daily overview.'},
  {title:'Fold', description:'A clearer view of work in motion.', direction:'A workspace dashboard concept that brings projects, progress and priorities together in a calm, scannable interface.'}
];
const dialog = document.getElementById('project-dialog');
let activeCard;
cards.forEach((card, index) => card.addEventListener('click', () => {
  activeCard = card;
  document.getElementById('dialog-title').textContent = projects[index].title;
  document.getElementById('dialog-description').textContent = projects[index].description;
  document.getElementById('dialog-direction').textContent = projects[index].direction;
  document.getElementById('dialog-art').replaceChildren(card.querySelector('.project-art').cloneNode(true));
  dialog.showModal(); dialog.scrollTop = 0; document.body.style.overflow = 'hidden';
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.dialog-done').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); }});
dialog.addEventListener('close', () => {document.body.style.overflow = ''; activeCard?.focus({preventScroll:true});});

const menu = document.querySelector('.floating-menu');
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.open = false));
document.addEventListener('keydown', event => {if(event.key === 'Escape') menu.open = false;});
document.addEventListener('click', event => {if(!menu.contains(event.target)) menu.open = false;});
