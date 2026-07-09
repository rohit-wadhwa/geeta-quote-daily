# Changelog

## [2.3.2] - Music button + playback fixes
- **Fixed the music button disappearing** when you press Stop or switch tracks: the old "graceful fallback" hid the button on any play hiccup. It now stays put and just resets its label.
- **Fixed no-audio**: removed a leftover `<source>` child that conflicted with the dynamically-set track URL (the media element wasn't fetching the file). Play now forces a `load()` when needed.

## [2.3.1] - Music reliability + UI fixes
- **Fixed "Play Music" not playing**: both tracks are now served locally (bundled) instead of streaming the 2nd track from GitHub raw, which was unreliable. Removed the `raw.githubusercontent.com` host permission (so no extra privacy justification needed).
- Music button label now tracks the audio's real play/pause state (no more stuck "Play Music" while it buffers).
- Restyled the track-selector dropdown to match the control buttons (was a plain dark box).
- Copyright year in the footer is now dynamic (© 2024–current year).

## [2.2.1] - Repo/store version reconciliation
- The published Web Store build was 2.2.0 while this repo was still tagged 2.0.3, though the code was **identical**. Advancing the repo to 2.2.1 so git is once again the source of truth and future releases publish cleanly.
- NOTE: audio (background music + rain) still loads from remote third-party URLs (saavncdn/mixkit) and is the cause of the reported "sound not working" issue. A local-audio fix is pending licensed audio assets — see extension-ops KB §3.1. This release does NOT yet fix audio.

All notable changes to the Geeta Quote Daily Chrome Extension will be documented in this file.

## [2.0.3] - 2024-03-20

### 🔒 Security & Compliance Improvements

- **Chrome Extension Compliance**: Updated codebase to ensure full compliance with Chrome Web Store guidelines
  - Updated Content Security Policy to allow inline styles for cursor functionality
  - Fixed cursor.js to work properly within Chrome extension CSP requirements
  - Fixed cursor movement by properly implementing CSS variables for positioning
  - Fixed extension promo button visibility when viewed as a website
  - Fixed close button functionality on extension promo to properly hide the element
  - Improved website/extension context detection and interface adaptation

- **Code Optimizations**:
  - Extracted promo handling code to separate module
  - Improved element state management with consistent class-based styling
  - Enhanced CSS organization with better utility classes
  - Optimized localStorage usage for user preferences

- **Performance Enhancements**:
  - Fixed memory leaks in animation handling
  - Improved resource cleanup for visual elements
  - Reduced duplicate code for common operations

### 🐛 Bug Fixes

- Fixed extension promo button visibility issues
- Improved extension context detection reliability
- Fixed cursor positioning with CSP-compliant approach
- Ensured proper state persistence for user preferences
- Fixed cursor bouncing issue by reverting to direct style attribute approach

## [2.0.2] - 2024-05-17

### 🚀 Performance Improvements

- **Memory Optimization**: Reduced memory footprint and improved performance
  - Optimized animation handling to pause when tab is not visible
  - Added cleanup mechanisms for magic rain and sparkle elements
  - Implemented separate update intervals for date and time displays
  - Limited maximum number of visual elements to prevent memory leaks

- **Audio Playback Enhancement**:
  - Continued audio playback when tab is not in focus
  - Improved rain sound toggle behavior for better user experience
  - Optimized volume control interaction

- **Visual Enhancements**:
  - Improved visibility of magic rain effect
  - Enhanced rain drop appearance with varied colors and sizes
  - Unified styling of rain controls for better visual consistency
  - Added transition effects for smoother UI interactions

### 🐛 Bug Fixes

- Fixed issues with rain sound playback when toggling controls
- Resolved styling inconsistencies in the rain control elements
- Improved state management for visual effects

## [2.0.1] - 2024-03-19

### ✨ New Features

- **Rain Sound Volume Control**: Added a sleek volume slider for rain sounds
  - Elegant pill-shaped design that matches the UI
  - Appears only when rain sound is enabled
  - Responsive sizing for different screen sizes
  - Smooth fade-in animation

### 🔧 Improvements

- **Enhanced Caching**: Optimized chapter data caching
  - Reduced unnecessary API calls
  - Implemented 7-day cache for chapter information
  - Added intelligent refresh strategy for popup data
  - Improved error handling with multiple fallback options

- **UI Enhancements**:
  - Refined control styling for better visual harmony
  - Improved responsive layout for mobile devices
  - More consistent animation effects

### 🐛 Bug Fixes

- Fixed volume slider overflow issues on smaller screens
- Resolved audio playback inconsistencies on some browsers
- Improved error handling for API connection failures

## [2.0.0] - 2024-03-18

### ✨ New Features

- **Magical Rain Effect**: Added an enchanting sparkle rain animation with customizable settings
  - Toggle rain effect with a dedicated button
  - Optional rain sound effects
  - Smooth fade in/out transitions
  - Performance-optimized particle system

- **Enhanced Audio Experience**
  - Added background Krishna flute music
  - New rain sound effects that sync with the magical rain
  - Audio controls for both music and rain sounds

- **Dynamic Backgrounds**
  - Automatic background image changes with each quote
  - Curated collection of serene Krishna-themed backgrounds
  - Smooth transition effects between images

- **Improved Quote Display**
  - Larger, more readable text with beautiful typography
  - Smooth animations for quote transitions
  - Author attribution for translations
  - Verse references with chapter and verse numbers

- **Language Support**
  - Toggle between Hindi and English translations
  - Seamless language switching without page reload
  - Preserved language preference across sessions

- **UI/UX Improvements**
  - Modern, intuitive button designs
  - Responsive layout for all screen sizes
  - Beautiful date and time display
  - Custom cursor effects
  - Improved loading states

### 🔧 Technical Improvements

- Modular code architecture for better maintainability
- Enhanced caching system for offline quote access
- Optimized performance for smoother animations
- Improved error handling and fallback states
- Background service worker for daily quote updates
- Secure content delivery with updated CSP

### 🔒 Security & Privacy

- Updated content security policy
- Secure audio and image resource handling
- Safe external resource loading
- Protected API endpoints

### 🎨 Visual Enhancements

- New peacock feather motif
- Enhanced visual hierarchy
- Improved contrast and readability
- Smooth transitions and animations
- Responsive design improvements

### 📱 Accessibility

- Improved keyboard navigation
- Better screen reader support
- Enhanced color contrast
- Responsive controls and buttons

### 🔗 External Integrations

- Integration with Bhagvad Gita API
- Buy Me a Coffee support link
- LinkedIn profile connection

### 📝 Documentation

- Added comprehensive documentation
- Updated installation instructions
- New feature guides
- Troubleshooting section

---

## How to Update

1. The extension will automatically update to version 2.0
2. Refresh your browser to see the new features
3. Clear browser cache if needed

## Feedback

Please report any issues or suggest features on our [GitHub repository](https://github.com/rohit-wadhwa/geeta-quote-daily) or contact the developer directly on [LinkedIn](https://in.linkedin.com/in/rohit-wadhwa).

## Credits

- Developer: Rohit Wadhwa
- API: Bhagvad Gita API
- Images: Original Krishna-themed artwork

## Updated [2.0.3] - 2024-03-20
#### Security & Compliance Improvements
- Updated Content Security Policy to allow inline styles for cursor functionality
- Fixed cursor.js to work properly within Chrome extension CSP requirements 
- Fixed cursor movement by properly implementing CSS variables for positioning
- Fixed extension promo button visibility when viewed as a website
- Fixed close button functionality on extension promo to properly hide the element 