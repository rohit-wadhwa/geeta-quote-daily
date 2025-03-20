/**
 * Extension Promotion Handler
 * 
 * This module manages the visibility and behavior of the Chrome extension
 * promotional elements when the page is loaded as a website rather than an extension.
 * 
 * Key responsibilities:
 * 1. Detect whether code is running in an extension context or as a website
 * 2. Show the extension promotional button only when running as a website
 * 3. Respect user preference (hidden state) using localStorage
 * 4. Provide utility function for resetting the hidden state for testing
 * 5. Manage copyright visibility based on extension/website context
 * 
 * The implementation follows CSP best practices by:
 * - Using predefined CSS classes for styling changes
 * - Minimizing direct style manipulations
 * - Supporting proper visibility toggling with both inline styles and classes
 * 
 * Version: 2.0.3
 * Last updated: 2024-03-20
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the promo element
    const promoElement = document.getElementById('extension-promo');
    
    if (promoElement) {
        try {
            // Check if we're in a Chrome extension context
            const isExtension = window.chrome && chrome.runtime && chrome.runtime.id;
            
            // Check if user has previously closed the promo - use strict equality to ensure boolean comparison
            const promoHidden = localStorage.getItem('promoHidden') === 'true';
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            console.log("Promo hidden state:", promoHidden);
            console.log("Is extension:", isExtension);
            
            // Initialize the element with no classes that might interfere
            promoElement.classList.remove('hidden');
            promoElement.classList.remove('visible');
            
            // Add click handler to close button
            const closeButton = promoElement.querySelector('.close-promo');
            if (closeButton) {
                closeButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // First remove visible class
                    promoElement.classList.remove('visible');
                    
                    // Directly modify style properties to ensure it's hidden
                    promoElement.style.display = 'none';
                    promoElement.style.opacity = '0';
                    promoElement.style.visibility = 'hidden';
                    
                    // Add hidden class
                    promoElement.classList.add('hidden');
                    
                    // Store the preference
                    localStorage.setItem('promoHidden', 'true');
                    
                    console.log("Promo hidden by user");
                });
            }
            
            // If we're not in an extension context and user hasn't hidden it, show the promo
            if (!isExtension && !promoHidden) {
                console.log("Not running as extension and promo not hidden - showing promo button");
                
                // Forcefully make the button visible with inline styles first
                promoElement.style.display = 'flex';
                promoElement.style.opacity = '1';
                promoElement.style.visibility = 'visible';
                
                setTimeout(function() {
                    // Then add the class for any additional styling
                    promoElement.classList.remove('hidden');
                    promoElement.classList.add('visible');
                    
                    // Adjust position on mobile devices
                    if (isMobile) {
                        // For better visibility on mobile, ensure the button is positioned well
                        if (window.innerWidth < 360) {
                            document.querySelector('.extension-button span:first-of-type').textContent = 'Get Extension';
                        }
                    }
                }, 1500); // Short delay to ensure page is loaded
            } else {
                console.log("Running as extension or promo hidden - hiding promo button");
                // Make sure styles are applied directly for immediate effect
                promoElement.style.display = 'none';
                promoElement.style.opacity = '0';
                promoElement.style.visibility = 'hidden';
                
                promoElement.classList.remove('visible');
                promoElement.classList.add('hidden');
            }
            
            // Set the copyright visibility based on context
            const footerElement = document.querySelector('footer');
            if (footerElement) {
                if (isExtension) {
                    // Hide copyright when running as extension
                    footerElement.classList.add('hidden');
                } else {
                    // Show copyright when running as a website
                    footerElement.classList.add('visible');
                }
            }
        } catch (e) {
            // If there's an error checking extension status, assume we're not in an extension
            console.log("Error checking extension status:", e);
            console.error(e);
        }
    }
});

/**
 * Utility function to reset promo hidden state - available for testing
 * Access via browser console: resetPromoHiddenState()
 */
function resetPromoHiddenState() {
    localStorage.removeItem('promoHidden');
    console.log("Promo hidden state reset. Refresh the page to see the promo again.");
    return "Promo state reset successfully. Please refresh the page.";
} 