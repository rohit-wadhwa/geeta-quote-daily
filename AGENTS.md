# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Geeta Quote Daily is a Chrome extension (Manifest V3) and standalone website that displays daily Bhagavad Gita quotes with background imagery. It is 100% vanilla JavaScript — no framework, no TypeScript, no bundler.

### Running the application

Serve the project root as a static site. The simplest approach:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in Chrome. The `promoHandler.js` detects non-extension context and shows the "Get Chrome Extension" banner (expected behavior when running as a website).

Alternatively: `npm run serve` (defined in `package.json`).

### Linting

```
npm run lint
```

Runs ESLint on all `*.js` files. Config is in `eslint.config.mjs`. Pre-existing warnings (6 total — unused vars and useless assignments) are from the original codebase and should not block work.

### Tests

No automated test suite exists. `npm test` exits cleanly. Manual testing is done by loading the page in Chrome and interacting with the UI (Reload, Language Toggle, Chapters, Magic Rain).

### Key caveats

- The app fetches quotes from `https://vedicscriptures.github.io/slok` — internet access is required for full functionality. If offline, cached quotes are displayed.
- `config.json` is loaded at runtime via `fetch()`, not imported — the dev server must serve it correctly (any standard static server works).
- `background.js` uses Chrome extension APIs (`chrome.alarms`, `chrome.storage`) that are unavailable when running as a website. Console errors about `chrome` being undefined are expected in website mode.
- The `node_modules/` directory is for dev tooling only (ESLint). It is not part of the extension or website deployment.
