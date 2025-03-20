# Geeta Quote Daily TODO List

This document tracks planned features and improvements for the Geeta Quote Daily Chrome extension.

## In Progress: CSP Compliance Project

For version 2.0.4, we need to gradually replace all inline styles with CSS classes to fully comply with CSP without requiring 'unsafe-inline'.

### Current Status
- [x] Fixed cursor.js with CSP-compliant approach (2.0.3)
- [x] Added extension promo handling with proper classes (2.0.3)
- [x] Created utility CSS classes for common style operations (2.0.3)
- [ ] Convert newtab.js inline styles to classes
- [ ] Convert magicRain.js inline styles to classes
- [ ] Enable strict CSP without unsafe-inline

### How to Approach This
1. For each component, identify all inline styles
2. Create corresponding CSS classes in style.css
3. Replace style assignments with classList.add/remove operations
4. Test each component after conversion
5. Finally, remove 'unsafe-inline' from manifest.json

## Upcoming Features

### Social Sharing Implementation

- [ ] Reimplement social sharing functionality with proper CSP compliance
  - [ ] Replace inline styles with CSS classes and stylesheets
  - [ ] Move all dynamic styling to JavaScript using classList and predefined CSS classes
  - [ ] Create proper state management for social sharing UI
  - [ ] Implement non-inline SVG icons for social platforms

### UI/UX Improvements

- [ ] Enhance mobile responsiveness for all controls
- [ ] Improve accessibility of interactive elements
- [ ] Add dark/light theme toggle
- [ ] Add settings gear icon in top right corner
  - [ ] Create popup settings panel with show/hide options
  - [ ] Implement date/time display customization:
    - [ ] Toggle date/time visibility
    - [ ] Option to show/hide seconds
    - [ ] Toggle between 12/24-hour clock format
    - [ ] Option to show/hide AM/PM indicator
  - [ ] Save user preferences to localStorage
  - [ ] Apply settings changes instantly without page reload

### Performance Optimizations

- [ ] Further reduce initial load time
- [ ] Optimize image and audio resources
- [ ] Implement lazy loading for non-critical components

## Documentation

- [ ] Create comprehensive documentation for the codebase
- [ ] Add detailed comments for complex functions
- [ ] Document the extension's architecture and design decisions

## Testing

- [ ] Implement automated tests for core functionality
- [ ] Test across different Chrome versions
- [ ] Conduct performance testing on various devices

## Completed in 2.0.3
- [x] Fixed promo handler to properly show/hide extension promo
- [x] Added reset utility function for testing promo visibility
- [x] Updated manifest version to 2.0.3
- [x] Fixed cursor.js to comply with CSP requirements
- [x] Added utility classes for future CSP compliance work
- [x] Updated newsletter and Chrome store description 
- [x] Fixed cursor movement by properly implementing CSS variables
- [x] Fixed cursor bouncing issue by reverting to direct style attribute approach 