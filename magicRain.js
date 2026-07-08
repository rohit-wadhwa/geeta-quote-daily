// Magic Rain Effect Module
const MagicRain = {
    state: {
        isActive: false,
        interval: null,
        maxDrops: 100 // Default max drops
    },

    elements: {
        container: null,
        button: null,
        checkbox: null,
        audio: null
    },

    init(container, button, checkbox, audio) {
        this.elements.container = container;
        this.elements.button = button;
        this.elements.checkbox = checkbox;
        this.elements.audio = audio;
        
        if (this.elements.button) {
            this.elements.button.addEventListener('click', () => this.toggle());
        }
        if (this.elements.checkbox) {
            this.elements.checkbox.addEventListener('change', () => this.handleSoundToggle());
        }
        
        // Read max drops from config if available
        if (window.CONFIG && window.CONFIG.performance && window.CONFIG.performance.maxMagicDrops) {
            this.state.maxDrops = window.CONFIG.performance.maxMagicDrops;
        }
        
        // Set up visibility change listener for performance
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && this.state.isActive) {
                this.pause();
            } else if (document.visibilityState === 'visible' && this.state.wasPaused) {
                this.resume();
            }
        });
    },

    createDrop() {
        // Check if we're at maximum drop count
        const drops = this.elements.container.getElementsByClassName('magic-drop');
        if (drops.length >= this.state.maxDrops) {
            // Remove oldest drop if we're at capacity
            if (drops[0]) drops[0].remove();
        }
        
        const drop = document.createElement('div');
        drop.className = 'magic-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
        drop.style.opacity = Math.random() * 0.3 + 0.2;
        
        // Random size between 2-5px
        const size = Math.random() * 3 + 2;
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        
        // Random horizontal movement
        const startX = Math.random() * 20 - 10;
        const endX = Math.random() * 40 - 20;
        drop.style.transform = `translateX(${startX}px)`;
        drop.style.setProperty('--end-x', `${endX}px`);
        
        // Add timestamp for cleanup
        drop.dataset.created = Date.now();
        
        // Auto-remove after animation completes
        setTimeout(() => {
            if (drop.parentNode) {
                drop.remove();
            }
        }, (parseFloat(drop.style.animationDuration) * 1000) + 500);
        
        return drop;
    },

    start() {
        if (this.state.isActive || !this.elements.container) return;
        
        this.state.isActive = true;
        this.state.wasPaused = false;
        
        if (this.elements.button) {
            this.elements.button.textContent = '✨ Stop Magic';
        }
        
        // Create initial drops - limit to half max for smoother start
        const initialDrops = Math.min(50, this.state.maxDrops / 2);
        for (let i = 0; i < initialDrops; i++) {
            const drop = this.createDrop();
            drop.style.top = `${Math.random() * 100}%`;
            this.elements.container.appendChild(drop);
        }
        
        // Start rain sound if enabled
        if (this.elements.checkbox?.checked && this.elements.audio) {
            this.elements.audio.play().catch(error => {
                console.log('Rain sound playback failed:', error);
            });
        }
        
        // Continuously add new drops at a reasonable rate
        this.state.interval = setInterval(() => {
            const drops = this.elements.container.getElementsByClassName('magic-drop');
            
            // Check if we should add more drops
            if (drops.length < this.state.maxDrops) {
                // Add 5 drops at a time or up to max
                const newDropCount = Math.min(5, this.state.maxDrops - drops.length);
                for (let i = 0; i < newDropCount; i++) {
                    this.elements.container.appendChild(this.createDrop());
                }
            }
            
            // Check for drops that have gone off-screen
            Array.from(drops).forEach(drop => {
                const age = Date.now() - (drop.dataset.created || 0);
                if (age > 5000) { // 5 seconds max lifetime
                    drop.remove();
                }
            });
        }, 300); // Slightly slower interval
    },

    stop() {
        if (!this.state.isActive) return;
        
        this.state.isActive = false;
        this.state.wasPaused = false;
        
        if (this.elements.button) {
            this.elements.button.textContent = '✨ Magic Rain';
        }
        
        // Clear interval
        if (this.state.interval) {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }
        
        // Stop rain sound
        if (this.elements.audio) {
            this.elements.audio.pause();
            this.elements.audio.currentTime = 0;
        }
        
        // Remove drops with fade effect
        const drops = this.elements.container.getElementsByClassName('magic-drop');
        Array.from(drops).forEach((drop, index) => {
            setTimeout(() => {
                drop.style.opacity = '0';
                setTimeout(() => drop.remove(), 500);
            }, index * 5); // Faster cleanup - 5ms per drop
        });
    },
    
    // Add methods for pausing/resuming
    pause() {
        if (!this.state.isActive) return;
        
        this.state.wasPaused = true;
        
        // Clear interval but don't reset active state
        if (this.state.interval) {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }
        
        // Pause audio
        if (this.elements.checkbox?.checked && this.elements.audio) {
            this.elements.audio.pause();
        }
    },
    
    resume() {
        if (!this.state.wasPaused) return;
        
        // Restart interval
        this.state.interval = setInterval(() => {
            const drops = this.elements.container.getElementsByClassName('magic-drop');
            
            if (drops.length < this.state.maxDrops) {
                const newDropCount = Math.min(5, this.state.maxDrops - drops.length);
                for (let i = 0; i < newDropCount; i++) {
                    this.elements.container.appendChild(this.createDrop());
                }
            }
            
            Array.from(drops).forEach(drop => {
                const age = Date.now() - (drop.dataset.created || 0);
                if (age > 5000) {
                    drop.remove();
                }
            });
        }, 300);
        
        // Resume audio
        if (this.elements.checkbox?.checked && this.elements.audio) {
            this.elements.audio.play().catch(error => {
                console.log('Rain sound playback failed:', error);
            });
        }
        
        this.state.wasPaused = false;
    },

    handleSoundToggle() {
        if (!this.state.isActive || !this.elements.audio) return;
        
        if (this.elements.checkbox.checked) {
            this.elements.audio.play().catch(error => {
                console.log('Rain sound playback failed:', error);
            });
        } else {
            this.elements.audio.pause();
            this.elements.audio.currentTime = 0;
        }
    },

    toggle() {
        if (this.state.isActive) {
            this.stop();
        } else {
            this.start();
        }
    },
    
    // Cleanup resources
    dispose() {
        this.stop();
        
        // Clean up event listeners
        if (this.elements.button) {
            this.elements.button.removeEventListener('click', () => this.toggle());
        }
        if (this.elements.checkbox) {
            this.elements.checkbox.removeEventListener('change', () => this.handleSoundToggle());
        }
        
        // Clean up audio resource
        if (this.elements.audio) {
            this.elements.audio.pause();
            this.elements.audio.src = '';
        }
    }
};

// Initialize MagicRain when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.magic-rain-container');
    const button = document.getElementById('magic-rain');
    const checkbox = document.getElementById('rain-sound');
    
    // Use a more memory-efficient way to create the audio element
    let audio = null;
    
    if (container && button) {
        // Create audio only when needed
        const createAudio = () => {
            if (!audio) {
                audio = new Audio('https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3');
                audio.loop = true;
                audio.volume = 0.3;
                // Prevent memory leaks by setting src to empty on page unload
                window.addEventListener('beforeunload', () => {
                    audio.pause();
                    audio.src = '';
                    audio = null;
                });
            }
            return audio;
        };
        
        // Only initialize audio when toggling rain sounds
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                createAudio();
            }
        });
        
        MagicRain.init(container, button, checkbox, createAudio());
    }
});

// Export MagicRain module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MagicRain;
} else {
    window.MagicRain = MagicRain;
} 