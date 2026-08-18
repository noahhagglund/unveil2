# Noah Hägglund — Portfolio (isometric scroll stack)

A single-page, dependency-free site (plain HTML/CSS/JS, no build
step) built around an isometric crate of project cards: evenly
spaced, tilted planes that you scroll *through*, with a hover pop
that highlights whichever one you're on.

## How it works

- `.stack-track` (in `styles.css`) gets a single fixed 3D tilt —
  `rotateX(58deg) rotateZ(-38deg)` — which turns a plain flex row of
  cards into the diagonal, evenly-spaced receding stack.
- `script.js` doesn't touch that tilt. It only ever updates one CSS
  variable, `--scroll-x`, based on how far you've scrolled through
  `#work`. Because `--scroll-x` is applied *inside* the already-tilted
  coordinate space, sliding it left/right reads on screen as flipping
  through the crate along the diagonal.
- `#work` is given extra height (roughly one viewport per card) so
  there's enough scroll distance to flip through all of them before
  the next section takes over. It's `position: sticky`, so the stack
  stays pinned in view for that whole scroll range.
- Hovering (or focusing, for keyboard users) a `.card` pops it
  `translateZ(90px)` toward the viewer, scales it up slightly, and
  brightens its video — the "highlight" effect.
- Whichever card is nearest the current scroll position has its video
  playing; every other video is paused, so nothing wastes CPU/battery
  off in the stack.

On small screens and for anyone with reduced-motion enabled, the 3D
tilt and scroll-jacking are dropped entirely in favor of a plain
horizontally-scrollable strip of cards — same content, no motion.

## Adding your own videos

Each card currently shows a soft gradient (`.card-fallback`) because
there's no real footage wired in.

1. Export short (5–15s) muted loops, ideally H.264 `.mp4`, under
   ~8MB each.
2. Put them in `/assets` as `project-01.mp4` … `project-06.mp4` (or
   update the `<source src="...">` paths in `index.html`).
3. Once a real file loads, delete that card's
   `<div class="card-fallback">` — it's just a placeholder.

## Customize

- **Card count** — add or remove `<article class="card">` blocks in
  `index.html`; the scroll math and counter adapt automatically.
- **Tilt angle** — the `rotateX(58deg) rotateZ(-38deg)` on
  `.stack-track` in `styles.css` controls the isometric angle; steeper
  `rotateX` flattens the stack, more negative `rotateZ` steepens the
  diagonal.
- **Card size / spacing** — `.card` width and `.stack-track` gap in
  `styles.css`.
- **Colors** — the `:root` block at the top of `styles.css`.

## Deploy to GitHub Pages

1. Push everything (including `/assets` once you've added videos):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
2. **Settings → Pages** → Source: `Deploy from a branch` → `main` →
   `/ (root)`.
3. Live at `https://<your-username>.github.io/<repo>/` shortly after.

If your videos are large, GitHub's file-size limits make an external
host (Vimeo/Mux/S3/Cloudflare Stream) a better fit than committing
them directly — just point `<source src="...">` at that URL instead.
