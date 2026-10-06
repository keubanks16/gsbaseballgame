// Synthesized ballpark sounds + PA announcer (no audio files needed).
let ctx = null, master = null, crowdGain = null, enabled = true, announcer = true;
export function setSound(on) { enabled = on; if (master) master.gain.value = on ? 0.9 : 0; }
export function setAnnouncer(on) { announcer = on; }
export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = enabled ? 0.9 : 0; master.connect(ctx.destination);
    startCrowd();
  } catch { ctx = null; }
  // iOS: an <audio> element must be started inside a tap before it can play later
  try { const a = audioEl(); if (!a.src) { a.src = SILENT; a.play().then(() => a.pause()).catch(() => { }); } } catch { }
}
function noiseBuffer(sec) {
  const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate); const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b;
}
let nb = null;
function noise(dur, freq, q, gain, type = 'bandpass', attack = 0.002) {
  if (!ctx) return;
  nb = nb || noiseBuffer(2);
  const s = ctx.createBufferSource(); s.buffer = nb;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); const t = ctx.currentTime;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
}
function tone(freq, dur, gain, type = 'sine', slide) {
  if (!ctx) return;
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  const g = ctx.createGain(); const t = ctx.currentTime;
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
}
export const sfx = {
  crack(q = 0.8) { noise(0.09, 2400 + q * 1500, 1.4, 1.1); tone(900 + q * 500, 0.05, 0.35, 'triangle', 400); noise(0.35, 700, 0.8, 0.25 * q, 'lowpass'); },
  foul() { noise(0.06, 1800, 1.5, 0.6); },
  mitt() { noise(0.08, 380, 1.2, 1.2, 'lowpass'); tone(130, 0.07, 0.4); },
  glove() { noise(0.06, 600, 1.1, 0.7, 'lowpass'); },
  whoosh() { noise(0.18, 900, 0.7, 0.18, 'bandpass', 0.06); },
  click() { tone(880, 0.05, 0.12, 'square'); },
  cheer(level = 1) {
    if (!crowdGain) return; const t = ctx.currentTime;
    crowdGain.gain.cancelScheduledValues(t); crowdGain.gain.setValueAtTime(crowdGain.gain.value, t);
    crowdGain.gain.linearRampToValueAtTime(0.06 + 0.5 * level, t + 0.25); crowdGain.gain.linearRampToValueAtTime(0.06, t + 2.5 + level * 2);
  },
  organ() { // charge!
    if (!ctx) return; const notes = [392, 523, 659, 784, 659, 784]; const durs = [0.15, 0.15, 0.15, 0.3, 0.15, 0.6];
    let t = 0; notes.forEach((n, i) => { setTimeout(() => { tone(n, durs[i] + 0.1, 0.12, 'square'); tone(n / 2, durs[i] + 0.1, 0.08, 'triangle'); }, t * 1000); t += durs[i]; });
  },
};
function startCrowd() {
  nb = nb || noiseBuffer(2);
  const s = ctx.createBufferSource(); s.buffer = nb; s.loop = true;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.5;
  crowdGain = ctx.createGain(); crowdGain.gain.value = 0.06;
  s.connect(f); f.connect(crowdGain); crowdGain.connect(master); s.start();
}
export function say(text, rate = 1.0, pitch = 0.9) {
  if (!enabled || !announcer || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.rate = rate; u.pitch = pitch; u.volume = 1;
    const v = speechSynthesis.getVoices().find(v => /en[-_]US/i.test(v.lang) && /male|daniel|alex|fred|google us/i.test(v.name)) || speechSynthesis.getVoices().find(v => /^en/i.test(v.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  } catch { }
}

// ---------- team music ----------
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
export const SONGS = [
  { id: 'bring-that-sting', title: 'Bring That Sting', file: 'music/bring-that-sting.mp3', hook: 150 },
  { id: 'built-different', title: 'Built Different', file: 'music/built-different.mp3', hook: 127.5 },
  { id: 'buzzin', title: "Buzzin'", file: 'music/buzzin.mp3', hook: 143.5 },
  { id: 'one-shot', title: 'One Shot', file: 'music/one-shot.mp3', hook: 113.5 },
];
const blobs = {};
async function srcFor(song) {
  if (blobs[song.id]) return blobs[song.id];
  try { const r = await fetch(song.file); const b = await r.blob(); blobs[song.id] = URL.createObjectURL(b); }
  catch { blobs[song.id] = song.file; }
  return blobs[song.id];
}
let musicOn = true, el = null, fadeTimer = null, stopTimer = null, playToken = 0, menuIdx = 0, mode = null;
export function setMusic(on) { musicOn = on; if (!on) music.stop(0); }
function audioEl() {
  if (!el) { el = new Audio(); el.preload = 'auto'; el.playsInline = true; el.setAttribute('playsinline', ''); }
  return el;
}
function fadeTo(vol, ms, then) {
  clearInterval(fadeTimer); const a = audioEl(); const start = a.volume, t0 = performance.now();
  if (ms <= 0) { a.volume = vol; then && then(); return; }
  fadeTimer = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); a.volume = Math.max(0, Math.min(1, start + (vol - start) * k)); if (k >= 1) { clearInterval(fadeTimer); then && then(); } }, 30);
}
async function playSong(song, { from = 0, dur = 0, vol = 0.8, loop = false, onEnd } = {}) {
  if (!musicOn || !enabled || !song) return;
  const tok = ++playToken; clearTimeout(stopTimer);
  const src = await srcFor(song); if (tok !== playToken) return;
  const a = audioEl(); a.onended = null; a.pause(); a.src = src; a.loop = loop; a.volume = 0;
  const go = () => { try { a.currentTime = from; } catch { } a.play().catch(() => { }); fadeTo(vol, 500); };
  if (a.readyState >= 1) go(); else a.addEventListener('loadedmetadata', go, { once: true });
  a.onended = () => { if (tok === playToken && onEnd) onEnd(); };
  if (dur) stopTimer = setTimeout(() => { if (tok === playToken) fadeTo(0, 1500, () => { if (tok === playToken) { a.pause(); mode = null; } }); }, dur * 1000);
}
export const music = {
  menu() {
    if (mode === 'menu' && el && !el.paused) return; mode = 'menu';
    const next = () => { if (mode !== 'menu') return; const s = SONGS[menuIdx++ % SONGS.length]; playSong(s, { vol: 0.55, onEnd: next }); };
    next();
  },
  walkup(id, secs = 11) { const s = SONGS.find(x => x.id === id); if (!s) return; mode = 'clip'; playSong(s, { from: s.hook, dur: secs, vol: 0.8 }); },
  preview(id) { this.walkup(id, 8); },
  stop(ms = 800) { mode = null; ++playToken; clearTimeout(stopTimer); if (!el) return; fadeTo(0, ms, () => el.pause()); },
  nowPlaying() { return mode; },
};
