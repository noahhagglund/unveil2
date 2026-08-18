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

  function getSpacing() {
    const cardWidth = cards[0].getBoundingClientRect().width || 240;
    return cardWidth * 0.38;
  }

  let spacing = getSpacing();
  let totalWidth = spacing * count;

  let offset = 0;
  let targetOffset = 0;
  let currentFrontIndex = -1;

  function wrap(x) {
    let w = ((x % totalWidth) + totalWidth) % totalWidth;
    if (w > totalWidth / 2) w -= totalWidth;
    return w;
  }

  function stopAllVideos() {
    cards.forEach((card) => {
      const iframe = card.querySelector(".card-iframe");
      if (iframe) iframe.remove();

      const fallback = card.querySelector(".card-fallback");
      if (fallback) fallback.style.display = "";
    });
  }

  function playCard(card) {
    stopAllVideos();

    const videoUrl = card.dataset.video;
    if (!videoUrl) return;

    const iframe = document.createElement("iframe");

    iframe.className = "card-iframe";

    let separator = videoUrl.includes("?") ? "&" : "?";
    iframe.src = `${videoUrl}${separator}autoplay=1&playsinline=1`;

    iframe.title = card.dataset.title || "Video";
    iframe.allow =
      "autoplay; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.setAttribute("frameborder", "0");

    const fallback = card.querySelector(".card-fallback");
    if (fallback) fallback.style.display = "none";

    card.querySelector(".card-face").appendChild(iframe);
  }

  function render() {
    offset +=
      (targetOffset - offset) *
      (prefersReducedMotion ? 1 : 0.15);

    const positioned = cards.map((card, i) => {
      const raw = i * spacing - offset;
      const x = wrap(raw);
      return { card, i, x };
    });

    positioned.sort((a, b) => a.x - b.x);

    positioned.forEach((p, rank) => {
      const depth = rank;
      const scale = 1 - depth * 0.014;

      p.card.style.transform =
        `translate3d(${p.x}px, 0, ${-depth * 7}px) scale(${scale})`;

      p.card.style.zIndex = String(count - depth);
    });

    const front = positioned[0];

    if (front && front.i !== currentFrontIndex) {
      currentFrontIndex = front.i;

      cards.forEach((card, i) => {
        card.classList.toggle(
          "is-front",
          i === front.i
        );
      });

      if (activeIndex) {
        activeIndex.textContent =
          `${String(front.i + 1).padStart(2, "0")} / ${totalLabel}`;
      }

      if (activeTitle) {
        activeTitle.textContent =
          front.card.dataset.title || "";
      }

      if (activeTag) {
        activeTag.textContent =
          front.card.dataset.tag || "";
      }
    }

    requestAnimationFrame(render);
  }

  /* ---------- click vs drag ---------- */

  let dragging = false;
  let didDrag = false;
  let dragStartX = 0;
  let dragStartOffset = 0;

  scene.addEventListener("pointerdown", (e) => {
    dragging = true;
    didDrag = false;
    dragStartX = e.clientX;
    dragStartOffset = targetOffset;

    scene.classList.add("is-dragging");
    scene.setPointerCapture(e.pointerId);
  });

  scene.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - dragStartX;

    if (Math.abs(dx) > 6) {
      didDrag = true;
    }

    targetOffset =
      dragStartOffset + dx * 1.4;
  });

  function endDrag() {
    dragging = false;
    scene.classList.remove("is-dragging");
  }

  scene.addEventListener("pointerup", (e) => {
    if (!didDrag) {
      const card = e.target.closest(".card");

      if (card) {
        playCard(card);
      }
    }

    endDrag();
  });

  scene.addEventListener("pointercancel", endDrag);

  /* ---------- wheel ---------- */

  scene.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX)
          ? e.deltaY
          : e.deltaX;

      targetOffset -= delta * 0.6;
    },
    { passive: false }
  );

  /* ---------- keyboard ---------- */

  window.addEventListener("keydown", (e) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown"
    ) {
      targetOffset += spacing;
    } else if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
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

/* ---------- Overview / Index ---------- */

(function pillToggle() {
  const overviewBtn =
    document.getElementById("overviewBtn");

  const indexBtn =
    document.getElementById("indexBtn");

  if (!overviewBtn || !indexBtn) return;

  function setActive(btn) {
    [overviewBtn, indexBtn].forEach((b) =>
      b.classList.toggle(
        "is-active",
        b === btn
      )
    );
  }

  overviewBtn.addEventListener("click", () =>
    setActive(overviewBtn)
  );

  indexBtn.addEventListener("click", () =>
    setActive(indexBtn)
  );
})();
