// Event: Saturday 21 Nov 2026, 10:00 AM – 3:00 PM IST
const EVENT_START = new Date("2026-11-21T10:00:00+05:30");
// The page's own address, so shared links work for the /v1/ review copy and the final site
const SITE_URL = location.origin + location.pathname;

// ---- Small helpers ----
const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private mode: ignore */ } },
};
// True when a file is published next to the page (used to switch on the music button)
async function exists(url) {
  try { return (await fetch(url, { method: "HEAD", cache: "no-store" })).ok; } catch { return false; }
}

// ---- Countdown ("24 days to go") ----
(function countdown() {
  const days = Math.ceil((EVENT_START - Date.now()) / 864e5);
  const el = $("countdown");
  if (days > 1) el.textContent = `${days} days to go`;
  else if (days === 1) el.textContent = "Tomorrow";
  else if (Date.now() < EVENT_START.getTime() + 5 * 36e5) el.textContent = "Today";
})();

// ---- Opening: the teacher's story → NBN Sir → site. Once per visit; "Skip intro" ends it. ----
// Scenes carry their film timings (data-at / data-to, seconds). Without sound they play at
// QUICK × film speed; after "Play music" they play at film speed, in time with audio/story.mp3
// (the film's piano, which lifts as "For 27 years…" appears).
const opening = $("opening");
const music = $("music");
const musicBtn = $("music-btn");
const scenes = [...opening.querySelectorAll(".scene")];
const STORY_END = 25.6;
const QUICK = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.35 : 0.5;
let timers = [];

// Wrap each word (or each line, with data-byline) in a span so it can appear on its own
scenes.forEach(sc => {
  if (sc.tagName === "FIGURE") return;
  const lines = sc.innerHTML.split(/<br\s*\/?>/i);
  sc.innerHTML = "<div>" + lines.map(line => "byline" in sc.dataset
    ? `<span>${line}</span>`
    : line.split(" ").map(w => `<span>${w}</span>`).join(" ")).join("<br>") + "</div>";
});

function play(k) {
  timers.forEach(clearTimeout); timers = [];
  const at = (t, fn) => timers.push(setTimeout(fn, t * k * 1000));
  scenes.forEach(sc => {
    sc.classList.remove("in", "gone");
    const step = +(sc.dataset.step || 0.24) * k;
    sc.querySelectorAll("span").forEach((w, i) => { w.style.transitionDelay = (i * step).toFixed(2) + "s"; });
    at(+sc.dataset.at, () => sc.classList.add("in"));
    at(+sc.dataset.to, () => sc.classList.add("gone"));
  });
  at(STORY_END + 0.4, closeOpening);
}

function openOpening() {
  opening.classList.remove("out");
  opening.hidden = false;
  document.body.style.overflow = "hidden";
  musicBtn.disabled = false;
  musicBtn.innerHTML = '<span aria-hidden="true">▶</span> Play music';
  const glow = opening.querySelector(".opening__glow");
  glow.style.animation = "none";
  void opening.offsetHeight; // reflow so the scenes and the glow start again
  glow.style.animation = "";
  play(QUICK);
  $("skip-btn").focus({ preventScroll: true });
}

function fadeOutMusic() {
  if (music.paused) return;
  const step = setInterval(() => {
    music.volume = Math.max(0, music.volume - 0.1);
    if (music.volume === 0) { clearInterval(step); music.pause(); music.volume = 1; }
  }, 80);
}

function closeOpening() {
  timers.forEach(clearTimeout); timers = [];
  fadeOutMusic();
  opening.classList.add("out");
  document.body.style.overflow = "";
  store.set("gl-story", "seen");
  setTimeout(() => { opening.hidden = true; }, 900);
}

musicBtn.addEventListener("click", () => {
  // The visitor chose to listen: restart the story at film speed, in time with the music
  music.currentTime = 0;
  music.play().then(() => {
    musicBtn.disabled = true;
    musicBtn.textContent = "Music playing…";
    scenes.forEach(sc => sc.classList.remove("in", "gone"));
    void opening.offsetHeight;
    play(1);
  }).catch(() => { musicBtn.hidden = true; });
});
$("skip-btn").addEventListener("click", closeOpening);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !opening.hidden) closeOpening(); });
$("replay-btn").addEventListener("click", () => { window.scrollTo(0, 0); openOpening(); });

exists("audio/story.mp3").then(ok => { musicBtn.hidden = !ok; });
if (store.get("gl-story") !== "seen" && !location.hash) openOpening();

// ---- Add to calendar: .ics for iPhone/iPad, Google Calendar elsewhere ----
const isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
if (!isApple) {
  const cal = $("cal-btn");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: "Guiding Lights — Celebrating Educators Who Shape Generations",
    dates: "20261121T043000Z/20261121T093000Z",
    location: "Cariappa Auditorium, Pangode, Thiruvananthapuram",
    details: "In remembrance of N. B. N. Sir. An initiative by alumni of Sainik School Kazhakootam. Programme begins 10:30 AM. " + SITE_URL,
  });
  cal.href = "https://calendar.google.com/calendar/render?" + q;
  cal.removeAttribute("download");
  cal.target = "_blank";
  cal.rel = "noopener";
}

// ---- Reveal on scroll ----
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Share ----
const shareText = "GUIDING LIGHTS — Celebrating Educators Who Shape Generations. In remembrance of N. B. N. Sir. Sat 21 Nov 2026, Cariappa Auditorium, Pangode, Thiruvananthapuram. An initiative by alumni of Sainik School Kazhakootam:";
$("share-btn").addEventListener("click", async () => {
  if (navigator.share) {
    try { await navigator.share({ title: "Guiding Lights", text: shareText, url: SITE_URL }); return; }
    catch (err) { if (err.name === "AbortError") return; }
  }
  window.open("https://wa.me/?text=" + encodeURIComponent(shareText + " " + SITE_URL), "_blank", "noopener");
});
