// Magic Rain Effect Module
const MagicRain = {
    state: {
        isActive: false,
        interval: null
    },

    elements: {
        container: null,
        button: null,
        checkbox: null,
        audio: null
    },

    init(elements) {
        this.elements = elements;
        this.createContainer();
        this.createAudio();
        this.setupEventListeners();
    },

    createContainer() {
        this.elements.container = document.createElement('div');
        this.elements.container.className = 'magic-rain-container';
        document.body.appendChild(this.elements.container);
    },

    createAudio() {
        this.elements.audio = new Audio(CONFIG.audio.rainSound.url);
        this.elements.audio.loop = true;
        this.elements.audio.volume = CONFIG.audio.rainSound.volume;
    },

    setupEventListeners() {
        if (this.elements.button) {
            this.elements.button.addEventListener('click', () => this.toggle());
        }
        if (this.elements.checkbox) {
            this.elements.checkbox.addEventListener('change', () => this.handleSoundToggle());
        }
    },

    createDrop() {
        const drop = document.createElement('div');
        drop.className = 'magic-drop';
        
        // Random positioning
        drop.style.left = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 
            (CONFIG.magicRain.dropSize.max - CONFIG.magicRain.dropSize.min) + 
            CONFIG.magicRain.dropSize.min;
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        
        // Random animation duration
        const duration = Math.random() * 
            (CONFIG.magicRain.animationDuration.max - CONFIG.magicRain.animationDuration.min) + 
            CONFIG.magicRain.animationDuration.min;
        drop.style.animationDuration = `${duration}s`;
        
        // Random opacity
        const opacity = Math.random() * 
            (CONFIG.magicRain.dropOpacity.max - CONFIG.magicRain.dropOpacity.min) + 
            CONFIG.magicRain.dropOpacity.min;
        drop.style.opacity = opacity;
        
        // Random horizontal movement
        const startX = Math.random() * 20 - 10;
        const endX = Math.random() * 40 - 20;
        drop.style.transform = `translateX(${startX}px)`;
        drop.style.setProperty('--end-x', `${endX}px`);
        
        return drop;
    },

    start() {
        if (this.state.isActive) return;
        this.state.isActive = true;
        this.elements.button.textContent = '✨ Stop Magic';
        
        // Create initial drops
        for (let i = 0; i < CONFIG.magicRain.initialDrops; i++) {
            const drop = this.createDrop();
            drop.style.top = `${Math.random() * 100}%`;
            this.elements.container.appendChild(drop);
        }
        
        // Start rain sound if enabled
        if (this.elements.checkbox?.checked) {
            this.playRainSound();
        }
        
        // Start continuous drop creation
        this.state.interval = setInterval(() => this.updateDrops(), CONFIG.magicRain.dropInterval);
    },

    stop() {
        if (!this.state.isActive) return;
        this.state.isActive = false;
        this.elements.button.textContent = '✨ Magic Rain';
        
        // Clear interval
        if (this.state.interval) {
            clearInterval(this.state.interval);
            this.state.interval = null;
        }
        
        // Stop rain sound
        this.stopRainSound();
        
        // Fade out existing drops
        this.fadeOutDrops();
    },

    updateDrops() {
        const drops = this.elements.container.getElementsByClassName('magic-drop');
        
        // Remove excess drops
        if (drops.length > CONFIG.magicRain.maxDrops) {
            for (let i = 0; i < CONFIG.magicRain.newDropsPerInterval; i++) {
                if (drops[i]) drops[i].remove();
            }
        }
        
        // Add new drops
        for (let i = 0; i < CONFIG.magicRain.newDropsPerInterval; i++) {
            this.elements.container.appendChild(this.createDrop());
        }
    },

    fadeOutDrops() {
        const drops = this.elements.container.getElementsByClassName('magic-drop');
        Array.from(drops).forEach((drop, index) => {
            setTimeout(() => {
                drop.style.opacity = '0';
                setTimeout(() => drop.remove(), 500);
            }, index * 10);
        });
    },

    playRainSound() {
        if (this.elements.audio) {
            this.elements.audio.play().catch(error => {
                console.warn('Rain sound playback failed:', error);
            });
        }
    },

    stopRainSound() {
        if (this.elements.audio) {
            this.elements.audio.pause();
            this.elements.audio.currentTime = 0;
        }
    },

    handleSoundToggle() {
        if (this.state.isActive) {
            if (this.elements.checkbox.checked) {
                this.playRainSound();
            } else {
                this.stopRainSound();
            }
        }
    },

    toggle() {
        if (this.state.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }
};

// Export MagicRain module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MagicRain;
} else {
    window.MagicRain = MagicRain;
} 