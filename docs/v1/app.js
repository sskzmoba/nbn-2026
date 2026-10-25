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
// True when a file is published next to the page (used to switch on the chant and film buttons)
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

// ---- Opening: prayer → NBN Sir → site. Once per visit; tap Enter to skip. ----
const opening = $("opening");
const chant = $("chant");
const chantBtn = $("chant-btn");
let stageTimer, closeTimer;

// Seconds at which each prayer line appears: on its own, and in time with audio/chant.mp3
// (chant at 1.25× speed: lines are sung from 1.1 s, 6.1 s and 11.3 s, and end at 15.7 s)
const LINES_QUICK = [0.2, 1.2, 2.2];
const LINES_CHANT = [1.0, 6.0, 11.2];
const CHANT_END = 15.8;

function restartAnimations(delays) {
  opening.querySelectorAll(".mantra--opening li, .opening__glow").forEach(el => {
    el.style.animation = "none";
    void el.offsetHeight; // reflow so the animation starts again
    el.style.animation = "";
  });
  opening.querySelectorAll(".mantra--opening li").forEach((li, i) => { li.style.animationDelay = delays[i] + "s"; });
}

function openOpening() {
  opening.classList.remove("stage2", "out");
  opening.hidden = false;
  document.body.style.overflow = "hidden";
  restartAnimations(LINES_QUICK);
  chantBtn.disabled = false;
  chantBtn.innerHTML = '<span aria-hidden="true">▶</span> Play chant';
  clearTimeout(stageTimer); clearTimeout(closeTimer);
  stageTimer = setTimeout(() => opening.classList.add("stage2"), 4200);
  closeTimer = setTimeout(closeOpening, 8000);
  $("skip-btn").focus({ preventScroll: true });
}

function fadeOutChant() {
  if (chant.paused) return;
  const step = setInterval(() => {
    chant.volume = Math.max(0, chant.volume - 0.1);
    if (chant.volume === 0) { clearInterval(step); chant.pause(); chant.volume = 1; }
  }, 80);
}

function closeOpening() {
  clearTimeout(stageTimer); clearTimeout(closeTimer);
  fadeOutChant();
  opening.classList.add("out");
  document.body.style.overflow = "";
  store.set("gl-opening", "seen");
  setTimeout(() => { opening.hidden = true; }, 900);
}

chantBtn.addEventListener("click", () => {
  // The visitor chose to listen: replay the lines in time with the chant, then show NBN Sir
  clearTimeout(stageTimer); clearTimeout(closeTimer);
  chant.currentTime = 0;
  chant.play().then(() => {
    chantBtn.disabled = true;
    chantBtn.textContent = "Chant playing…";
    opening.classList.remove("stage2");
    restartAnimations(LINES_CHANT);
    stageTimer = setTimeout(() => opening.classList.add("stage2"), CHANT_END * 1000);
  }).catch(() => { chantBtn.hidden = true; });
});
chant.addEventListener("ended", () => {
  opening.classList.add("stage2");
  closeTimer = setTimeout(closeOpening, 2500);
});
$("skip-btn").addEventListener("click", closeOpening);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !opening.hidden) closeOpening(); });
$("replay-btn").addEventListener("click", () => { window.scrollTo(0, 0); openOpening(); });

exists("audio/chant.mp3").then(ok => { chantBtn.hidden = !ok; });
if (store.get("gl-opening") !== "seen" && !location.hash) openOpening();

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

// ---- Film: full screen on tap; close on ✕, Esc or when it ends ----
const film = $("film");
const filmVideo = $("film-video");
const filmBtn = $("film-btn");
function closeFilm() {
  filmVideo.pause();
  film.hidden = true;
  document.body.style.overflow = "";
  filmBtn.focus();
}
exists(filmBtn.dataset.film).then(ok => { filmBtn.hidden = !ok; });
filmBtn.addEventListener("click", () => {
  if (!filmVideo.getAttribute("src")) filmVideo.src = filmBtn.dataset.film;
  film.hidden = false;
  document.body.style.overflow = "hidden";
  filmVideo.currentTime = 0;
  filmVideo.play().catch(() => {}); // a tap counts as a user gesture, so sound is allowed
});
$("film-close").addEventListener("click", closeFilm);
filmVideo.addEventListener("ended", closeFilm);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !film.hidden) closeFilm(); });
