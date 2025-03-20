/**
 * Custom Cursor Implementation
 * 
 * This module creates a custom cursor effect that follows mouse movements
 * with a decorative element styled using CSS.
 * 
 * Key features:
 * 1. Tracks mouse position using event listeners
 * 2. Updates cursor position using direct style attributes
 * 3. Adds visual effects on click with CSS animations
 * 4. Supports CSP requirements with safe style updates
 * 
 * The implementation uses inline styles for positioning which is allowed
 * by the current CSP configuration ('unsafe-inline' for style-src).
 * 
 * Version: 2.0.3
 * Last updated: 2024-03-20
 */

const cursor = document.querySelector('.cursor');
let cursorVisible = false;

document.addEventListener('mousemove', e => {
    if (!cursorVisible) {
        cursorVisible = true;
        cursor.classList.add('visible');
    }
    
    // Direct style attribute setting - the original working implementation
    cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;");
});

document.addEventListener('click', () => {
    cursor.classList.add("expand");

    setTimeout(() => {
        cursor.classList.remove("expand");
    }, 500);
});
