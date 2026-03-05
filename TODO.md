# Geeta Quote Daily — Roadmap & TODO

## v2.1 — Performance, Images & Core Features

### Performance
- [x] Convert all background images to WebP format (#7) ✅
  - ~~bg1-bg6.jpg → WebP (target: max 200KB each)~~ Done: bg1-bg6.webp (148–246KB each)
  - ~~Replace `background.png` (5.3MB) with `background.webp` (309KB)~~ Done: background.webp (316KB)
  - ~~Update `config.json` references~~ Done: all references point to .webp
- [ ] Lazy-load non-critical resources (#8)
  - Preload only the first random background
  - Use `requestIdleCallback` for magic rain / sparkle setup
  - Defer audio init until user interaction
  - Inline critical CSS
- [ ] Complete CSP compliance — remove `unsafe-inline` (#9)
  - Convert newtab.js inline styles to CSS classes (68 inline style usages remain)
  - Convert magicRain.js inline styles to CSS classes (10 inline style usages remain)
  - Remove `'unsafe-inline'` from manifest.json
  - **Approach:** For each component: identify inline styles → create CSS classes in style.css → replace `style.x = y` with `classList.add/remove` → test → finally remove `unsafe-inline`

### API Reliability
- [~] Reduce dependency on third-party Bhagavad Gita API (#27) — **Partially Done**
  - [x] Bundle local JSON as offline fallback — Done: `fallback-verses.json` exists (13 verses; expand to 50-100)
  - [x] Increase quote cache expiry from 24h to 7 days — Done: `cache.expiry` = 604,800,000ms
  - [x] Add fallback logic — Done: newtab.js falls back to cached/bundled data when API fails
  - [ ] Add API health check on startup — silently fall back to cached/bundled data
  - [ ] Expand `fallback-verses.json` from 13 to 50-100 popular verses
  - **Medium-term:** Mirror API data in own GitHub Pages as backup
  - **Long-term:** Self-host all 700 verses, remove runtime API dependency

### Images
- [ ] Add 10+ new high-quality background images (#10)
  - Krishna & Arjuna chariot (Kurukshetra)
  - Peaceful meditation scenes
  - Temples and sacred places
  - Cosmic/divine form (Vishwaroop)
  - Sunrise/sunset landscapes
  - Radha-Krishna devotional art
  - All WebP, max 200KB, 1920x1080
  - Sources: VividImg.com, NoMoreCopyright.com, Easy-Peasy.AI, custom AI generation

### Features
- [ ] Share quotes to WhatsApp, Twitter/X, Instagram (#11)
  - Social sharing must use CSP-compliant implementation (no inline styles)
  - Use classList and predefined CSS classes for dynamic styling
  - Implement non-inline SVG icons for social platforms
- [ ] Bookmark / Favorite verses (#12)
- [ ] Settings panel with gear icon (#13)
  - Date/time format (12/24h, seconds, AM/PM)
  - Default language preference
  - Background image category preference
- [ ] Enhance mobile responsiveness and accessibility (#24)
  - All controls touch-friendly (min 44px tap targets)
  - ARIA labels and keyboard navigation

---

## v2.2 — Languages, Audio & Engagement

- [ ] Multi-language support — 6+ languages (#14)
  - Sanskrit, Gujarati, Telugu, Tamil, Bengali, Marathi
  - Replace simple toggle with language dropdown
- [ ] Audio verse recitation (#15)
- [ ] Dark/Light theme toggle (#16)
- [ ] Daily streak counter (#17)
- [ ] Daily notification reminder (#18)
- [ ] Documentation — codebase, architecture, comments (#25)
- [ ] Automated tests and cross-browser testing (#26)

---

## v3.0 — Advanced Features

- [ ] Search by chapter and verse (#19)
- [ ] Reading progress tracker (#20)
- [ ] Custom background upload (#21)

---

## Growth & Store Optimization (#22)

- [ ] More screenshots in Chrome Web Store listing
- [ ] Upload demo video to YouTube
- [ ] Optimize listing keywords
- [ ] Localize listing to Hindi
- [ ] Subtle "Rate us" prompt after 7 days
- [ ] Better promotional images

---

## Completed

### v2.1 (partial)
- [x] Converted all background images to WebP format (#7)
  - bg1-bg6.webp, background.webp — all config.json and style.css refs updated
- [x] Bundled offline fallback verses (`fallback-verses.json`) (#27 partial)
- [x] Increased cache expiry to 7 days (#27 partial)
- [x] Added API fallback logic in newtab.js — uses cached/bundled verses when API fails (#27 partial)
- [x] Created full v2.1/v2.2/v3.0 roadmap with GitHub issue links in TODO.md

### v2.0.3
- [x] Fixed promo handler to properly show/hide extension promo
- [x] Added reset utility function for testing promo visibility
- [x] Updated manifest version to 2.0.3
- [x] Fixed cursor.js to comply with CSP requirements
- [x] Added utility classes for future CSP compliance work
- [x] Updated newsletter and Chrome store description
- [x] Fixed cursor movement by properly implementing CSS variables
- [x] Fixed cursor bouncing issue by reverting to direct style attribute approach

### Development Setup
- [x] Added demo screenshots and video to repo
- [x] Updated README with feature gallery
- [x] Added `.vercelignore` for lean Vercel deployments
- [x] Updated `deploy.yml` to exclude non-extension files from Chrome zip
- [x] Configured Vercel to deploy only on `main` branch (free plan)
- [x] Added `vercel.json` for static site config
- [x] Added `AGENTS.md` with deployment architecture docs
