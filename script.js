/* ===================================================================
   NOAH HÄGGLUND — SOUND DESIGN & MUSIC PORTFOLIO
   1. Scroll-driven horizontal progress through the isometric stack
   2. Play the nearest-to-center card's video, pause the rest
   3. Live "01 / 06" counter in the header
   4. Generic reveal for the studio/contact sections
   =================================================================== */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
const isSmallScreen = window.matchMedia("(max-width: 720px)").matches;

/* ---------- 1, 2, 3. the stack ---------- */
(function stack() {
  const section = document.getElementById("work");
  const track = document.getElementById("stackTrack");
  const counter = document.getElementById("projectCounter");
  if (!section || !track) return;

  const cards = Array.from(track.querySelectorAll(".card"));
  const total = String(cards.length).padStart(2, "0");

  // On reduced-motion or small screens, CSS already turns this into a
  // plain scrollable strip — skip the scroll-jack math entirely and
  // just wire up play-on-hover instead.
  if (prefersReducedMotion || isSmallScreen) {
    cards.forEach((card) => {
      const video = card.querySelector(".card-video");
      if (!video) return;
      card.addEventListener("mouseenter", () => video.play().catch(() => {}));
      card.addEventListener("mouseleave", () => video.pause());
    });
    return;
  }

  let maxShift = 0; // how far, in px, the track can translate
  let sectionTop = 0;
  let sectionHeight = 0;
  let currentCardIndex = -1;

  function measure() {
    // Give the section enough scroll distance to comfortably flip
    // through every card — roughly one viewport height per card.
    const viewportH = window.innerHeight;
    section.style.height = `${viewportH + cards.length * viewportH * 0.6}px`;

    sectionTop = section.offsetTop;
    sectionHeight = section.offsetHeight;

    // How far the track needs to slide so the last card reaches
    // roughly where the first card started.
    const trackWidth = track.scrollWidth;
    const viewportW = track.parentElement.clientWidth;
    maxShift = Math.max(trackWidth - viewportW * 0.4, 0);
  }

  function setPlayingCard(index) {
    if (index === currentCardIndex) return;
    currentCardIndex = index;

    cards.forEach((card, i) => {
      const video = card.querySelector(".card-video");
      if (!video) return;
      if (i === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    if (counter) {
      const label = cards[index]?.dataset.index || "01";
      counter.textContent = `${label} / ${total}`;
    }
  }

  function onScroll() {
    const scrollY = window.scrollY;
    const raw = (scrollY - sectionTop) / (sectionHeight - window.innerHeight);
    const progress = Math.min(Math.max(raw, 0), 1);

    const shift = -progress * maxShift;
    track.style.setProperty("--scroll-x", `${shift}px`);

    const activeIndex = Math.min(
      cards.length - 1,
      Math.round(progress * (cards.length - 1))
    );
    setPlayingCard(activeIndex);
  }

  let ticking = false;
  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  }

  measure();
  setPlayingCard(0);
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    onScroll();
  });

  // hover pause fallback: keep the hovered card's video playing even
  // if scroll would otherwise have paused it
  cards.forEach((card, i) => {
    const video = card.querySelector(".card-video");
    if (!video) return;
    card.addEventListener("mouseenter", () => video.play().catch(() => {}));
    card.addEventListener("mouseleave", () => {
      if (i !== currentCardIndex) video.pause();
    });
  });
})();

/* ---------- 4. generic scroll reveals ---------- */
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
