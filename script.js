/* ===================================================================
   NOAH HÄGGLUND — SOUND DESIGN & MUSIC PORTFOLIO
   1. Scroll-reveal + play/pause for the full-bleed video rows
   2. Scroll-reveal for the studio/contact sections
   3. Live "01 / 04" project counter in the header
   4. Custom cursor that shows a "View" label over projects
   =================================================================== */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- 1 & 3. project video reveal + counter ---------- */
(function projectReveal() {
  const projects = document.querySelectorAll(".project");
  const counter = document.getElementById("projectCounter");
  if (!projects.length) return;

  const total = String(projects.length).padStart(2, "0");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const project = entry.target;
        const video = project.querySelector(".project-video");

        if (entry.isIntersecting) {
          project.classList.add("is-visible");
          if (video && !prefersReducedMotion) {
            // play() can reject if the browser blocks autoplay or the
            // source 404s (e.g. before you've added real .mp4 files) —
            // that's fine, the gradient fallback stays visible either way
            video.play().catch(() => {});
          }
          if (counter) {
            const index = project.dataset.index || "01";
            counter.textContent = `${index} / ${total}`;
          }
        } else if (video) {
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  projects.forEach((p) => io.observe(p));
})();

/* ---------- 2. generic scroll reveals ---------- */
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

/* ---------- 4. custom cursor ---------- */
(function cursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const dot = document.getElementById("cursorDot");
  if (!dot) return;

  window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
  });

  document.querySelectorAll(".project").forEach((project) => {
    project.addEventListener("mouseenter", () => dot.classList.add("is-active"));
    project.addEventListener("mouseleave", () => dot.classList.remove("is-active"));
  });

  document.querySelectorAll("a:not(.project a)").forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("is-active"));
    el.addEventListener("mouseleave", () => dot.classList.remove("is-active"));
  });
})();
