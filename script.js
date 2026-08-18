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
    const cardWidth =
      cards[0].getBoundingClientRect().width || 240;

    return cardWidth * 0.38;
  }

  let spacing = getSpacing();
  let totalWidth = spacing * count;

  let offset = 0;
  let targetOffset = 0;
  let currentFrontIndex = -1;

  function wrap(x) {
    let w = ((x % totalWidth) + totalWidth) % totalWidth;

    if (w > totalWidth / 2) {
      w -= totalWidth;
    }

    return w;
  }

  /*
   * Create thumbnails.
   * YouTube thumbnails work directly.
   * Vimeo thumbnails use Vimeo's oEmbed service.
   */

  function getYouTubeId(url) {
    const match = url.match(
      /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^?&/]+)/
    );

    return match ? match[1] : null;
  }

  function addYouTubeThumbnail(card, url) {
    const id = getYouTubeId(url);

    if (!id) return;

    const fallback = card.querySelector(".card-fallback");

    if (!fallback) return;

    const image = document.createElement("img");

    image.className = "card-thumbnail";
    image.src =
      "https://img.youtube.com/vi/" +
      id +
      "/hqdefault.jpg";

    image.alt = "";
    image.draggable = false;

    fallback.innerHTML = "";
    fallback.appendChild(image);
  }

  function addVimeoThumbnail(card, url) {
    const fallback = card.querySelector(".card-fallback");

    if (!fallback) return;

    const apiUrl =
      "https://vimeo.com/api/oembed.json?url=" +
      encodeURIComponent(url);

    fetch(apiUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error("Vimeo thumbnail request failed");
        }

        return response.json();
      })
      .then(function(data) {
        if (!data.thumbnail_url) return;

        const image = document.createElement("img");

        image.className = "card-thumbnail";
        image.src = data.thumbnail_url;
        image.alt = "";
        image.draggable = false;

        fallback.innerHTML = "";
        fallback.appendChild(image);
      })
      .catch(function(error) {
        console.warn(
          "Could not load Vimeo thumbnail:",
          error
        );
      });
  }

  function createThumbnails() {
    cards.forEach(function(card) {
      const url = card.dataset.video;

      if (!url) return;

      if (url.indexOf("youtube.com") !== -1) {
        addYouTubeThumbnail(card, url);
      }

      if (url.indexOf("vimeo.com") !== -1) {
        addVimeoThumbnail(card, url);
      }
    });
  }

  /*
   * Stop any currently open video.
   */

  function stopAllVideos() {
    cards.forEach(function(card) {
      const iframe = card.querySelector(".card-iframe");

      if (iframe) {
        iframe.remove();
      }

      const fallback = card.querySelector(".card-fallback");

      if (fallback) {
        fallback.style.display = "";
      }

      card.classList.remove("is-playing");
    });
  }

  /*
   * Open the video inside the clicked card.
   */

  function playCard(card) {
    const url = card.dataset.video;

    if (!url) return;

    stopAllVideos();

    const iframe = document.createElement("iframe");

    iframe.className = "card-iframe";
    iframe.title = card.dataset.title || "Video";

    iframe.allow =
      "autoplay; fullscreen; picture-in-picture; encrypted-media";

    iframe.allowFullscreen = true;
    iframe.setAttribute("frameborder", "0");

    const separator =
      url.indexOf("?") !== -1 ? "&" : "?";

    iframe.src =
      url +
      separator +
      "autoplay=1&playsinline=1";

    const fallback = card.querySelector(".card-fallback");

    if (fallback) {
      fallback.style.display = "none";
    }

    const face = card.querySelector(".card-face");

    if (face) {
      face.appendChild(iframe);
    }

    card.classList.add("is-playing");
  }

  /*
   * Render stack.
   */

  function render() {
    offset +=
      (targetOffset - offset) *
      (prefersReducedMotion ? 1 : 0.15);

    const positioned = cards.map(function(card, i) {
      const raw = i * spacing - offset;
      const x = wrap(raw);

      return {
        card: card,
        i: i,
        x: x
      };
    });

    positioned.sort(function(a, b) {
      return a.x - b.x;
    });

    positioned.forEach(function(p, rank) {
      const depth = rank;
      const scale = 1 - depth * 0.014;

      p.card.style.transform =
        "translate3d(" +
        p.x +
        "px, 0, " +
        -depth * 7 +
        "px) scale(" +
        scale +
        ")";

      p.card.style.zIndex =
        String(count - depth);
    });

    const front = positioned[0];

    if (front && front.i !== currentFrontIndex) {
      currentFrontIndex = front.i;

      cards.forEach(function(card, i) {
        card.classList.toggle(
          "is-front",
          i === front.i
        );
      });

      if (activeIndex) {
        activeIndex.textContent =
          String(front.i + 1).padStart(2, "0") +
          " / " +
          totalLabel;
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

  /*
   * Mouse / touch dragging and clicking.
   */

  let dragging = false;
  let didDrag = false;
  let dragStartX = 0;
  let dragStartOffset = 0;

  scene.addEventListener("pointerdown", function(e) {
    dragging = true;
    didDrag = false;

    dragStartX = e.clientX;
    dragStartOffset = targetOffset;

    scene.classList.add("is-dragging");

    scene.setPointerCapture(e.pointerId);
  });

  scene.addEventListener("pointermove", function(e) {
    if (!dragging) return;

    const dx = e.clientX - dragStartX;

    if (Math.abs(dx) > 8) {
      didDrag = true;
    }

    targetOffset =
      dragStartOffset + dx * 1.4;
  });

  scene.addEventListener("pointerup", function(e) {
    if (!didDrag) {
      const card = e.target.closest(".card");

      if (card) {
        playCard(card);
      }
    }

    dragging = false;
    scene.classList.remove("is-dragging");
  });

  scene.addEventListener("pointercancel", function() {
    dragging = false;
    scene.classList.remove("is-dragging");
  });

  /*
   * Wheel.
   */

  scene.addEventListener(
    "wheel",
    function(e) {
      e.preventDefault();

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX)
          ? e.deltaY
          : e.deltaX;

      targetOffset -= delta * 0.6;
    },
    { passive: false }
  );

  /*
   * Keyboard.
   */

  window.addEventListener("keydown", function(e) {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown"
    ) {
      targetOffset += spacing;
    }

    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      targetOffset -= spacing;
    }
  });

  /*
   * Resize.
   */

  window.addEventListener("resize", function() {
    spacing = getSpacing();
    totalWidth = spacing * count;
  });

  createThumbnails();
  requestAnimationFrame(render);
})();


/*
 * Overview / Index buttons.
 */

(function pillToggle() {
  const overviewBtn =
    document.getElementById("overviewBtn");

  const indexBtn =
    document.getElementById("indexBtn");

  if (!overviewBtn || !indexBtn) return;

  function setActive(btn) {
    [overviewBtn, indexBtn].forEach(function(button) {
      button.classList.toggle(
        "is-active",
        button === btn
      );
    });
  }

  overviewBtn.addEventListener("click", function() {
    setActive(overviewBtn);
  });

  indexBtn.addEventListener("click", function() {
    setActive(indexBtn);
  });
})();
