# Noah Hägglund — Isometric Card Stack

A single-purpose page: an infinitely-loopable, isometric stack of
project cards. No hero, no bio, no contact section — just the stack,
full screen. Plain HTML/CSS/JS, no build step, no dependencies.

## How it works

- `.stack-track` has one fixed 3D tilt — `rotateX(14deg) rotateZ(-28deg)`
  — mostly a Z-axis rotation so the cards stay close to upright, with
  just enough X tilt to read as isometric. This is the angle to tune
  if you want it flatter/steeper (see Customize below).
- Every card is positioned by `script.js`, every frame, as
  `translate3d(x, 0, depth)` — not by normal CSS layout. `x` comes
  from `index * spacing - offset`, then wrapped with modulo math into
  a fixed range. That wrap is what makes it infinite: there's no
  first or last card, `offset` can grow forever in either direction
  and every card's on-screen `x` just cycles.
- Depth (`z-index`, slight scale, slight brightness falloff) is
  recalculated each frame by sorting cards by their wrapped `x` —
  whichever is closest to the front is index 0 and gets the "is-front"
  highlight, its video plays, and its title appears bottom-left.
- Input: mouse wheel / trackpad, click-and-drag, touch drag, or arrow
  keys all just nudge the same `offset` value. Nothing is tied to
  page scroll — the page itself doesn't scroll at all.

## Adding your own videos

Each card shows a soft gradient (`.card-fallback`) until real footage
is wired in.

1. Export short (5–15s) muted loops, ideally H.264 `.mp4`, under
   ~8MB each.
2. Put them in `/assets` as `project-01.mp4` … `project-08.mp4` (or
   update the `<source src="...">` paths in `index.html`).
3. Once a real file loads, delete that card's
   `<div class="card-fallback">`.

## Customize

- **Card count** — add/remove `<article class="card">` blocks in
  `index.html`, each with `data-title` and `data-tag`. Everything
  else (counter, loop math) adapts automatically.
- **Tilt** — `rotateX(14deg) rotateZ(-28deg)` on `.stack-track` in
  `styles.css`. More negative `rotateZ` = steeper diagonal; more
  `rotateX` = more "flat on a table" like the earlier version.
- **How tightly cards overlap** — `spacing = cardWidth * 0.4` in
  `script.js`'s `getSpacing()`. Lower the `0.4` for tighter overlap,
  raise it to spread them out.
- **Scroll/drag sensitivity** — the `* 0.6` (wheel) and `* 1.4`
  (drag) multipliers in `script.js`.
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

If your videos are large, GitHub's size limits make an external host
(Vimeo/Mux/S3/Cloudflare Stream) a better fit than committing them —
just point `<source src="...">` at that URL instead.
