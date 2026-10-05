/* ============ EDIT THIS PART ============ */
const CONFIG = {
  name: "My Baby Farah",              // her name or nickname
  from: "Your Sayang",            // your name
  birthday: { month: 10, day: 06 }, // her birthday (month 1-12)
  typedMessage: "Every day with you feels like a celebration. Today, I get to celebrate you.",
  letter: [
    "Happy birthday, my love. Thank you for being the person who makes ordinary days feel special.",
    "You make me laugh, you make me better, and you make everything feel like home.",
    "I hope this year gives you everything you deserve, and I hope I get to be next to you for all of it."
  ],
  timeline: [
    { date: "The day we met", title: "Hello, you", text: "I didn't know it yet, but my life was about to change." },
    { date: "Our first date", title: "Nervous and happy", text: "I remember wanting the night to never end." },
    { date: "Our favorite memory", title: "Just us", text: "Laughing about nothing and everything." },
    { date: "Today", title: "Your birthday", text: "And I still choose you, every single day." }
  ],
  // Replace "src" with your own photos, e.g. "photos/us1.jpg"
  photos: [
    { src: "photos/us1.jpg", caption: "Our first trip", h: 300 },
    { src: "photos/us2.jpg", caption: "That smile", h: 220 },
    { src: "photos/us3.jpg", caption: "Sec meet", h: 260 },
    { src: "photos/us4.jpg", caption: "Us being silly", h: 320 },
    { src: "photos/us5.jpg", caption: "My favorite view", h: 240 },
    { src: "photos/us6.jpg", caption: "Always you", h: 280 }
  ],
  reasons: [
    "Your smile", "Your laugh", "Your kindness", "How you care",
    "Your hugs", "Your strength", "Your support", "Simply, you"
  ],
  reasonsBack: [
    "It fixes my worst days.", "I'd do anything to hear it again.", "You're gentle with everyone.", "You notice the little things.",
    "They feel like home.", "You inspire me daily.", "You believe in me.", "You are my favorite person."
  ],
  wish: "May all your wishes come true ✨"
};
/* ========================================= */

const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Fill content ---- */
$('#name').textContent = CONFIG.name;
$('#letterText').innerHTML = CONFIG.letter.map(p => `<p>${p}</p>`).join('');
$('#sign').textContent = `Forever yours, ${CONFIG.from}`;

$('#timeline').innerHTML = CONFIG.timeline.map(t =>
  `<div class="tl reveal"><small>${t.date}</small><h3>${t.title}</h3><p>${t.text}</p></div>`).join('');

const palette = [['#ff7a9c','#ffb9a0'],['#ffd98a','#ff7a9c'],['#b58cff','#ff9ec4'],['#ffb9a0','#ffd98a']];
const placeholder = (i, h) => {
  const [a, b] = palette[i % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="52%" font-size="64" text-anchor="middle" fill="#fff" fill-opacity=".8">♥</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
};
$('#grid').innerHTML = CONFIG.photos.map((p, i) =>
  `<figure class="reveal"><img src="${p.src || placeholder(i, p.h)}" alt="${p.caption}" loading="lazy"><figcaption>${p.caption}</figcaption></figure>`).join('');

$('#cards').innerHTML = CONFIG.reasons.map((r, i) =>
  `<button class="card reveal" aria-label="Reason ${i + 1}"><div class="card-in"><span class="f">${r}</span><span class="b">${CONFIG.reasonsBack[i]}</span></div></button>`).join('');
document.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => { c.classList.toggle('flip'); burst(innerWidth / 2, innerHeight / 2, 12, true); }));

/* ---- Lightbox ---- */
const lb = $('#lightbox');
document.querySelectorAll('.grid img').forEach(img => img.addEventListener('click', () => { lb.querySelector('img').src = img.src; lb.hidden = false; }));
lb.addEventListener('click', () => lb.hidden = true);

/* ---- Letter modal ---- */
const modal = $('#modal');
$('#letterBtn').addEventListener('click', () => { modal.hidden = false; burst(innerWidth / 2, innerHeight / 3, 60); });
$('#closeBtn').addEventListener('click', () => modal.hidden = true);
modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
addEventListener('keydown', e => { if (e.key === 'Escape') { modal.hidden = true; lb.hidden = true; } });

/* ---- Scroll reveal ---- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---- Countdown ---- */
function tick() {
  const now = new Date(), { month, day } = CONFIG.birthday;
  const el = $('#countdown');
  if (now.getMonth() + 1 === month && now.getDate() === day) {
    el.innerHTML = '<div class="party">🎉 Today is your day! 🎉</div>'; return;
  }
  let next = new Date(now.getFullYear(), month - 1, day);
  if (next < now) next = new Date(now.getFullYear() + 1, month - 1, day);
  const d = next - now, p = n => String(n).padStart(2, '0');
  el.innerHTML = [['days', Math.floor(d / 864e5)], ['hours', Math.floor(d / 36e5) % 24], ['min', Math.floor(d / 6e4) % 60], ['sec', Math.floor(d / 1e3) % 60]]
    .map(([l, v]) => `<div><b>${p(v)}</b><small>${l}</small></div>`).join('');
}
tick(); setInterval(tick, 1000);

/* ---- Typewriter ---- */
function typeText() {
  const el = $('#typed'); let i = 0;
  if (reduced) { el.textContent = CONFIG.typedMessage; return; }
  (function step() { el.textContent = CONFIG.typedMessage.slice(0, ++i); if (i < CONFIG.typedMessage.length) setTimeout(step, 45); })();
}

/* ---- Canvas effects: floating hearts + confetti ---- */
const cv = $('#fx'), ctx = cv.getContext('2d');
let W, H, parts = [], hearts = [];
const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
resize(); addEventListener('resize', resize);
const colors = ['#f2708f', '#f5c26b', '#ffa585', '#8fd3c1', '#c8b4f0'];

const newHeart = (fresh) => ({ x: Math.random() * W, y: fresh ? Math.random() * H : H + 20, s: 8 + Math.random() * 14,
  v: .3 + Math.random() * .6, d: Math.random() * 6, c: colors[Math.floor(Math.random() * 3)] });
if (!reduced) for (let i = 0; i < (W < 600 ? 14 : 28); i++) hearts.push(newHeart(true));

function drawHeart(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y + s / 4);
  ctx.bezierCurveTo(x, y - s / 3, x - s, y - s / 3, x - s, y + s / 4);
  ctx.bezierCurveTo(x - s, y + s * .8, x, y + s * 1.1, x, y + s * 1.3);
  ctx.bezierCurveTo(x, y + s * 1.1, x + s, y + s * .8, x + s, y + s / 4);
  ctx.bezierCurveTo(x + s, y - s / 3, x, y - s / 3, x, y + s / 4); ctx.fill();
}

function burst(x, y, n = 80, heartsOnly = false) {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 7;
    parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, g: .18, s: 5 + Math.random() * 6,
      r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[Math.floor(Math.random() * colors.length)],
      heart: heartsOnly || Math.random() < .25, life: 110 + Math.random() * 60 });
  }
}

function loop(t) {
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = .35;
  hearts.forEach((h, i) => {
    h.y -= h.v; h.x += Math.sin(t / 900 + h.d) * .4;
    ctx.fillStyle = h.c; drawHeart(h.x, h.y, h.s / 2);
    if (h.y < -30) hearts[i] = newHeart(false);
  });
  ctx.globalAlpha = 1;
  parts = parts.filter(p => p.life-- > 0);
  parts.forEach(p => {
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
    ctx.globalAlpha = Math.min(1, p.life / 40); ctx.fillStyle = p.c;
    if (p.heart) drawHeart(p.x, p.y, p.s / 1.5);
    else { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---- Cake ---- */
const cake = $('#cakeEl');
function blow() {
  if (cake.classList.contains('out')) { // relight
    cake.classList.remove('out'); $('#wishMsg').textContent = ''; $('#blowBtn').textContent = 'Blow the candles 🌬️'; return;
  }
  cake.classList.add('out');
  $('#wishMsg').textContent = CONFIG.wish;
  $('#blowBtn').textContent = 'Light them again 🕯️';
  const r = cake.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top, 140);
  setTimeout(() => burst(innerWidth * .2, innerHeight * .5, 60), 300);
  setTimeout(() => burst(innerWidth * .8, innerHeight * .5, 60), 500);
}
cake.addEventListener('click', blow);
cake.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); } });
$('#blowBtn').addEventListener('click', blow);

/* ---- Music (Happy Birthday, synthesized: no audio file needed) ---- */
const N = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392, A4: 440, Bb4: 466.16, C5: 523.25 };
const song = [['C4', .75], ['C4', .25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
  ['C4', .75], ['C4', .25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
  ['C4', .75], ['C4', .25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
  ['Bb4', .75], ['Bb4', .25], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2]];
let ac, playing = false, timer;
function playSong() {
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  let t = ac.currentTime + .1; const beat = .5;
  song.forEach(([n, d]) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = N[n];
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .03);
    g.gain.exponentialRampToValueAtTime(.001, t + d * beat);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d * beat);
    t += d * beat;
  });
  timer = setTimeout(() => { if (playing) playSong(); }, (t - ac.currentTime + 1.5) * 1000);
}
$('#musicBtn').addEventListener('click', e => {
  playing = !playing; e.currentTarget.classList.toggle('on', playing);
  if (playing) playSong(); else { clearTimeout(timer); ac && ac.close(); ac = null; }
});

/* ---- Intro curtain ---- */
$('#openBtn').addEventListener('click', () => {
  $('#curtain').classList.add('open'); document.body.classList.remove('locked');
  burst(innerWidth / 2, innerHeight / 2, 160);
  setTimeout(typeText, 900);
  if (!playing) $('#musicBtn').click();
});
document.body.classList.add('locked');

/* ---- Advanced: scroll progress + parallax ---- */
addEventListener('scroll', () => {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  $('#progress').style.width = (y / max * 100) + '%';
  if (!reduced && y < innerHeight) $('.hero').style.setProperty('--p', y);
}, { passive: true });

/* ---- Advanced: sparkle trail ---- */
let lastSp = 0;
addEventListener('pointermove', e => {
  if (reduced || Date.now() - lastSp < 40) return; lastSp = Date.now();
  parts.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 1.2, vy: Math.random() + .3, g: .02,
    s: 4 + Math.random() * 5, r: 0, vr: .2, c: colors[Math.floor(Math.random() * colors.length)], heart: Math.random() < .4, life: 40 });
});

/* ---- Advanced: 3D tilt on photos ---- */
document.querySelectorAll('.grid figure').forEach(f => {
  f.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || reduced) return;
    const r = f.getBoundingClientRect();
    f.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 14 + 'deg');
    f.style.setProperty('--rx', -((e.clientY - r.top) / r.height - .5) * 14 + 'deg');
  });
  f.addEventListener('pointerleave', () => { f.style.setProperty('--rx', '0deg'); f.style.setProperty('--ry', '0deg'); });
});

/* ---- Advanced: blow out candles with the microphone ---- */
$('#micBtn').addEventListener('click', async () => {
  if (cake.classList.contains('out')) return;
  const msg = $('#wishMsg');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const a = new AudioContext(), an = a.createAnalyser(), data = new Uint8Array(512);
    an.fftSize = 512; a.createMediaStreamSource(stream).connect(an);
    msg.textContent = 'Now blow into your mic… 🌬️';
    const end = Date.now() + 15000;
    (function check() {
      an.getByteTimeDomainData(data);
      const peak = Math.max(...data.map(v => Math.abs(v - 128)));
      const done = peak > 90 || Date.now() > end;
      if (done) { stream.getTracks().forEach(t => t.stop()); a.close(); peak > 90 ? blow() : (msg.textContent = ''); return; }
      requestAnimationFrame(check);
    })();
  } catch (err) { msg.textContent = 'Mic not available here. Tap the cake instead.'; }
});