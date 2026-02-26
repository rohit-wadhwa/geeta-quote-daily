# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Geeta Quote Daily is a Chrome extension (Manifest V3) and standalone website that displays daily Bhagavad Gita quotes with background imagery. It is 100% vanilla JavaScript — no framework, no TypeScript, no bundler, no package manager, and zero dependencies.

### Running the application

Serve the project root as a static site:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in Chrome. The `promoHandler.js` detects non-extension context and shows the "Get Chrome Extension" banner (expected behavior when running as a website).

### Linting

No linting toolchain is configured in the project. For ad-hoc linting, use `npx eslint *.js` (requires Node.js, downloads eslint on the fly). Treat all warnings as pre-existing code patterns.

### Tests

No automated test suite exists. Manual testing is done by loading the page in Chrome and interacting with the UI features: Reload, Language Toggle (Hindi/English), Chapters browser, Magic Rain effect, and online/offline status.

### Key caveats

- The app fetches quotes from `https://vedicscriptures.github.io/slok` — internet access is required for full functionality. When offline, cached quotes from `localStorage` are displayed and a red "You are offline" indicator appears in the top-right corner.
- `config.json` is loaded at runtime via `fetch()`, not imported — the dev server must serve it correctly (any standard static server works).
- `background.js` uses Chrome extension APIs (`chrome.alarms`, `chrome.storage`) that are unavailable when running as a website. Console errors about `chrome` being undefined are expected in website mode and do not affect the main quote display functionality.
- Demo screenshots and video are in the `demo/` directory and referenced from `README.md`.

### Deployment architecture

This project deploys to **two targets** from the same repo. Be careful about what goes where:

| Target | Mechanism | What gets deployed |
|---|---|---|
| **Vercel** (website) | Auto-deploy on push to `main` only | App files + `newsletters/` (newsletters are linked from external sources and must remain accessible on Vercel) |
| **Chrome Web Store** | GitHub Actions `deploy.yml` on push to `main` | Extension-only files (no docs, no `demo/`, no `newsletters/`, no `vercel.json`) |
| **GitHub** | Git repo | Everything including `demo/` screenshots/video for README |

Key rules:
- **Vercel deploys only on `main`** — non-main branches are skipped via `ignoreCommand` in `vercel.json`. This keeps the project within the free (Hobby) plan limits.
- **No build or install step** — Vercel serves static files directly. `vercel.json` sets `buildCommand` and `installCommand` to `null`. Do not add a `package.json` — it will cause Vercel to try running build/install commands.
- **`newsletters/` must stay on Vercel** — newsletter HTML files are accessed via direct links. They are excluded from the Chrome extension zip but NOT from Vercel.
- **`demo/` is GitHub-only** — excluded from both Vercel (`.vercelignore`) and Chrome extension (`deploy.yml`).
- **`.vercelignore`** controls what Vercel skips; **`deploy.yml` zip exclusions** control what goes into the Chrome extension package.
- **Free plan** — do not enable any Vercel Pro features (Rolling Releases, Prioritize Production Builds, etc.).
