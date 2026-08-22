# Anas Ahmed — Cinematic Portfolio

An interactive personal portfolio for **Muhammad Anas Ahmed Shaikh** (Karachi): a hand-drawn notebook intro, a 3D orbital Earth scene, a cinematic dive through the atmosphere, and a newspaper-style portfolio (“The Daily Developer”).

Built with React, TypeScript, Vite, Three.js / React Three Fiber, and GSAP.

---

## Experience flow

```
INTRO  →  SPACE  →  EARTH DIVE  →  NOTEBOOK
```

| Stage | What happens |
| --- | --- |
| **Intro** | Sketchbook / ink intro, signature draw-in, handoff into space |
| **Space** | Orbital Earth with stars, atmosphere, clouds, city lights, HUD |
| **Earth Dive** | Camera descent toward Earth, cloud flight, solar flare flash |
| **Notebook** | DOM newspaper portfolio — profile, work, projects, honors, resume & contact |

Stage routing lives in `src/app/experience.ts` and `src/components/ExperienceController.tsx`. Space and Earth Dive share one Canvas (`OrbitalExperience`) so the planet stays mounted across the transition.

A **Restart Journey** control (top-right, hidden on Intro) returns to the beginning and resets audio.

---

## Tech stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript |
| Bundler | Vite 8 |
| 3D | Three.js, React Three Fiber, Drei |
| Motion | GSAP |
| Audio | Web Audio helpers in `src/audio/` |

No backend, database, or auth. Content is static React/HTML/CSS for the notebook so it stays easy to update and accessible.

---

## Getting started

**Requirements:** Node.js 20+ (or current LTS) and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Typecheck (`tsc -b`) + production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run generate:signature` | Regenerate intro signature SVG paths from Allura (`scripts/generateSignaturePaths.mjs`) |

---

## Project structure

```
src/
  app/                 # App shell, stage enum, global experience CSS
  audio/               # Sound path map + playback / unlock helpers
  components/
    intro/             # Sketchbook intro
    space/             # Orbital Earth, stars, milky way, clouds
    space-hud/         # Space UI chrome
    earth-dive/        # Dive camera, cloud flight, sun flare
    notebook/          # Newspaper portfolio (pages, CSS, photo map)
  hooks/               # Dive progress, planet yaw, scroll helpers
  assets/fonts/        # Bundled Allura + OFL license text
public/
  assets/
    notebook/          # Newspaper photographs + SOURCES.md
    sounds/            # Stage SFX / beds + SOURCES.md
  textures/
    earth/             # Day, night, clouds, milky way maps
  resume anas ahmed.pdf
scripts/               # Signature path generator
```

**Entry:** `index.html` → `src/main.tsx` → `src/app/app.tsx` → `ExperienceController`.

**Content to edit most often:**

- Profile / links / edition meta → `src/components/notebook/newspaperData.ts`
- Page copy → `src/components/notebook/pages/*`
- Photo paths → `src/components/notebook/notebookPhotos.ts` (files under `public/assets/notebook/`)
- Sound paths → `src/audio/sounds.ts`

---

## Notebook sections

“The Daily Developer” — Karachi edition:

1. Front Page  
2. Experience  
3. Projects  
4. Honors & Certifications  
5. Resume & Contact  

Resume PDF: `public/resume anas ahmed.pdf` (linked from contact with a URL-encoded path).

---

## Audio

Sounds live in `public/assets/sounds/` and are referenced from `src/audio/sounds.ts`:

| File | Role |
| --- | --- |
| `intro-reveal.mp3` | Intro reveal |
| `space-reveal.mp3` | Entering space |
| `space.mp3` | Orbital / dive bed (volume follows dive distance) |
| `rocket.mp3` | Dive / rocket cue |
| `notebook-reveal.mp3` | Newspaper entrance |
| `page-flip.mp3` | Page turn |

Playback, unlock-on-gesture, and stage resets are handled in `src/audio/stageAudio.ts`. Browsers require a user gesture before audio can start; the app installs unlock handlers early.

**Legal:** all clips are from [Pixabay](https://pixabay.com/) under the
[Pixabay Content License](https://pixabay.com/service/license-summary/)
(attribution not required; details in [`public/assets/sounds/SOURCES.md`](public/assets/sounds/SOURCES.md)).

---

## Assets & attribution (legal)

Third-party media must keep their licenses. Primary records:

| Record | Covers |
| --- | --- |
| [`public/assets/notebook/SOURCES.md`](public/assets/notebook/SOURCES.md) | Newspaper photographs |
| [`public/textures/SOURCES.md`](public/textures/SOURCES.md) | Earth / sky textures |
| [`public/assets/sounds/SOURCES.md`](public/assets/sounds/SOURCES.md) | Audio |
| [`src/assets/fonts/OFL-Allura.txt`](src/assets/fonts/OFL-Allura.txt) | Allura (intro signature) |

### Fonts

| Font | Use | License |
| --- | --- | --- |
| **Allura** | Intro signature glyph outlines (`Allura-Regular.ttf`) | [SIL Open Font License 1.1](https://scripts.sil.org/OFL) — license file in repo |
| **Caveat** | Handwriting UI (intro / notebook accents) | SIL OFL — loaded via [Google Fonts](https://fonts.google.com/specimen/Caveat) |
| **Libre Baskerville** | Newspaper body / display | SIL OFL — [Google Fonts](https://fonts.google.com/specimen/Libre+Baskerville) |
| **Share Tech Mono** | Space HUD / restart chip | SIL OFL — [Google Fonts](https://fonts.google.com/specimen/Share+Tech+Mono) |

### Earth & sky textures

Maps under `public/textures/earth/`:

- `earth-day.jpg`, `earth-night.jpg`, `earth-clouds.jpg`, `milky-way.jpg`

**Source:** [Solar System Scope — Solar Textures](https://www.solarsystemscope.com/textures/)  
**License:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (attribution required)

> Earth and space textures by [Solar System Scope](https://www.solarsystemscope.com/textures/) (INOVE), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Based on NASA elevation and imagery data; colors may be enhanced.

Full file mapping: [`public/textures/SOURCES.md`](public/textures/SOURCES.md).

### Notebook photographs

Most plates are **Pexels** stand-ins (free for commercial use; attribution not required by Pexels, but recorded in `SOURCES.md`). Originals:

- `cross1.jpg`, `cross2.jpg` — CrossViewNet project plates  
- `portrait.jpg` — GitHub avatar (`anasahmed81103`); replace with a higher-resolution original when ready  

`campus.jpg` is used in the UI with a Pexels-style credit — confirm its real source in `SOURCES.md` if it is not already listed with a URL.

### Audio

All stage sounds are from [Pixabay](https://pixabay.com/), under the
[Pixabay Content License](https://pixabay.com/service/license-summary/)
(free for commercial use; attribution not required). Recorded in
[`public/assets/sounds/SOURCES.md`](public/assets/sounds/SOURCES.md).

### Your original work

Original code, notebook layout, CrossViewNet plates, and any self-authored writing/audio remain yours. Add a root `LICENSE` if you want to clarify reuse of the **source code** (separate from third-party asset licenses).

---

## Performance notes

- Prefer lightweight textures and procedural effects where possible.  
- Space and Earth Dive share one WebGL canvas to avoid remount cost.  
- Notebook is DOM/CSS so it stays readable on phones; 3D stages target capable desktop and mid-range mobile.  
- Test audio unlock and the full Intro → Notebook path on real devices before launch.

---

## Development notes

- Prefer editing content in the notebook data/pages files rather than hard-coding copy in layout components.  
- When adding assets: keep filenames stable or update the path maps, and **always** record source + license next to the asset folder.

---

## Author

**Muhammad Anas Ahmed Shaikh** — Full-Stack Software Engineer & AI Specialist  
Karachi, Pakistan  

- GitHub: [anasahmed81103](https://github.com/anasahmed81103)  
- LinkedIn: [anasahmed81103](https://www.linkedin.com/in/anasahmed81103/)  
- Email: anasahmed81103@gmail.com  

---

## Disclaimer

Third-party assets remain under their respective licenses (Pixabay Content
License for sounds, CC BY 4.0 for Solar System Scope textures, Pexels for
most notebook plates, SIL OFL for fonts). See the `SOURCES.md` files linked
above for the authoritative per-file record.
