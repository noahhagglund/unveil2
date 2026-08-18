/* ===================================================================
   NOAH HÄGGLUND — ISOMETRIC CARD STACK
   Positions every card by hand, every frame, based on a single
   ever-growing/shrinking "offset" number driven by wheel or drag
   input. Each card's screen position is offset wrapped with modulo
   math, so there's no real start or end — it loops forever in
   either direction using only the DOM cards already on the page.
   =================================================================== */

(function stack() {
  const scene = document.getElementById("stackScene");
  const track = document.getElementById("stackTrack");
  const activeIndex = document.getElementById("activeIndex");
  const activeTitle = document.getElementById("activeTitle");
  const activeTag = document.getElementById("activeTag");
  if (!scene || !track) return;

  const cards = Array.from(track.querySelectorAll(".card"));
  const count = cards.length;
  const totalLabel = String(count).padStart(2, "0");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // spacing between card centers, in local (pre-tilt) px — tight
  // overlap rather than a gap, so the stack reads "close together"
  function getSpacing() {
    const cardWidth = cards[0].getBoundingClientRect().width || 240;
    return cardWidth * 0.38;
  }

  let spacing = getSpacing();
  let totalWidth = spacing * count;

  // offset: how far the whole stack has been scrolled. Free to grow
  // without bound in either direction — wrapping happens per-card.
  let offset = 0;
  let targetOffset = 0; // input smooths toward this
  let currentFrontIndex = -1;

  function wrap(x) {
    // bring x into (-totalWidth/2, totalWidth/2]
    let w = ((x % totalWidth) + totalWidth) % totalWidth;
    if (w > totalWidth / 2) w -= totalWidth;
    return w;
  }

  function render() {
    offset += (targetOffset - offset) * (prefersReducedMotion ? 1 : 0.15);

    const positioned = cards.map((card, i) => {
      const raw = i * spacing - offset;
      const x = wrap(raw);
      return { card, i, x };
    });

    // frontmost = smallest x — sort so we can rank depth / z-index
    positioned.sort((a, b) => a.x - b.x);

    positioned.forEach((p, rank) => {
      const depth = rank; // 0 = frontmost
      const scale = 1 - depth * 0.014;
      p.card.style.transform = `translate3d(${p.x}px, 0, ${-depth * 7}px) scale(${scale})`;
      p.card.style.zIndex = String(count - depth);
    });

    const front = positioned[0];
    if (front && front.i !== currentFrontIndex) {
      currentFrontIndex = front.i;
      cards.forEach((card, i) => {
        card.classList.toggle("is-front", i === front.i);
        const video = card.querySelector(".card-video");
        if (!video) return;
        if (i === front.i) video.play().catch(() => {});
        else video.pause();
      });
      if (activeIndex) {
        activeIndex.textContent = `${String(front.i + 1).padStart(2, "0")} / ${totalLabel}`;
      }
      if (activeTitle) activeTitle.textContent = front.card.dataset.title || "";
      if (activeTag) activeTag.textContent = front.card.dataset.tag || "";
    }

    requestAnimationFrame(render);
  }

  /* ---------- input: wheel ---------- */
  scene.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetOffset -= delta * 0.6;
    },
    { passive: false }
  );

  /* ---------- input: drag (mouse + touch via pointer events) ---------- */
  let dragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;

  scene.addEventListener("pointerdown", (e) => {
    dragging = true;
    dragStartX = e.clientX;
    dragStartOffset = targetOffset;
    scene.classList.add("is-dragging");
    scene.setPointerCapture(e.pointerId);
  });

  scene.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    targetOffset = dragStartOffset + dx * 1.4;
  });

  function endDrag() {
    dragging = false;
    scene.classList.remove("is-dragging");
  }
  scene.addEventListener("pointerup", endDrag);
  scene.addEventListener("pointercancel", endDrag);

  /* ---------- input: keyboard ---------- */
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      targetOffset += spacing;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      targetOffset -= spacing;
    }
  });

  /* ---------- resize ---------- */
  window.addEventListener("resize", () => {
    spacing = getSpacing();
    totalWidth = spacing * count;
  });

  requestAnimationFrame(render);
})();

/* ---------- decorative pill toggle (Overview / Index) ----------
   Purely visual state for now — wire these up to an alternate
   layout later if you build one. */
(function pillToggle() {
  const overviewBtn = document.getElementById("overviewBtn");
  const indexBtn = document.getElementById("indexBtn");
  if (!overviewBtn || !indexBtn) return;

  function setActive(btn) {
    [overviewBtn, indexBtn].forEach((b) => b.classList.toggle("is-active", b === btn));
  }

  overviewBtn.addEventListener("click", () => setActive(overviewBtn));
  indexBtn.addEventListener("click", () => setActive(indexBtn));
})();
