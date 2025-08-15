// Basic i18n + offline herbal search + favorites
const state = {
  herbs: [],
  lang: localStorage.getItem('lang') || 'en',
  country: localStorage.getItem('country') || 'IN',
  t: {},
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]')
};

const els = {
  search: document.getElementById('searchInput'),
  cards: document.getElementById('cards'),
  favCards: document.getElementById('favCards'),
  countrySelect: document.getElementById('countrySelect'),
  langSelect: document.getElementById('langSelect'),
  openSettings: document.getElementById('openSettings'),
  settingsLang: document.getElementById('settingsLang'),
  settingsCountry: document.getElementById('settingsCountry'),
  saveSettings: document.getElementById('saveSettings'),
  views: {
    home: document.getElementById('homeView'),
    favorites: document.getElementById('favoritesView'),
    settings: document.getElementById('settingsView'),
  }
};

const COUNTRIES = [
  {code:'IN', name:'India'},
  {code:'US', name:'United States'},
  {code:'GB', name:'United Kingdom'},
  {code:'SG', name:'Singapore'},
  {code:'AE', name:'United Arab Emirates'},
  {code:'AU', name:'Australia'}
];

function populateSelect(sel, items, getVal = x=>x, getLabel = x=>x){
  sel.innerHTML = '';
  items.forEach(it=>{
    const opt = document.createElement('option');
    opt.value = getVal(it);
    opt.textContent = getLabel(it);
    sel.appendChild(opt);
  });
}

async function loadI18n(lang){
  try{
    const res = await fetch(`i18n/${lang}.json`);
    state.t = await res.json();
  }catch(e){
    console.warn('i18n load failed, falling back to en', e);
    if(lang !== 'en') return loadI18n('en');
    state.t = {};
  }
}

function applyI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(state.t[key]) el.textContent = state.t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if(state.t[key]) el.setAttribute('placeholder', state.t[key]);
  });
  document.title = state.t['app_title'] || document.title;
}

async function loadData(){
  try{
    const res = await fetch('data/herbs.json');
    const json = await res.json();
    state.herbs = json.herbs || [];
  }catch(e){
    console.error('Failed to load herbs.json', e);
    state.herbs = [];
  }
}

function t(key, fallback=''){
  return state.t[key] || fallback || key;
}

function isFav(id){ return state.favorites.includes(id); }

function toggleFav(id){
  if(isFav(id)){
    state.favorites = state.favorites.filter(x=>x!==id);
  }else{
    state.favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
  render(state.herbs, els.cards);
  render(state.herbs.filter(h=>isFav(h.id)), els.favCards);
}

function herbCard(h){
  const name = h.name[state.lang] || h.name.en;
  const uses = h.uses[state.lang] || h.uses.en;
  const benefits = h.benefits[state.lang] || h.benefits.en;
  const prep = h.preparation[state.lang] || h.preparation.en;
  const precautions = h.precautions[state.lang] || h.precautions.en;

  const favTxt = isFav(h.id) ? t('remove_favorite','Remove favorite') : t('add_favorite','Add to favorites');

  return `
    <article class="card" tabindex="0" aria-label="${name}">
      <div class="fav" onclick="toggleFav('${h.id}')" title="${favTxt}">⭐</div>
      <h3>${name}</h3>
      <div class="chip">${h.aliases.join(', ')}</div>
      <p><strong>${t('uses','Uses')}:</strong> ${uses}</p>
      <p><strong>${t('benefits','Benefits')}:</strong> ${benefits}</p>
      <p><strong>${t('prep','Preparation')}:</strong> ${prep}</p>
      <p class="small"><strong>${t('precautions','Precautions')}:</strong> ${precautions}</p>
    </article>
  `;
}

function render(list, container){
  const q = els.search.value.trim().toLowerCase();
  const filtered = list.filter(h=>{
    if(!q) return true;
    const fields = [
      h.name.en, h.name.ta,
      ...(h.aliases||[]),
      h.uses.en, h.uses.ta,
      h.benefits.en, h.benefits.ta,
      ...(h.symptoms||[])
    ].filter(Boolean).join(' ').toLowerCase();
    return fields.includes(q);
  });
  container.innerHTML = filtered.map(herbCard).join('') || `<div class="card">${q ? 'No results' : 'No data'}</div>`;
}

function switchView(view){
  Object.entries(els.views).forEach(([k, node])=>{
    node.classList.toggle('active', k===view);
  });
}

async function init(){
  populateSelect(els.countrySelect, COUNTRIES, c=>c.code, c=>c.name);
  populateSelect(els.langSelect, [{code:'en',name:'English'},{code:'ta',name:'தமிழ்'}], x=>x.code, x=>x.name);

  els.countrySelect.value = state.country;
  els.langSelect.value = state.lang;

  populateSelect(els.settingsCountry, COUNTRIES, c=>c.code, c=>c.name);
  populateSelect(els.settingsLang, [{code:'en',name:'English'},{code:'ta',name:'தமிழ்'}], x=>x.code, x=>x.name);
  els.settingsCountry.value = state.country;
  els.settingsLang.value = state.lang;

  await loadI18n(state.lang);
  applyI18n();

  await loadData();

  render(state.herbs, els.cards);
  render(state.herbs.filter(h=>isFav(h.id)), els.favCards);

  els.search.addEventListener('input', ()=> render(state.herbs, els.cards));
  els.langSelect.addEventListener('change', async ()=>{
    state.lang = els.langSelect.value;
    localStorage.setItem('lang', state.lang);
    await loadI18n(state.lang);
    applyI18n();
    render(state.herbs, els.cards);
    render(state.herbs.filter(h=>isFav(h.id)), els.favCards);
    els.settingsLang.value = state.lang;
  });
  els.countrySelect.addEventListener('change', ()=>{
    state.country = els.countrySelect.value;
    localStorage.setItem('country', state.country);
    els.settingsCountry.value = state.country;
  });

  els.openSettings.addEventListener('click', ()=> switchView('settings'));
  document.querySelectorAll('nav [data-nav]').forEach(btn=>{
    btn.addEventListener('click', ()=> switchView(btn.getAttribute('data-nav')));
  });

  els.saveSettings.addEventListener('click', async ()=>{
    state.lang = els.settingsLang.value;
    state.country = els.settingsCountry.value;
    localStorage.setItem('lang', state.lang);
    localStorage.setItem('country', state.country);
    els.langSelect.value = state.lang;
    els.countrySelect.value = state.country;
    await loadI18n(state.lang);
    applyI18n();
    render(state.herbs, els.cards);
    render(state.herbs.filter(h=>isFav(h.id)), els.favCards);
    switchView('home');
  });

  if('serviceWorker' in navigator){
    try{ await navigator.serviceWorker.register('service-worker.js'); }
    catch(e){ console.warn('SW reg failed', e); }
  }
}

window.toggleFav = toggleFav;

init();
