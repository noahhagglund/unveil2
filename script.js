/* =====================================================
   VIDEO THUMBNAILS + EMBEDDED PLAYERS
   ===================================================== */

.card-thumbnail {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.card-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  z-index: 5;
}

.card-fallback {
  overflow: hidden;
}

.card.is-playing .card-sheen {
  z-index: 10;
}
