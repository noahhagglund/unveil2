# Noah Hägglund — Portfolio

A single-page, dependency-free portfolio site (plain HTML/CSS/JS —
no build step) inspired by the dark, editorial, motion-driven feel
of studio sites like unveil.fr, reworked around a sound-design
identity: a running timecode counter, waveform visuals, and a
mixing-console "channel strip" for skills.

## Files

- `index.html` — all page content
- `styles.css` — design tokens live at the top in `:root`
- `script.js` — timecode, scroll reveals, waveform canvases, cursor

## Customize

1. **Text** — edit directly in `index.html`: your name, tagline,
   the four work cards (title / category / year), studio bio, and
   contact email/socials.
2. **Colors** — change the hex values in the `:root` block at the
   top of `styles.css`. Everything else derives from those.
3. **Fonts** — swap the Google Fonts `<link>` in `index.html` and
   the `--font-display` / `--font-body` / `--font-mono` variables
   in `styles.css`.
4. **Projects** — duplicate a `<article class="work-card">` block
   in `index.html` to add more; each one gets its own hover
   waveform automatically.
5. **Real audio** — the waveform canvases are decorative/generative,
   not tied to real tracks. If you want to embed actual audio,
   drop in a `<audio>` element or embed SoundCloud/Bandcamp inside
   a work card.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `portfolio`).
2. Push these three files (`index.html`, `styles.css`, `script.js`)
   to the repo root:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to
   `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save — your site will be live in a minute or two at
   `https://<your-username>.github.io/<repo>/`.

No build tools, no `node_modules`, nothing else to install.
