const views = [...document.querySelectorAll('[data-view]')];
const nav = document.querySelector('#site-nav');
const toggle = document.querySelector('.menu-toggle');
const baseTitle = document.title;
const names = { home: '', professor: '교수 소개', research: '연구 분야', publications: '연구 논문', people: '구성원', alumni: '졸업생' };
function route(focus = false) {
  const hash = location.hash.slice(1);
  if (hash === 'main') { document.querySelector('#main').focus(); return; }
  const id = Object.hasOwn(names, hash) ? hash : 'home';
  views.forEach(view => { view.hidden = view.dataset.view !== id; });
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === id) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  document.title = names[id] ? `${names[id]} | ${baseTitle}` : baseTitle;
  if (focus) { document.querySelector('#main').focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
}
toggle.hidden = false;
document.documentElement.classList.add('js');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
});
window.addEventListener('hashchange', () => route(true));
route();

const search = document.querySelector('#publication-search');
const year = document.querySelector('#publication-year');
const type = document.querySelector('#publication-type');
const cards = [...document.querySelectorAll('#publication-results [data-publication]')];
function filter() {
  const query = search.value.trim().toLocaleLowerCase();
  let count = 0;
  cards.forEach(card => {
    const matches = card.dataset.search.includes(query) && (!year.value || card.dataset.year === year.value) && (!type.value || card.dataset.type === type.value);
    card.hidden = !matches;
    if (matches) count++;
  });
  document.querySelectorAll('[data-year-group]').forEach(group => { group.hidden = ![...group.querySelectorAll('[data-publication]')].some(card => !card.hidden); });
  document.querySelector('#publication-count').textContent = `총 ${count}편`;
  document.querySelector('#no-results').hidden = count !== 0 || cards.length === 0;
}
search.addEventListener('input', filter);
year.addEventListener('change', filter);
type.addEventListener('change', filter);
