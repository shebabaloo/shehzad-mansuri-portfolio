const root = document.documentElement;
root.classList.add("is-enhanced");
const overture = document.querySelector(".overture");
const spiralCanvas = document.querySelector(".spiral-canvas");
const scoreRail = document.querySelector(".score-rail");
const scoreRailChapter = document.querySelector(".score-rail__chapter");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (value, start, end) => clamp((value - start) / (end - start));
const ease = (value) => value * value * (3 - 2 * value);
const lerp = (start, end, amount) => start + (end - start) * amount;

function createSpiralRenderer(canvas) {
  if (!canvas) return () => {};
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};
  const count = 1100;
  let seed = 7841;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const particles = Array.from({ length: count }, (_, index) => ({
    position: index / (count - 1),
    line: index % 5,
    jitter: (random() - .5) * 2,
    size: .45 + random() * 1.35,
    accent: random() > .975 ? (random() > .5 ? "coral" : "cobalt") : "paper",
    drift: (random() - .5) * .9,
  }));

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * dpr));
    canvas.height = Math.max(1, Math.round(bounds.height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render(progress) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);

    const morph = ease(range(progress, .14, .64));
    const fade = 1 - ease(range(progress, .7, .94));
    const centerX = width * .5;
    const centerY = height * .5;
    const radius = Math.min(width * .22, height * .42, 245);
    const lineGap = Math.min(18, height * .038);

    for (const particle of particles) {
      const p = particle.position;
      const rootP = Math.sqrt(p);
      const angle = Math.PI * 12 * rootP + progress * Math.PI * 1.35 + particle.drift;
      const spiralRadius = radius * rootP;
      const spiralX = centerX + Math.cos(angle) * spiralRadius;
      const spiralY = centerY + Math.sin(angle) * spiralRadius * .62;
      const targetX = width * .46 + p * width * .58;
      const targetY = centerY + (particle.line - 2) * lineGap + particle.jitter * .7;
      const x = lerp(spiralX, targetX, morph);
      const y = lerp(spiralY, targetY, morph);
      const alpha = fade * (.24 + (1 - p) * .58);
      const color = particle.accent === "coral"
        ? `oklch(67% .19 34 / ${alpha})`
        : particle.accent === "cobalt"
          ? `oklch(60% .2 264 / ${alpha})`
          : `oklch(94% .02 82 / ${alpha})`;
      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, particle.size * (1 + morph * .18), 0, Math.PI * 2);
      context.fill();
    }
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  return render;
}

const renderSpiral = createSpiralRenderer(spiralCanvas);

function measureProgress() {
  const available = overture.offsetHeight - window.innerHeight;
  return available > 0 ? clamp(-overture.getBoundingClientRect().top / available) : 0;
}

function measurePageProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  return available > 0 ? clamp(window.scrollY / available) : 0;
}

function updateScore(progress, pageProgress) {
  if (reduceMotion.matches || !overture) return;
  root.style.setProperty("--progress", progress.toFixed(4));
  const open = range(progress, 0.08, 0.47);
  const resolve = range(progress, 0.43, 0.9);
  const title = range(resolve, 0.55, 0.95);
  const dock = range(progress, 0.68, 0.98);
  const mobile = window.innerWidth <= 760;

  root.style.setProperty("--open", open.toFixed(4));
  root.style.setProperty("--resolve", resolve.toFixed(4));
  root.style.setProperty("--movement-opacity", (1 - open).toFixed(4));
  root.style.setProperty("--movement-y", `${(-12 * open).toFixed(2)}px`);
  root.style.setProperty("--node-opacity", (1 - resolve).toFixed(4));
  root.style.setProperty("--header-opacity", Math.max(0, 1 - open * 2.4).toFixed(4));
  root.style.setProperty("--staff-opacity", resolve.toFixed(4));
  root.style.setProperty("--staff-dash", (900 - 900 * resolve).toFixed(2));
  root.style.setProperty("--title-opacity", title.toFixed(4));
  root.style.setProperty("--title-y", `${((1 - resolve) * 2).toFixed(3)}rem`);
  root.style.setProperty("--scroll-opacity", Math.max(0, 1 - open * 2).toFixed(4));
  root.style.setProperty("--intro-opacity", Math.max(0, 1 - open * 1.8).toFixed(4));
  root.style.setProperty("--intro-y", `${(-14 * open).toFixed(2)}px`);
  root.style.setProperty("--spiral-opacity", Math.max(0, 1 - resolve * 1.08).toFixed(4));
  root.style.setProperty("--paper-reveal-opacity", resolve.toFixed(4));
  root.style.setProperty("--paper-reveal-scale", (0.05 + resolve * 1.75).toFixed(4));
  root.style.setProperty("--dock", dock.toFixed(4));
  root.style.setProperty("--rail-opacity", dock.toFixed(4));
  root.style.setProperty("--page-progress", pageProgress.toFixed(4));
  scoreRail?.setAttribute("aria-valuenow", String(Math.round(pageProgress * 100)));
  if (scoreRailChapter) scoreRailChapter.textContent = pageProgress < 0.72 ? "P" : "I";
  renderSpiral(progress);
}

let targetProgress = 0;
let renderedProgress = 0;
let targetPageProgress = 0;
let renderedPageProgress = 0;
let ticking = false;

function animateScore() {
  renderedProgress += (targetProgress - renderedProgress) * 0.14;
  renderedPageProgress += (targetPageProgress - renderedPageProgress) * 0.14;
  updateScore(renderedProgress, renderedPageProgress);

  const settled = Math.abs(targetProgress - renderedProgress) < 0.0005
    && Math.abs(targetPageProgress - renderedPageProgress) < 0.0005;
  if (settled) {
    renderedProgress = targetProgress;
    renderedPageProgress = targetPageProgress;
    updateScore(renderedProgress, renderedPageProgress);
    ticking = false;
    return;
  }
  requestAnimationFrame(animateScore);
}

function requestScoreUpdate() {
  if (reduceMotion.matches || !overture) return;
  targetProgress = measureProgress();
  targetPageProgress = measurePageProgress();
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(animateScore);
  }
}

document.querySelector(".enter-score")?.addEventListener("click", (event) => {
  if (reduceMotion.matches || !overture) return;
  event.preventDefault();
  const available = overture.offsetHeight - window.innerHeight;
  window.scrollTo({ top: overture.offsetTop + available * 0.52, behavior: "smooth" });
});

window.addEventListener("scroll", requestScoreUpdate, { passive: true });
window.addEventListener("resize", requestScoreUpdate, { passive: true });
reduceMotion.addEventListener?.("change", requestScoreUpdate);
targetProgress = measureProgress();
renderedProgress = targetProgress;
targetPageProgress = measurePageProgress();
renderedPageProgress = targetPageProgress;
updateScore(renderedProgress, renderedPageProgress);
