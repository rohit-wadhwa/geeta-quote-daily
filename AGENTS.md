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
