
// === Helpers ===
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const state = {
  lang: localStorage.getItem('lang') || 'en',
  country: localStorage.getItem('country') || 'IN',
  currency: localStorage.getItem('currency') || 'INR'
};

const i18n = {
  en: {welcome:"Welcome to Galaxy Offline Suite",settings:"Settings",utilities:"Utilities",games:"Games",kids:"Kids",media:"Media",rates:"Rates",bot:"Assistant",save:"Save"},
  ta: {welcome:"கேலக்ஸி ஆஃப்லைன் செயலிக்கு வரவேற்பு",settings:"அமைப்புகள்",utilities:"கருவிகள்",games:"விளையாட்டுகள்",kids:"கிட்ஸ்",media:"மீடியா",rates:"விலை",bot:"உதவி",save:"சேமிக்க"}
};
function t(key){ return (i18n[state.lang]||i18n.en)[key]||key; }
function applyI18n(){
  $$(".t-welcome").forEach(el=> el.textContent=t('welcome'));
  $("#tab-settings").textContent=t('settings');
  $("#tab-utilities").textContent=t('utilities');
  $("#tab-games").textContent=t('games');
  $("#tab-kids").textContent=t('kids');
  $("#tab-media").textContent=t('media');
  $("#tab-rates").textContent=t('rates');
  $("#tab-bot").textContent=t('bot');
}

// === Tabs ===
$$("nav button").forEach(btn=>btn.addEventListener("click",()=>{
  $$("nav button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  const id = btn.dataset.tab; $$("main > section").forEach(s=>s.classList.add("hidden"));
  $("#"+id).classList.remove("hidden");
}));
document.addEventListener("DOMContentLoaded", ()=>{
  applyI18n();
  document.querySelector("nav button").click();
});

// === Settings ===
$("#lang").value = state.lang; $("#country").value = state.country; $("#currency").value = state.currency;
$("#saveSettings").addEventListener("click",()=>{
  state.lang=$("#lang").value; state.country=$("#country").value; state.currency=$("#currency").value;
  localStorage.setItem('lang',state.lang); localStorage.setItem('country',state.country); localStorage.setItem('currency',state.currency);
  applyI18n(); alert("Saved");
});
$("#buzz").onclick=()=>{ try{navigator.vibrate?.([50,50,100]);}catch{} new Audio("assets/beep.wav").play(); };

// === Utilities: Stopwatch & Timer & Notes ===
let swStart=0, swInterval;
function fmt(ms){ const s=(ms/1000)|0; const m=(s/60)|0; const r=s%60; return `${m}:${String(r).padStart(2,'0')}`; }
$("#swStart").onclick=()=>{ if(!swInterval){ swStart = Date.now() - (parseInt($("#swOut").dataset.ms||"0")); swInterval=setInterval(()=>{ const ms=Date.now()-swStart; $("#swOut").textContent=fmt(ms); $("#swOut").dataset.ms=ms; }, 200);} };
$("#swStop").onclick = ()=>{ clearInterval(swInterval); swInterval=null; };
$("#swReset").onclick=()=>{ clearInterval(swInterval); swInterval=null; $("#swOut").textContent="0:00"; $("#swOut").dataset.ms=0; };

let tmInterval;
$("#tmStart").onclick=()=>{
  let sec = parseInt($("#tmInput").value||"0");
  clearInterval(tmInterval);
  $("#tmOut").textContent = sec+"s";
  tmInterval=setInterval(()=>{
    sec--; $("#tmOut").textContent = sec+"s";
    if(sec<=0){ clearInterval(tmInterval); try{navigator.vibrate?.(200);}catch{} new Audio("assets/beep.wav").play(); }
  },1000);
};
$("#tmStop").onclick=()=>{ clearInterval(tmInterval); };

$("#notes").value = localStorage.getItem("notes") || "";
$("#notes").addEventListener("input", ()=> localStorage.setItem("notes", $("#notes").value));

// === Media Player ===
$("#mediaFile").addEventListener("change", (e)=>{
  const f = e.target.files[0]; if(!f) return;
  const url = URL.createObjectURL(f); const v = $("#video"); v.src=url; v.play();
});

// === Simple Snake Game ===
const cvs=$("#snake"), ctx=cvs.getContext("2d");
let grid=20, snake=[{x:100,y:100}], dir={x:grid,y:0}, apple={x:200,y:200};
function rand(){ return Math.floor(Math.random()*15)*grid; }
function reset(){ snake=[{x:100,y:100}]; dir={x:grid,y:0}; apple={x:rand(),y:rand()}; }
function draw(){
  const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
  if(head.x<0||head.y<0||head.x>=cvs.width||head.y>=cvs.height){ reset(); return; }
  snake.unshift(head);
  if(head.x===apple.x && head.y===apple.y){ apple={x:rand(),y:rand()}; new Audio("assets/beep.wav").play(); } else snake.pop();
  for(let i=1;i<snake.length;i++){ if(snake[i].x===head.x && snake[i].y===head.y){ reset(); return; } }
  ctx.fillStyle="#0b0f1d"; ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.fillStyle="#78c0ff"; snake.forEach(p=>ctx.fillRect(p.x,p.y,grid-2,grid-2));
  ctx.fillStyle="#ffc04d"; ctx.fillRect(apple.x,apple.y,grid-2,grid-2);
}
setInterval(draw, 120);
document.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowLeft" && dir.x===0){dir={x:-grid,y:0}}
  if(e.key==="ArrowRight"&& dir.x===0){dir={x:grid,y:0}}
  if(e.key==="ArrowUp"   && dir.y===0){dir={x:0,y:-grid}}
  if(e.key==="ArrowDown" && dir.y===0){dir={x:0,y:grid}}
});
cvs.addEventListener("touchstart",(e)=>{
  const t=e.touches[0], rect=cvs.getBoundingClientRect(); const x=t.clientX-rect.left, y=t.clientY-rect.top; const h=snake[0];
  if(Math.abs(x-h.x)>Math.abs(y-h.y)){ dir=(x<h.x)?{x:-grid,y:0}:{x:grid,y:0}; } else { dir=(y<h.y)?{x:0,y:-grid}:{x:0,y:grid}; }
});

// === Rates (offline placeholder) ===
const rates = { INR: { gold_gm: 6800, petrol_l: 102.5, usd: 1/83.5 }, USD:{ gold_gm:82.0, petrol_l:1.23, usd:1 } };
function renderRates(){
  const r=rates[state.currency]||rates.INR;
  $("#rateGold").textContent = r.gold_gm + " " + state.currency + "/g";
  $("#ratePetrol").textContent = r.petrol_l + " " + state.currency + "/L";
  $("#rateUSD").textContent = (1/r.usd).toFixed(2) + " " + state.currency + "/USD";
}
renderRates();

// === SW register ===
if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js'); }
