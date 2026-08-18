# Noah Hägglund — Portfolio (video-scroll version)

A single-page, dependency-free site (plain HTML/CSS/JS, no build
step) built around the interaction unveil.fr is known for: large,
full-bleed video panels that scale and un-clip into view as you
scroll, each playing only while it's on screen.

## How the video effect works

Each project in `index.html` is a `.project` block containing a
`<video>`. `script.js` uses an `IntersectionObserver` to:

- add `.is-visible` to the project once it's ~50% in view, which
  triggers the CSS scale/clip-path transition in `styles.css`
- call `video.play()` when it comes into view, and `video.pause()`
  when it scrolls out — so nothing plays off-screen

There's no real footage wired in yet — each `<video>` currently
falls back to a soft gradient (`.project-media-fallback`) so the
page looks and animates correctly out of the box.

## Adding your own videos

1. Export short (5–15s) muted loops, ideally H.264 `.mp4`, under
   ~8MB each so the page stays fast — screen recordings, DAW
   session footage, behind-the-scenes clips, or a final cut all
   work.
2. Put them in `/assets` as `project-01.mp4`, `project-02.mp4`, etc.
   (or update the `<source src="...">` paths in `index.html` to
   whatever you name them).
3. Once a real file loads, you can delete that project's
   `<div class="project-media-fallback">` — it's just a placeholder.
4. Optionally set a `poster="assets/project-01.jpg"` on the
   `<video>` for a still frame while it loads.

## Customize

- **Text** — titles, categories, years, bio, and contact info are
  all directly in `index.html`.
- **Colors** — edit the `:root` block at the top of `styles.css`.
- **Reveal feel** — `.project-media` and `.project-video` in
  `styles.css` control the scale/clip-path amounts and timing if
  you want the reveal snappier or more dramatic.

## Deploy to GitHub Pages

1. Create a new repo (e.g. `portfolio`) and push everything,
   including the `/assets` folder with your videos:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages** → Source: `Deploy from a
   branch` → branch `main`, folder `/ (root)`.
3. Live in a minute or two at
   `https://<your-username>.github.io/<repo>/`.

Note: GitHub has a 100MB per-file / soft repo-size limits — if your
videos are large, consider hosting them elsewhere (e.g. an S3
bucket, Cloudflare Stream, Vimeo/Mux) and pointing the `<source
src="...">` at that URL instead of committing them to the repo.
