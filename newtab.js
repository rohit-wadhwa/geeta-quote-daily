// Constants for configuration
const CONFIG = {
    totalChapters: 18,
    maxVersesPerChapter: [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78],
    cacheKey: 'geeta_quotes_cache',
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxCachedQuotes: 50,
    animationDuration: 500,
    dateTimeUpdateInterval: 1000,
    defaultLanguage: 'hindi',
    apiBaseUrl: 'https://vedicscriptures.github.io/slok',
    backgroundImages: [
        'images/bg1.jpg',
        'images/bg2.jpg',
        'images/bg3.jpg',
        'images/bg4.jpg',
        'images/bg5.jpg',
        'images/bg6.jpg'
    ]
};

// State management
const state = {
    languagePreference: localStorage.getItem('languagePreference') || CONFIG.defaultLanguage,
    currentQuoteData: null,
    isFetching: false,
    isMagicRainActive: false
};

// DOM Elements cache
const elements = {
    quote: null,
    verseRef: null,
    reloadButton: null,
    languageToggleButton: null,
    musicToggleButton: null,
    dateTimeContainer: null,
    backgroundMusic: null,
    magicRainButton: null,
    magicRainContainer: null,
    rainSoundCheckbox: null,
    rainSound: null
};

// Initialize DOM elements
function initializeElements() {
    elements.quote = document.getElementById('quote');
    elements.verseRef = document.getElementById('verse-ref');
    elements.reloadButton = document.getElementById('reload');
    elements.languageToggleButton = document.getElementById('language-toggle');
    elements.musicToggleButton = document.getElementById('music-toggle');
    elements.dateTimeContainer = document.getElementById('date-time');
    elements.backgroundMusic = document.getElementById('background-music');
    elements.magicRainButton = document.getElementById('magic-rain');
    elements.rainSoundCheckbox = document.getElementById('rain-sound');
    
    // Create magic rain container
    elements.magicRainContainer = document.createElement('div');
    elements.magicRainContainer.className = 'magic-rain-container';
    document.body.appendChild(elements.magicRainContainer);
    
    // Create rain sound audio element
    elements.rainSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3');
    elements.rainSound.loop = true;
    elements.rainSound.volume = 0.3;
}

// Utility functions
const utils = {
    getRandomChapter: () => Math.floor(Math.random() * CONFIG.totalChapters) + 1,
    
    getRandomVerse: (chapter) => Math.floor(Math.random() * CONFIG.maxVersesPerChapter[chapter - 1]) + 1,
    
    formatDate: (date) => date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    
    formatTime: (date) => date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
};

// Cache management
const cache = {
    initialize: () => {
        if (!localStorage.getItem(CONFIG.cacheKey)) {
            localStorage.setItem(CONFIG.cacheKey, JSON.stringify({
                quotes: [],
                lastUpdated: Date.now()
            }));
        }
    },
    
    get: () => JSON.parse(localStorage.getItem(CONFIG.cacheKey) || '{"quotes":[],"lastUpdated":0}'),
    
    add: (quote, chapter, verse) => {
        const cacheData = cache.get();
        cacheData.quotes.unshift({
            quote,
            chapter,
            verse,
            timestamp: Date.now()
        });
        
        if (cacheData.quotes.length > CONFIG.maxCachedQuotes) {
            cacheData.quotes = cacheData.quotes.slice(0, CONFIG.maxCachedQuotes);
        }
        
        cacheData.lastUpdated = Date.now();
        localStorage.setItem(CONFIG.cacheKey, JSON.stringify(cacheData));
    },
    
    getRandomQuote: () => {
        const cacheData = cache.get();
        if (cacheData.quotes.length === 0) return null;
        return cacheData.quotes[Math.floor(Math.random() * cacheData.quotes.length)];
    },
    
    isExpired: () => {
        const cacheData = cache.get();
        return Date.now() - cacheData.lastUpdated > CONFIG.cacheExpiry;
    }
};

// UI management
const ui = {
    updateButtonStates: (isLoading = false) => {
        if (!elements.reloadButton || !elements.languageToggleButton) return;
        
        elements.reloadButton.disabled = isLoading;
        elements.languageToggleButton.disabled = isLoading;
        elements.reloadButton.textContent = isLoading ? 'Loading...' : '⟳ Reload';
        elements.languageToggleButton.textContent = state.languagePreference === 'hindi' ? '🔄 English' : '🔄 हिंदी';
    },
    
    changeBackgroundImage: () => {
        const randomIndex = Math.floor(Math.random() * CONFIG.backgroundImages.length);
        const newBackground = CONFIG.backgroundImages[randomIndex];
        document.body.style.backgroundImage = `url('${newBackground}')`;
    },
    
    showLoadingState: () => {
        if (!elements.quote || !elements.verseRef) return;
        
        const loadingContent = `
            <div class="loading-quote">
                <p>कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।</p>
                <p>You have the right to work, but never to the fruit of work.</p>
                <p class="author">Loading wisdom from Bhagavad Gita...</p>
            </div>`;
        
        elements.quote.innerHTML = loadingContent;
        elements.verseRef.textContent = 'Loading...';
    },
    
    displayQuote: (data, skipAnimation = false) => {
        if (!elements.quote) return;
        
        const quoteData = data || state.currentQuoteData;
        if (!quoteData) {
            ui.showLoadingState();
            return;
        }
        
        const isEnglish = state.languagePreference === 'english';
        const content = `
            <div class="quote-content">
                <p>${quoteData.slok}</p>
                <p>${isEnglish ? quoteData.siva.et : quoteData.tej.ht}</p>
                <p class="author">Author: ${isEnglish ? quoteData.siva.author : quoteData.tej.author}</p>
            </div>`;
        
        if (!skipAnimation) {
            elements.quote.style.opacity = '0';
            setTimeout(() => {
                elements.quote.innerHTML = content;
                elements.quote.style.opacity = '1';
            }, CONFIG.animationDuration);
        } else {
            elements.quote.innerHTML = content;
        }
    },
    
    displayError: () => {
        if (!elements.quote) return;
        elements.quote.innerHTML = `
            <div class="error-quote">
                <p>Unable to load quote. Please try again.</p>
            </div>`;
    },
    
    updateDateTime: () => {
        if (!elements.dateTimeContainer) return;
        const now = new Date();
        elements.dateTimeContainer.innerHTML = `
            <div class="date">${utils.formatDate(now)}</div>
            <div class="time">${utils.formatTime(now)}</div>`;
    }
};

// Quote fetching and management
const quoteManager = {
    async fetchQuote() {
        if (state.isFetching) return;
        state.isFetching = true;
        
        ui.showLoadingState();
        ui.updateButtonStates(true);
        ui.changeBackgroundImage();
        
        try {
            const chapter = utils.getRandomChapter();
            const verse = utils.getRandomVerse(chapter);
            
            const response = await fetch(`${CONFIG.apiBaseUrl}/${chapter}/${verse}/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (!data?.slok) throw new Error('Invalid quote data received');
            
            state.currentQuoteData = data;
            cache.add(data, chapter, verse);
            ui.displayQuote(data);
            
        } catch (error) {
            console.error('Error fetching quote:', error);
            const cachedQuote = cache.getRandomQuote();
            if (cachedQuote) {
                state.currentQuoteData = cachedQuote.quote;
                ui.displayQuote(cachedQuote.quote);
            } else {
                ui.displayError();
            }
        } finally {
            state.isFetching = false;
            ui.updateButtonStates(false);
        }
    },
    
    toggleLanguage() {
        if (state.isFetching) return;
        
        state.languagePreference = state.languagePreference === 'hindi' ? 'english' : 'hindi';
        localStorage.setItem('languagePreference', state.languagePreference);
        
        if (state.currentQuoteData && (state.languagePreference === 'hindi' || state.currentQuoteData.siva.et)) {
            ui.displayQuote(state.currentQuoteData, true);
            ui.updateButtonStates(false);
        } else {
            quoteManager.fetchQuote();
        }
    }
};

// Add magical rain effect functions
const magicRain = {
    createDrop: () => {
        const drop = document.createElement('div');
        drop.className = 'magic-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
        drop.style.opacity = Math.random() * 0.3 + 0.2;
        
        // Add some variety to the drops
        const size = Math.random() * 3 + 2; // Random size between 2-5px
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        
        // Add a slight horizontal movement
        const startX = Math.random() * 20 - 10; // Random start position
        const endX = Math.random() * 40 - 20; // Random end position
        drop.style.transform = `translateX(${startX}px)`;
        drop.style.setProperty('--end-x', `${endX}px`);
        
        return drop;
    },
    
    start: () => {
        if (state.isMagicRainActive) return;
        state.isMagicRainActive = true;
        elements.magicRainButton.textContent = '✨ Stop Magic';
        
        // Create initial drops
        for (let i = 0; i < 100; i++) {
            const drop = magicRain.createDrop();
            drop.style.top = `${Math.random() * 100}%`; // Distribute drops across the screen
            elements.magicRainContainer.appendChild(drop);
        }
        
        // Start rain sound if checkbox is checked
        if (elements.rainSoundCheckbox.checked) {
            elements.rainSound.play().catch(error => {
                console.log('Rain sound playback failed:', error);
            });
        }
        
        // Continuously add new drops and remove old ones
        magicRain.interval = setInterval(() => {
            // Remove drops that have completed their animation
            const drops = elements.magicRainContainer.getElementsByClassName('magic-drop');
            if (drops.length > 150) {
                for (let i = 0; i < 10; i++) {
                    if (drops[i]) drops[i].remove();
                }
            }
            
            // Add new drops
            for (let i = 0; i < 5; i++) {
                elements.magicRainContainer.appendChild(magicRain.createDrop());
            }
        }, 200);
    },
    
    stop: () => {
        if (!state.isMagicRainActive) return;
        state.isMagicRainActive = false;
        elements.magicRainButton.textContent = '✨ Magic Rain';
        clearInterval(magicRain.interval);
        
        // Stop rain sound
        elements.rainSound.pause();
        elements.rainSound.currentTime = 0;
        
        // Fade out existing drops gradually
        const drops = elements.magicRainContainer.getElementsByClassName('magic-drop');
        Array.from(drops).forEach((drop, index) => {
            setTimeout(() => {
                drop.style.opacity = '0';
                setTimeout(() => drop.remove(), 500);
            }, index * 10);
        });
    },
    
    toggle: () => {
        if (state.isMagicRainActive) {
            magicRain.stop();
        } else {
            magicRain.start();
        }
    }
};

// Event handlers
const eventHandlers = {
    handleReloadClick: () => {
        if (!state.isFetching) {
            quoteManager.fetchQuote();
            ui.updateDateTime();
        }
    },
    
    handleMusicToggle: () => {
        if (!elements.backgroundMusic) return;
        if (elements.backgroundMusic.paused) {
            elements.backgroundMusic.play();
            elements.musicToggleButton.textContent = '🔇 Stop Music';
        } else {
            elements.backgroundMusic.pause();
            elements.musicToggleButton.textContent = '🔊 Play Music';
        }
    },
    
    handleMagicRainToggle: () => {
        magicRain.toggle();
    },
    
    handleRainSoundToggle: () => {
        if (state.isMagicRainActive) {
            if (elements.rainSoundCheckbox.checked) {
                elements.rainSound.play().catch(error => {
                    console.log('Rain sound playback failed:', error);
                });
            } else {
                elements.rainSound.pause();
                elements.rainSound.currentTime = 0;
            }
        }
    }
};

// Initialize the application
function initialize() {
    initializeElements();
    cache.initialize();
    ui.updateButtonStates();
    
    if (elements.languageToggleButton) {
        elements.languageToggleButton.addEventListener('click', quoteManager.toggleLanguage);
    }
    
    if (elements.reloadButton) {
        elements.reloadButton.addEventListener('click', eventHandlers.handleReloadClick);
    }
    
    if (elements.musicToggleButton) {
        elements.musicToggleButton.addEventListener('click', eventHandlers.handleMusicToggle);
    }
    
    if (elements.magicRainButton) {
        elements.magicRainButton.addEventListener('click', eventHandlers.handleMagicRainToggle);
    }
    
    if (elements.rainSoundCheckbox) {
        elements.rainSoundCheckbox.addEventListener('change', eventHandlers.handleRainSoundToggle);
    }
    
    quoteManager.fetchQuote();
    ui.updateDateTime();
    setInterval(ui.updateDateTime, CONFIG.dateTimeUpdateInterval);
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);

