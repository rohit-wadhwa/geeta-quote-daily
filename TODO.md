# Geeta Quote Daily — Roadmap & TODO

## v2.1 — Performance, Images & Core Features

### Performance
- [ ] Convert all background images to WebP format (#7)
  - bg1-bg6.jpg → WebP (target: max 200KB each)
  - Replace `background.png` (5.3MB) with `background.webp` (309KB)
  - Update `config.json` references
- [ ] Lazy-load non-critical resources (#8)
  - Preload only the first random background
  - Use `requestIdleCallback` for magic rain / sparkle setup
  - Defer audio init until user interaction
  - Inline critical CSS
- [ ] Complete CSP compliance — remove `unsafe-inline` (#9)
  - Convert newtab.js inline styles to CSS classes
  - Convert magicRain.js inline styles to CSS classes
  - Remove `'unsafe-inline'` from manifest.json
  - **Approach:** For each component: identify inline styles → create CSS classes in style.css → replace `style.x = y` with `classList.add/remove` → test → finally remove `unsafe-inline`

### API Reliability
- [ ] Reduce dependency on third-party Bhagavad Gita API (#27)
  - Bundle local JSON with ~50-100 popular verses as offline fallback
  - Increase quote cache expiry from 24h to 7 days
  - Add API health check on startup — silently fall back to cached/bundled data
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
