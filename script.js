/* ===================================================================
   NOAH HÄGGLUND — SOUND DESIGN & MUSIC PORTFOLIO
   Small, dependency-free interactions:
   1. Running timecode (studio-clock touch, ticks like a tape counter)
   2. Scroll-triggered reveals (IntersectionObserver)
   3. Ambient hero waveform + per-card hover waveform (canvas)
   4. Custom cursor dot (desktop / pointer:fine only)
   =================================================================== */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- 1. running timecode ---------- */
(function timecode() {
  const el = document.getElementById("timecode");
  if (!el) return;
  const start = performance.now();

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick(now) {
    const elapsed = now - start;
    const totalFrames = Math.floor(elapsed / (1000 / 24)); // 24fps timecode feel
    const frames = totalFrames % 24;
    const totalSeconds = Math.floor(totalFrames / 24);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ---------- 2. scroll reveals ---------- */
(function reveals() {
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((t) => io.observe(t));
})();

/* ---------- 3. waveform canvases ---------- */
function drawWaveform(canvas, options = {}) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const colorA = options.colorA || "#c9824d";
  const colorB = options.colorB || "#6fa8a0";
  const bars = options.bars || 64;
  const animated = options.animated !== false && !prefersReducedMotion;

  let width, height;
  const seeds = Array.from({ length: bars }, () => Math.random());

  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render(t) {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const barWidth = width / bars;
    for (let i = 0; i < bars; i++) {
      const seed = seeds[i];
      const phase = animated ? t / 900 : 0;
      const amp =
        0.25 +
        0.75 *
          Math.abs(
            Math.sin(seed * 10 + phase + i * 0.35) *
              Math.cos(seed * 4 + phase * 0.6)
          );
      const barHeight = amp * height;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;
      ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x, y, barWidth * 0.6, barHeight);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (animated) {
    function loop(t) {
      render(t);
      canvas._raf = requestAnimationFrame(loop);
    }
    canvas._raf = requestAnimationFrame(loop);
  } else {
    render(0);
  }

  return {
    stop() {
      if (canvas._raf) cancelAnimationFrame(canvas._raf);
    },
  };
}

/* Hero waveform: always gently animating (ambient, ok to keep subtle
   even with reduced motion since it's a static single frame then) */
(function heroWave() {
  const canvas = document.getElementById("heroWave");
  if (!canvas) return;
  drawWaveform(canvas, { bars: 90, animated: true });
})();

/* Card waveforms: only animate while hovered/focused, to keep things calm */
(function cardWaves() {
  const cards = document.querySelectorAll(".work-card");
  cards.forEach((card) => {
    const canvas = card.querySelector(".card-wave");
    const link = card.querySelector(".work-card-link");
    if (!canvas || !link) return;

    let controller = null;

    function start() {
      if (controller) return;
      controller = drawWaveform(canvas, { bars: 48, animated: true });
    }
    function stop() {
      if (controller) {
        controller.stop();
        controller = null;
      }
    }

    link.addEventListener("mouseenter", start);
    link.addEventListener("mouseleave", stop);
    link.addEventListener("focus", start);
    link.addEventListener("blur", stop);
  });
})();

/* ---------- 4. custom cursor ---------- */
(function cursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const dot = document.getElementById("cursorDot");
  if (!dot) return;

  window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });

  const interactive = document.querySelectorAll("a, button");
  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("is-active"));
    el.addEventListener("mouseleave", () => dot.classList.remove("is-active"));
  });
})();
