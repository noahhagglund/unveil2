# Noah Hägglund — Isometric Card Stack (light / glass)

Same infinite isometric stack as before, restyled to match a light,
glassy, acrylic-panel look: white background, translucent blurred
cards with a soft sheen, and pill-shaped nav/UI chrome in the
corners. Plain HTML/CSS/JS, no build step, no dependencies.

A note on "exact": this matches the *style* — the white background,
the glass-panel card material, the tight near-isometric angle, the
pill-nav / corner-badge chrome — as closely as I could get it from
the screenshot. I didn't copy any actual code, assets, or branding
from unveil.fr itself; the nav labels, badge text, and project names
here are all placeholders for you to replace.

## How it works

- `.stack-track` has one fixed 3D tilt — `rotateX(11deg) rotateZ(-32deg)`
  — mostly Z-axis rotation so cards stay close to upright, tuned
  tighter/steeper than the first version to match the reference angle.
- Every card is positioned by `script.js`, every frame, as
  `translate3d(x, 0, depth)`. `x` comes from `index * spacing - offset`,
  wrapped with modulo math — that's what makes it infinite in either
  direction; `offset` just keeps growing/shrinking with your input.
- `.card-face` is the glass treatment: semi-transparent background,
  `backdrop-filter: blur()`, a light border, and `.card-sheen` adds a
  diagonal highlight streak like light catching acrylic.
- Whichever card is nearest the front gets `.is-front` (stronger
  shadow, full-brightness video) and its title/tag/index appear
  bottom-left.
- Input: wheel/trackpad, click-drag, touch-drag, or arrow keys.

## Adding your own videos

Each card shows a soft gradient (`.card-fallback`) until real footage
is wired in.

1. Export short (5–15s) muted loops, ideally H.264 `.mp4`, under
   ~8MB each.
2. Put them in `/assets` as `project-01.mp4` … `project-08.mp4` (or
   update the `<source src="...">` paths in `index.html`).
3. Delete that card's `<div class="card-fallback">` once real footage
   loads — the glass sheen (`.card-sheen`) stays either way.

## Customize

- **Tilt** — `rotateX(11deg) rotateZ(-32deg)` on `.stack-track` in
  `styles.css`.
- **Glass strength** — `--card-bg`, `--card-border`, and the
  `backdrop-filter: blur(6px)` on `.card-face` in `styles.css`. Raise
  the blur or lower the background alpha for a more frosted look.
- **Overlap** — `spacing = cardWidth * 0.38` in `script.js`'s
  `getSpacing()`.
- **Nav / badges** — text and links live directly in `index.html`
  (`.pill-nav`, `.badge`, `.pill-group`); the "Overview / Index"
  buttons are visual-only right now (see `pillToggle()` in
  `script.js`) — wire them to an alternate layout if you build one.
- **Colors** — the `:root` block at the top of `styles.css`.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial stack"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

Then **Settings → Pages** → Source: `Deploy from a branch` → `main` →
`/ (root)`. Live shortly after at
`https://<your-username>.github.io/<repo>/`.
