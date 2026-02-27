// Global configuration
let CONFIG = {};
let FALLBACK_VERSES = [];

// State management
const state = {
    languagePreference: localStorage.getItem('languagePreference') || 'hindi',
    currentQuoteData: null,
    isFetching: false,
    isMagicRainActive: false,
    isFeatherAnimating: false
};

// DOM Elements cache
const elements = {
    quote: null,
    reloadButton: null,
    languageToggleButton: null,
    musicToggleButton: null,
    dateTimeContainer: null,
    dateElement: null,
    timeElement: null,
    backgroundMusic: null,
    magicRainButton: null,
    magicRainContainer: null,
    rainSoundCheckbox: null,
    rainSound: null,
    rainVolumeSlider: null,
    rainVolumeContainer: null,
    chapterInfoButton: null,
    chapterInfoContainer: null,
    mayurPankh: null,
    offlineIndicator: null
};

// Initialize DOM elements
function initializeElements() {
    elements.quote = document.getElementById('quote');
    elements.reloadButton = document.getElementById('reload');
    elements.languageToggleButton = document.getElementById('language-toggle');
    elements.musicToggleButton = document.getElementById('music-toggle');
    elements.dateTimeContainer = document.getElementById('date-time');
    elements.backgroundMusic = document.getElementById('background-music');
    elements.magicRainButton = document.getElementById('magic-rain');
    elements.rainSoundCheckbox = document.getElementById('rain-sound');
    elements.chapterInfoButton = document.getElementById('chapter-info');
    elements.chapterInfoContainer = document.getElementById('chapter-info-container');
    elements.mayurPankh = document.querySelector('.mayur-pankh');
    elements.offlineIndicator = document.getElementById('offline-indicator');
    
    // Create magic rain container
    elements.magicRainContainer = document.createElement('div');
    elements.magicRainContainer.className = 'magic-rain-container';
    document.body.appendChild(elements.magicRainContainer);
    
    // Create rain sound audio element
    elements.rainSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3');
    elements.rainSound.loop = true;
    elements.rainSound.volume = 0.3;
    
    // Create rain volume slider container
    elements.rainVolumeContainer = document.createElement('div');
    elements.rainVolumeContainer.className = 'rain-volume-container';
    elements.rainVolumeContainer.style.visibility = 'hidden';
    elements.rainVolumeContainer.style.opacity = '0';
    elements.rainVolumeContainer.style.width = '0'; // Set width to 0 when hidden
    elements.rainVolumeContainer.style.padding = '0'; // Remove padding when hidden
    
    // Create volume label
    const volumeLabel = document.createElement('span');
    volumeLabel.className = 'volume-label';
    volumeLabel.textContent = '🔊';
    
    // Create rain volume slider
    elements.rainVolumeSlider = document.createElement('input');
    elements.rainVolumeSlider.type = 'range';
    elements.rainVolumeSlider.className = 'rain-volume-slider';
    elements.rainVolumeSlider.min = '0';
    elements.rainVolumeSlider.max = '1';
    elements.rainVolumeSlider.step = '0.01';
    elements.rainVolumeSlider.value = elements.rainSound.volume;
    
    // Add slider to container
    elements.rainVolumeContainer.appendChild(volumeLabel);
    elements.rainVolumeContainer.appendChild(elements.rainVolumeSlider);
    
    // Add volume container immediately after the rain sound checkbox control
    // This ensures they appear as a unified control
    if (document.querySelector('.magic-rain-controls')) {
        const rainControls = document.querySelector('.magic-rain-controls');
        // Insert volume container right after the rain-sound-toggle element
        const rainSoundToggle = rainControls.querySelector('.rain-sound-toggle');
        if (rainSoundToggle) {
            rainSoundToggle.insertAdjacentElement('afterend', elements.rainVolumeContainer);
        } else {
            // Fallback if the toggle doesn't exist yet
            rainControls.appendChild(elements.rainVolumeContainer);
        }
    }

    // Create chapter info container if it doesn't exist
    if (!elements.chapterInfoContainer) {
        elements.chapterInfoContainer = document.createElement('div');
        elements.chapterInfoContainer.id = 'chapter-info-container';
        elements.chapterInfoContainer.className = 'chapter-info-container';
        elements.chapterInfoContainer.style.display = 'none';
        document.body.appendChild(elements.chapterInfoContainer);
    }
}

// Load configuration from config.json
async function loadConfiguration() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) throw new Error(`Failed to load configuration: ${response.status}`);
        CONFIG = await response.json();
        
        // Set default language from config if not already in localStorage
        if (!localStorage.getItem('languagePreference')) {
            state.languagePreference = CONFIG.content.defaultLanguage;
            localStorage.setItem('languagePreference', state.languagePreference);
        }
        
        return true;
    } catch (error) {
        console.error('Error loading configuration:', error);
        // Fallback to default configuration if config.json fails to load
        CONFIG = {
            api: {
                baseUrl: 'https://vedicscriptures.github.io/slok',
                chaptersUrl: 'https://vedicscriptures.github.io/chapters',
                chapterUrl: 'https://vedicscriptures.github.io/chapter'
            },
            content: {
                defaultLanguage: 'hindi',
                totalChapters: 18,
                maxVersesPerChapter: [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]
            },
            cache: {
                key: 'geetaQuoteDailyCache',
                expiry: 24 * 60 * 60 * 1000,
                maxCachedQuotes: 100
            },
            backgrounds: {
                images: [
                    'images/bg1.webp',
                    'images/bg2.webp',
                    'images/bg3.webp',
                    'images/bg4.webp',
                    'images/bg5.webp',
                    'images/bg6.webp'
                ]
            },
            animation: {
                duration: 500
            },
            dateTime: {
                updateInterval: 1000,
                timeUpdateInterval: 1000,
                dateUpdateInterval: 60000
            }
        };
        return false;
    }
}

// Load fallback verses bundle for offline/API-down scenarios
async function loadFallbackVerses() {
    try {
        const response = await fetch('fallback-verses.json');
        if (!response.ok) throw new Error(`Failed to load fallback verses: ${response.status}`);
        FALLBACK_VERSES = await response.json();
        console.log(`Loaded ${FALLBACK_VERSES.length} fallback verses`);
    } catch (error) {
        console.warn('Could not load fallback verses:', error);
        FALLBACK_VERSES = [];
    }
}

// Utility functions
const utils = {
    getRandomChapter: () => Math.floor(Math.random() * CONFIG.content.totalChapters) + 1,
    
    getRandomVerse: (chapter) => Math.floor(Math.random() * CONFIG.content.maxVersesPerChapter[chapter - 1]) + 1,
    
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
        if (!localStorage.getItem(CONFIG.cache.key)) {
            localStorage.setItem(CONFIG.cache.key, JSON.stringify({
                chapters: {},  // Store verses by chapter
                lastRandomQuote: null,  // Store last displayed quote for quick access
                favorites: [],  // User's favorite verses
                lastUpdated: Date.now(),
                chaptersData: null,  // Store chapters data
                chaptersDataTimestamp: 0  // Timestamp for chapters data
            }));
        }
    },
    
    get: () => {
        return JSON.parse(localStorage.getItem(CONFIG.cache.key) || '{"chapters":{},"lastRandomQuote":null,"favorites":[],"lastUpdated":0,"chaptersData":null,"chaptersDataTimestamp":0}');
    },
    
    save: (cacheData) => {
        localStorage.setItem(CONFIG.cache.key, JSON.stringify(cacheData));
    },
    
    // Add a new verse to the cache
    add: (quoteData, chapter, verse) => {
        const cacheData = cache.get();
        
        // Create chapter entry if it doesn't exist
        if (!cacheData.chapters[chapter]) {
            cacheData.chapters[chapter] = {};
        }
        
        // Store complete verse data in the cache
        // Add chapter and verse properties to the quote data if not already present
        if (!quoteData.chapter) quoteData.chapter = chapter;
        if (!quoteData.verse) quoteData.verse = verse;
        
        cacheData.chapters[chapter][verse] = {
            data: quoteData,
            timestamp: Date.now()
        };
        
        // Update last random quote for quick access
        cacheData.lastRandomQuote = {
            chapter,
            verse,
            timestamp: Date.now()
        };
        
        // Cleanup old chapters if we have too many
        const allChapters = Object.keys(cacheData.chapters);
        if (allChapters.length > CONFIG.cache.maxCachedQuotes) {
            // Find the oldest chapter
            const oldestChapter = allChapters.reduce((oldest, current) => {
                // Check if chapter has an access timestamp
                const oldestTime = Object.values(cacheData.chapters[oldest]).reduce(
                    (acc, verse) => Math.min(acc, verse.timestamp), Date.now()
                );
                const currentTime = Object.values(cacheData.chapters[current]).reduce(
                    (acc, verse) => Math.min(acc, verse.timestamp), Date.now()
                );
                return oldestTime < currentTime ? oldest : current;
            }, allChapters[0]);
            
            // Remove the oldest chapter
            delete cacheData.chapters[oldestChapter];
        }
        
        cacheData.lastUpdated = Date.now();
        cache.save(cacheData);
    },
    
    // Retrieve a specific verse from cache
    getVerse: (chapter, verse) => {
        const cacheData = cache.get();
        return cacheData.chapters[chapter]?.[verse]?.data || null;
    },
    
    // Check if a verse is in the cache
    hasVerse: (chapter, verse) => {
        const cacheData = cache.get();
        return !!cacheData.chapters[chapter]?.[verse];
    },
    
    // Check if a chapter exists in the cache
    hasChapter: (chapter) => {
        const cacheData = cache.get();
        return !!cacheData.chapters[chapter] && 
               Object.keys(cacheData.chapters[chapter]).length > 0;
    },
    
    // Get all verses for a specific chapter
    getChapterVerses: (chapter) => {
        const cacheData = cache.get();
        if (!cacheData.chapters[chapter]) return null;
        
        const verses = {};
        for (const [verse, data] of Object.entries(cacheData.chapters[chapter])) {
            verses[verse] = data.data;
        }
        return verses;
    },
    
    // Get any random verse from cache
    getRandomCachedVerse: () => {
        const cacheData = cache.get();
        
        // First try to use the last random quote if not expired
        if (cacheData.lastRandomQuote && 
            !cache.isVerseExpired(cacheData.lastRandomQuote.chapter, cacheData.lastRandomQuote.verse)) {
            return cache.getVerse(cacheData.lastRandomQuote.chapter, cacheData.lastRandomQuote.verse);
        }
        
        // Otherwise get a random verse from the cache
        const chapters = Object.keys(cacheData.chapters);
        if (chapters.length === 0) return null;
        
        // Get a random chapter
        const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
        const verses = Object.keys(cacheData.chapters[randomChapter]);
        if (verses.length === 0) return null;
        
        // Get a random verse from the chapter
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        
        // Update lastRandomQuote for next time
        cacheData.lastRandomQuote = {
            chapter: randomChapter,
            verse: randomVerse,
            timestamp: Date.now()
        };
        cache.save(cacheData);
        
        return cacheData.chapters[randomChapter][randomVerse].data;
    },
    
    // Check if the entire cache is expired
    isExpired: () => {
        const cacheData = cache.get();
        return Date.now() - cacheData.lastUpdated > CONFIG.cache.expiry;
    },
    
    // Check if a specific verse is expired
    isVerseExpired: (chapter, verse) => {
        const cacheData = cache.get();
        const verseData = cacheData.chapters[chapter]?.[verse];
        if (!verseData) return true;
        return Date.now() - verseData.timestamp > CONFIG.cache.expiry;
    },
    
    // Check if chapters data is in cache and valid
    hasChaptersData: () => {
        const cacheData = cache.get();
        return cacheData.chaptersData && !cache.isChaptersDataExpired();
    },
    
    // Check if chapters data is expired
    isChaptersDataExpired: () => {
        const cacheData = cache.get();
        // Chapters data expires after 1 week (much longer than regular quotes)
        return !cacheData.chaptersDataTimestamp || Date.now() - cacheData.chaptersDataTimestamp > 7 * 24 * 60 * 60 * 1000;
    },
    
    // Get chapters data from cache
    getChaptersData: () => {
        const cacheData = cache.get();
        return cacheData.chaptersData;
    },
    
    // Save chapters data to cache
    saveChaptersData: (chaptersData) => {
        const cacheData = cache.get();
        cacheData.chaptersData = chaptersData;
        cacheData.chaptersDataTimestamp = Date.now();
        cache.save(cacheData);
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
        const randomIndex = Math.floor(Math.random() * CONFIG.backgrounds.images.length);
        const newBackground = CONFIG.backgrounds.images[randomIndex];
        document.body.style.backgroundImage = `url('${newBackground}')`;
    },
    
    showLoadingState: () => {
        if (!elements.quote) return;
        
        elements.quote.innerHTML = `
            <div class="loading-quote">
                <p>Loading wisdom from the Bhagavad Gita...</p>
            </div>`;
    },
    
    displayQuote: (data, skipAnimation = false) => {
        if (!elements.quote) return;
        
        const quoteData = data || state.currentQuoteData;
        if (!quoteData) {
            ui.showLoadingState();
            return;
        }
        
        const isEnglish = state.languagePreference === 'english';
        
        // Extract chapter and verse information from API response or URL if available
        let chapterVerse = '';
        if (quoteData.chapter && quoteData.verse) {
            chapterVerse = `Chapter ${quoteData.chapter}, Verse ${quoteData.verse}`;
        } else if (quoteData._id) {
            // Format is usually "BG1.1" for chapter 1, verse 1
            const parts = quoteData._id.replace('BG', '').split('.');
            if (parts.length === 2) {
                const chapter = parts[0];
                const verse = parts[1];
                chapterVerse = `Chapter ${chapter}, Verse ${verse}`;
            }
        }
        
        // Check if translation is available in requested language
        let translationText = '';
        let authorText = '';
        
        if (isEnglish) {
            // Try different English translators in order of preference
            if (quoteData.siva && quoteData.siva.et) {
                translationText = quoteData.siva.et;
                authorText = quoteData.siva.author || 'Swami Sivananda';
            } else if (quoteData.purohit && quoteData.purohit.et) {
                translationText = quoteData.purohit.et;
                authorText = quoteData.purohit.author || 'Shri Purohit Swami';
            } else if (quoteData.san && quoteData.san.et) {
                translationText = quoteData.san.et;
                authorText = quoteData.san.author || 'Dr.S.Sankaranarayan';
            } else if (quoteData.adi && quoteData.adi.et) {
                translationText = quoteData.adi.et;
                authorText = quoteData.adi.author || 'Swami Adidevananda';
            } else if (quoteData.gambir && quoteData.gambir.et) {
                translationText = quoteData.gambir.et;
                authorText = quoteData.gambir.author || 'Swami Gambirananda';
            } else {
                // Fallback
                translationText = "Translation not available in English";
                authorText = "Unknown";
            }
        } else {
            // Hindi translation
            if (quoteData.tej && quoteData.tej.ht) {
                translationText = quoteData.tej.ht;
                authorText = quoteData.tej.author || 'Swami Tejomayananda';
            } else if (quoteData.rams && quoteData.rams.ht) {
                translationText = quoteData.rams.ht;
                authorText = quoteData.rams.author || 'Swami Ramsukhdas';
            } else {
                // Fallback
                translationText = "हिन्दी में अनुवाद उपलब्ध नहीं है";
                authorText = "अज्ञात";
            }
        }
        
        const content = `
            <div class="quote-content">
                <p>${quoteData.slok || quoteData.transliteration || "Verse text not available"}</p>
                <p>${translationText}</p>
                <p class="author">Author: ${authorText}</p>
                ${chapterVerse ? `<p class="verse-reference">${chapterVerse}</p>` : ''}
            </div>`;
        
        if (!skipAnimation) {
            elements.quote.style.opacity = '0';
            setTimeout(() => {
                elements.quote.innerHTML = content;
                elements.quote.style.opacity = '1';
            }, CONFIG.animation.duration);
        } else {
            elements.quote.innerHTML = content;
        }
    },
    
    displayError: (errorType = 'generic') => {
        if (!elements.quote) return;
        
        let errorMessage = '';
        
        switch(errorType) {
            case 'offline':
                errorMessage = `
                    <div class="error-quote">
                        <p>You are offline and no cached quotes are available.</p>
                        <p>Please check your internet connection and try again.</p>
                    </div>`;
                break;
            case 'api':
                errorMessage = `
                    <div class="error-quote">
                        <p>Unable to reach the server. Please try again later.</p>
                        <p>Our servers may be experiencing temporary issues.</p>
                    </div>`;
                break;
            default:
                errorMessage = `
                    <div class="error-quote">
                        <p>Unable to load quote. Please try again.</p>
                    </div>`;
        }
        
        elements.quote.innerHTML = errorMessage;
        elements.quote.style.opacity = '1';
    },
    
    updateDateTime: () => {
        if (!elements.dateTimeContainer) return;
        const now = new Date();
        
        // Split date and time into separate elements if they don't exist yet
        if (!elements.dateElement || !elements.timeElement) {
            elements.dateTimeContainer.innerHTML = `
                <div class="date" id="date-element">${utils.formatDate(now)}</div>
                <div class="time" id="time-element">${utils.formatTime(now)}</div>`;
            
            // Cache the elements for future updates
            elements.dateElement = document.getElementById('date-element');
            elements.timeElement = document.getElementById('time-element');
        } else {
            // Update only what's needed
            elements.timeElement.textContent = utils.formatTime(now);
        }
    },
    
    // Separate function to update only the date
    updateDate: () => {
        if (!elements.dateElement) return;
        const now = new Date();
        elements.dateElement.textContent = utils.formatDate(now);
    },
    
    updateOfflineStatus: () => {
        if (!elements.offlineIndicator) return;
        
        const isOffline = !navigator.onLine;
        
        if (isOffline) {
            elements.offlineIndicator.classList.add('visible');
        } else {
            elements.offlineIndicator.classList.remove('visible');
        }
    }
};

// Quote fetching and management
const quoteManager = {
    async fetchChaptersInfo(forceRefresh = false) {
        try {
            // First check if we're online 
            const isOnline = navigator.onLine;
            
            // Check if chaptersData is in cache and not expired, unless a refresh is forced
            if (!forceRefresh && cache.hasChaptersData()) {
                console.log('Using cached chapters data');
                return cache.getChaptersData();
            }
            
            // If we are offline and need to refresh, try to use expired cached data
            if (!isOnline) {
                console.log('Offline: Using cached chapters data even if expired');
                const cachedData = cache.getChaptersData();
                if (cachedData) {
                    return cachedData;
                }
                console.warn('No cached chapters data available while offline');
                return null;
            }
            
            // If online and cacheData is expired or forced refresh, fetch new data
            console.log('Fetching chapters data from API');
            const response = await fetch(CONFIG.api.chaptersUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const chaptersData = await response.json();
            
            // Validate chaptersData structure
            if (!Array.isArray(chaptersData) || chaptersData.length === 0) {
                throw new Error('Invalid chapters data format received');
            }
            
            // Save chapters data to cache
            cache.saveChaptersData(chaptersData);
            
            return chaptersData;
        } catch (fetchError) {
            console.warn('API fetch for chapters failed:', fetchError);
            
            // Try to use cached chapters data even if expired in case of network/API error
            const cachedData = cache.getChaptersData();
            if (cachedData) {
                console.log('Using expired cached chapters data as fallback due to fetch error');
                return cachedData;
            }
            
            console.error('No chapters data available in cache as fallback');
            return null;
        }
    },

    /**
     * Gets the verse count for a specific chapter, either from chapters data or config
     */
    getVerseCount(chapter, chaptersData) {
        // If we have chapters data, use the actual verses count for the selected chapter
        if (chaptersData && chaptersData[chapter-1] && chaptersData[chapter-1].verses_count) {
            return chaptersData[chapter-1].verses_count;
        }
        
        // Otherwise fall back to pre-configured values
        console.log(`Using pre-configured verse count for chapter ${chapter}`);
        return CONFIG.content.maxVersesPerChapter[chapter - 1];
    },

    async fetchQuote() {
        if (state.isFetching) return;
        state.isFetching = true;
        
        ui.showLoadingState();
        ui.updateButtonStates(true);
        ui.changeBackgroundImage();
        ui.updateOfflineStatus();
        
        try {
            // First check if we're online
            const isOnline = navigator.onLine;
            
            // Choose a random chapter
            const chapter = utils.getRandomChapter();
            
            // Try to get chapters data for more accurate verse count
            // Note: This will use the cache if available
            const chaptersData = await quoteManager.fetchChaptersInfo();
            
            // Get verse count and choose a random verse
            const verseCount = quoteManager.getVerseCount(chapter, chaptersData);
            const verse = Math.floor(Math.random() * verseCount) + 1;
            
            // Check if we have any cached verses at all
            const hasCachedVerses = !!cache.getRandomCachedVerse();
            
            // If offline and no cache, try fallback verses before showing error
            if (!isOnline && !hasCachedVerses) {
                if (FALLBACK_VERSES.length > 0) {
                    console.log('Offline with no cache — using fallback verse bundle');
                    const fallbackVerse = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
                    state.currentQuoteData = fallbackVerse;
                    ui.displayQuote(fallbackVerse);
                    return;
                }
                console.error('Offline and no cached or fallback verses available');
                ui.displayError('offline');
                return;
            }
            
            // Check if this specific verse is already in the cache and not expired
            if (cache.hasVerse(chapter, verse) && !cache.isVerseExpired(chapter, verse)) {
                console.log(`Using cached verse: Chapter ${chapter}, Verse ${verse}`);
                const cachedQuote = cache.getVerse(chapter, verse);
                state.currentQuoteData = cachedQuote;
                ui.displayQuote(cachedQuote);
            } else {
                // If not in cache or expired, fetch from API (if online)
                if (isOnline) {
                    try {
                        console.log(`Fetching from API: Chapter ${chapter}, Verse ${verse}`);
                        const response = await fetch(`${CONFIG.api.baseUrl}/${chapter}/${verse}`);
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        if (!data?.slok) {
                            throw new Error('Invalid quote data received');
                        }
                        
                        state.currentQuoteData = data;
                        cache.add(data, chapter, verse);
                        ui.displayQuote(data);
                    } catch (apiError) {
                        console.warn('API fetch failed, using cache as fallback:', apiError);
                        
                        // Try using cache since API request failed
                        if (hasCachedVerses) {
                            // First try to use any cached verse from the same chapter
                            if (cache.hasChapter(chapter)) {
                                const chapterVerses = cache.getChapterVerses(chapter);
                                const verseKeys = Object.keys(chapterVerses);
                                if (verseKeys.length > 0) {
                                    const randomVerseKey = verseKeys[Math.floor(Math.random() * verseKeys.length)];
                                    const cachedQuote = chapterVerses[randomVerseKey];
                                    state.currentQuoteData = cachedQuote;
                                    ui.displayQuote(cachedQuote);
                                } else {
                                    // As a last resort, get any random cached verse
                                    const cachedQuote = cache.getRandomCachedVerse();
                                    state.currentQuoteData = cachedQuote;
                                    ui.displayQuote(cachedQuote);
                                }
                            } else {
                                // Get any random cached verse
                                const cachedQuote = cache.getRandomCachedVerse();
                                state.currentQuoteData = cachedQuote;
                                ui.displayQuote(cachedQuote);
                            }
                        } else if (FALLBACK_VERSES.length > 0) {
                            // No cached verses but we have fallback bundle
                            console.log('API failed with no cache — using fallback verse bundle');
                            const fallbackVerse = FALLBACK_VERSES[Math.floor(Math.random() * FALLBACK_VERSES.length)];
                            state.currentQuoteData = fallbackVerse;
                            ui.displayQuote(fallbackVerse);
                        } else {
                            // No cached verses, no fallback, and API failed
                            ui.displayError('api');
                        }
                    }
                } else {
                    // We're offline but have some cache, use any available cached verse
                    console.log('Offline, using cached verse');
                    const cachedQuote = cache.getRandomCachedVerse();
                    state.currentQuoteData = cachedQuote;
                    ui.displayQuote(cachedQuote);
                }
            }
        } catch (error) {
            console.error('Critical error in quote fetching:', error);
            ui.displayError();
        } finally {
            state.isFetching = false;
            ui.updateButtonStates(false);
            ui.updateOfflineStatus();
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
    },

    async showChapterInfo() {
        if (!elements.chapterInfoContainer) return;
        
        if (elements.chapterInfoContainer.style.display === 'none') {
            elements.chapterInfoContainer.style.display = 'block';
            elements.chapterInfoContainer.innerHTML = '<div class="loading">Loading chapter information...</div>';
            
            // For showing chapter info, we want the most up-to-date data
            // If cached data exists but is stale (over a day old), try refreshing it
            const cacheData = cache.get();
            const forceRefresh = cacheData.chaptersDataTimestamp && 
                                (Date.now() - cacheData.chaptersDataTimestamp > 24 * 60 * 60 * 1000);
            
            const chaptersData = await quoteManager.fetchChaptersInfo(forceRefresh);
            
            if (chaptersData) {
                const isEnglish = state.languagePreference === 'english';
                let chaptersHtml = '<div class="chapters-list">';
                chaptersHtml += '<h2>' + (isEnglish ? 'Bhagavad Gita Chapters' : 'भगवद गीता अध्याय') + '</h2>';
                chaptersHtml += '<div class="close-btn" id="close-chapter-info">×</div>';
                
                chaptersData.forEach(chapter => {
                    // Check if the chapter has detailed information
                    const hasDetailedInfo = chapter.meaning && chapter.summary;
                    
                    chaptersHtml += `
                        <div class="chapter-item">
                            <h3>${chapter.chapter_number}. ${chapter.translation ? (isEnglish ? chapter.translation : chapter.name) : chapter.name}</h3>
                            ${hasDetailedInfo ? `<p class="chapter-meaning">${isEnglish ? chapter.meaning.en : chapter.meaning.hi}</p>` : ''}
                            <p class="verses-count">${isEnglish ? 'Verses' : 'श्लोक'}: ${chapter.verses_count}</p>
                            ${hasDetailedInfo ? `<p class="chapter-summary">${isEnglish ? chapter.summary.en : chapter.summary.hi}</p>` : ''}
                        </div>
                    `;
                });
                
                chaptersHtml += '</div>';
                elements.chapterInfoContainer.innerHTML = chaptersHtml;
                
                // Add event listener to close button
                document.getElementById('close-chapter-info').addEventListener('click', () => {
                    elements.chapterInfoContainer.style.display = 'none';
                });
            } else {
                elements.chapterInfoContainer.innerHTML = '<div class="error">Failed to load chapter information.</div>';
            }
        } else {
            elements.chapterInfoContainer.style.display = 'none';
        }
    }
};

// Add magical rain effect functions
const magicRain = {
    interval: null,
    state: {
        isActive: false,
        wasPaused: false
    },
    
    createDrop: () => {
        const drop = document.createElement('div');
        drop.className = 'magic-drop';
        drop.style.left = `${Math.random() * 100}%`;
        
        // More random animation duration for natural effect
        drop.style.animationDuration = `${Math.random() * 2 + 1.2}s`;
        
        // Higher base opacity
        drop.style.opacity = Math.random() * 0.3 + 0.7;
        
        // Vary the size significantly for depth effect
        const size = Math.random() * 7 + 4; // Between 4-11px
        drop.style.width = `${size * 0.5}px`;
        drop.style.height = `${size}px`;
        
        // Slightly different colors for visual interest
        const colors = [
            'rgba(255, 255, 255, 0.9)', // White
            'rgba(230, 255, 255, 0.9)', // Light blue tint
            'rgba(255, 255, 240, 0.9)', // Light yellow tint
            'rgba(240, 255, 255, 0.9)'  // Light cyan tint
        ];
        const endColors = [
            'rgba(255, 255, 255, 0.3)',
            'rgba(200, 240, 255, 0.3)',
            'rgba(255, 255, 200, 0.3)',
            'rgba(200, 255, 255, 0.3)'
        ];
        
        const colorIndex = Math.floor(Math.random() * colors.length);
        drop.style.background = `linear-gradient(to bottom, ${colors[colorIndex]}, ${endColors[colorIndex]})`;
        
        // Random glow intensity based on size
        const glowIntensity = Math.min(size / 3, 3);
        drop.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.8)`;
        
        // Add a slight horizontal movement
        const startX = Math.random() * 30 - 15; // Random start position 
        const endX = startX + (Math.random() * 60 - 30); // End position with momentum
        drop.style.setProperty('--start-x', `${startX}px`);
        drop.style.setProperty('--end-x', `${endX}px`);
        
        return drop;
    },
    
    start: () => {
        if (magicRain.state.isActive) return;
        magicRain.state.isActive = true;
        magicRain.state.wasPaused = false;
        elements.magicRainButton.textContent = '✨ Stop Magic';
        
        // Start rain sound if enabled
        if (elements.rainSoundCheckbox && elements.rainSoundCheckbox.checked) {
            elements.rainVolumeContainer.style.visibility = 'visible';
            elements.rainVolumeContainer.style.opacity = '1';
            elements.rainVolumeContainer.style.width = 'auto'; // Restore width
            elements.rainVolumeContainer.style.padding = '4px 10px'; // Restore padding
            if (elements.rainSound) {
                elements.rainSound.currentTime = 0;
                elements.rainSound.play().catch(error => {
                    console.log('Rain sound playback failed:', error);
                });
            }
        }
        
        // Continuously add new drops and remove old ones
        magicRain.interval = setInterval(() => {
            // Add new drops
            for (let i = 0; i < 5; i++) {
                elements.magicRainContainer.appendChild(magicRain.createDrop());
            }
            
            // Remove drops that have completed their animation
            const drops = elements.magicRainContainer.getElementsByClassName('magic-drop');
            if (drops.length > CONFIG.performance.maxMagicDrops) {
                const excessDrops = drops.length - CONFIG.performance.maxMagicDrops;
                for (let i = 0; i < excessDrops; i++) {
                    if (drops[i]) drops[i].remove();
                }
            }
        }, 200);
    },
    
    stop: () => {
        if (!magicRain.state.isActive) return;
        magicRain.state.isActive = false;
        magicRain.state.wasPaused = false;
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
        if (magicRain.state.isActive) {
            magicRain.stop();
        } else {
            magicRain.start();
        }
    },
    
    // Add pause/resume for visual effects only while keeping audio playing
    pauseVisualOnly: () => {
        if (!magicRain.state.isActive) return;
        magicRain.state.wasPaused = true;
        
        // Pause only the visual animations
        clearInterval(magicRain.interval);
        
        // Fade out existing drops gradually to reduce visual load
        const drops = elements.magicRainContainer.getElementsByClassName('magic-drop');
        Array.from(drops).forEach((drop, index) => {
            setTimeout(() => {
                drop.style.opacity = '0';
                setTimeout(() => drop.remove(), 500);
            }, index * 10);
        });
    },
    
    resumeVisualOnly: () => {
        if (!magicRain.state.wasPaused) return;
        magicRain.state.wasPaused = false;
        magicRain.state.isActive = true;
        
        // Restart the visual effect
        magicRain.interval = setInterval(() => {
            // Add new drops and remove old ones
            const drops = elements.magicRainContainer.getElementsByClassName('magic-drop');
            if (drops.length > CONFIG.performance.maxMagicDrops) {
                const excessDrops = drops.length - CONFIG.performance.maxMagicDrops;
                for (let i = 0; i < excessDrops; i++) {
                    if (drops[i]) drops[i].remove();
                }
            }
            
            // Add new drops
            for (let i = 0; i < 5; i++) {
                elements.magicRainContainer.appendChild(magicRain.createDrop());
            }
        }, 200);
    }
};

// Feather magic effects
const featherMagic = {
    animate: () => {
        if (state.isFeatherAnimating || !elements.mayurPankh) return;
        
        state.isFeatherAnimating = true;
        
        // Store original styles and position data
        const feather = elements.mayurPankh;
        const originalStyles = {
            position: feather.style.position || 'relative',
            top: feather.style.top || '',
            left: feather.style.left || '',
            transform: feather.style.transform || '',
            transition: feather.style.transition || '',
            width: feather.offsetWidth + 'px',
            zIndex: feather.style.zIndex || '1'
        };
        
        // Get original position before making absolute
        const featherRect = feather.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        const originalTopPosition = featherRect.top - containerRect.top;
        const originalLeftPosition = featherRect.left - containerRect.left;
        
        // Add the active class for initial effects
        feather.classList.add('mayur-pankh-active');
        
        // Create sparkles
        for (let i = 0; i < 15; i++) {
            createSparkle(feather);
        }
        
        // Animate the feather around the screen
        setTimeout(() => {
            // Move to random positions with growing and shrinking
            let steps = 5;
            let currentStep = 0;
            
            // Make position absolute for animation
            feather.style.position = 'absolute';
            feather.style.top = originalTopPosition + 'px';
            feather.style.left = originalLeftPosition + 'px';
            feather.style.zIndex = '100';
            
            const moveFeather = () => {
                if (currentStep >= steps) {
                    // Return to original position and state with smooth transition
                    feather.style.transition = 'all 0.8s ease-in-out';
                    feather.style.transform = 'scale(1) rotate(0deg)';
                    feather.style.top = originalTopPosition + 'px';
                    feather.style.left = originalLeftPosition + 'px';
                    
                    // Wait for transition to complete before restoring original state
                    setTimeout(() => {
                        // Reset to original styles
                        feather.style.position = originalStyles.position;
                        feather.style.top = originalStyles.top;
                        feather.style.left = originalStyles.left;
                        feather.style.transform = originalStyles.transform;
                        feather.style.transition = originalStyles.transition;
                        feather.style.zIndex = originalStyles.zIndex;
                        feather.classList.remove('mayur-pankh-active');
                        
                        // Re-enable normal float animation
                        feather.style.animation = '';
                        void feather.offsetWidth; // Force reflow
                        feather.style.animation = 'float 6s ease-in-out infinite';
                        
                        state.isFeatherAnimating = false;
                    }, 800);
                    return;
                }
                
                // Pause the float animation during magic movement
                feather.style.animation = 'none';
                
                // Random position within the container
                const containerRect = document.querySelector('.container').getBoundingClientRect();
                const randomTop = Math.random() * (containerRect.height - 100);
                const randomLeft = Math.random() * (containerRect.width - 100);
                
                // Random scale between 1.2 and 2.5
                const scale = 1.2 + Math.random() * 1.3;
                
                // Random rotation
                const rotation = Math.random() * 360;
                
                feather.style.transition = 'all 0.7s ease-in-out';
                feather.style.top = randomTop + 'px';
                feather.style.left = randomLeft + 'px';
                feather.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                
                // Create more sparkles at each position
                for (let i = 0; i < 5; i++) {
                    createSparkle(feather);
                }
                
                currentStep++;
                setTimeout(moveFeather, 700);
            };
            
            // Start the movement
            moveFeather();
        }, 300);
    }
};

// Replace the existing createSparkle function with this optimized version
function createSparkle(parent) {
    // Check if we're at the maximum number of sparkles
    const currentSparkles = document.querySelectorAll('.sparkle');
    if (currentSparkles.length >= CONFIG.performance.maxSparkles) {
        // Remove the oldest sparkle before creating a new one
        if (currentSparkles[0]) {
            currentSparkles[0].remove();
        }
    }
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.width = Math.random() * 8 + 2 + 'px';
    sparkle.style.height = sparkle.style.width;
    
    // Set position within the parent element
    const rect = parent.getBoundingClientRect();
    const sparkleX = Math.random() * rect.width;
    const sparkleY = Math.random() * rect.height;
    
    sparkle.style.left = sparkleX + 'px';
    sparkle.style.top = sparkleY + 'px';
    
    // Set a random color
    const colors = ['#ffd700', '#ffcc00', '#ffec80', '#fff6d5', '#fffaec'];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    // Set timestamp for cleanup
    sparkle.dataset.created = Date.now();
    
    // Add to parent and cleanup after animation
    parent.appendChild(sparkle);
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000); // Remove after animation completes
}

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
        if (!elements.rainVolumeContainer || !elements.rainSound) return;
        
        if (elements.rainSoundCheckbox.checked) {
            // Show volume slider
            elements.rainVolumeContainer.style.visibility = 'visible';
            elements.rainVolumeContainer.style.opacity = '1';
            elements.rainVolumeContainer.style.width = 'auto'; // Restore width
            elements.rainVolumeContainer.style.padding = '4px 10px'; // Restore padding
            
            // If magic rain is active, start playing the sound immediately
            if (magicRain.state.isActive) {
                elements.rainSound.currentTime = 0;
                elements.rainSound.play().catch(error => {
                    console.log('Rain sound playback failed:', error);
                });
            }
        } else {
            // Hide volume slider
            elements.rainVolumeContainer.style.visibility = 'hidden';
            elements.rainVolumeContainer.style.opacity = '0';
            elements.rainVolumeContainer.style.width = '0'; // Collapse width
            elements.rainVolumeContainer.style.padding = '0'; // Remove padding
            
            // Stop the rain sound
            elements.rainSound.pause();
            elements.rainSound.currentTime = 0;
        }
    },
    
    handleRainVolumeChange: () => {
        if (!elements.rainSound || !elements.rainVolumeSlider) return;
        elements.rainSound.volume = elements.rainVolumeSlider.value;
    },
    
    handleChapterInfoToggle: () => {
        quoteManager.showChapterInfo();
    },
    
    handleFeatherClick: () => {
        featherMagic.animate();
    }
};

// Add this new performance monitoring and cleanup utility after the utils object
const performance = {
    // Keep track of created elements for cleanup
    createdElements: {
        magicDrops: [],
        sparkles: []
    },
    
    // Cleanup function to remove old elements
    cleanupElements: () => {
        // Clean up magic drops that are off-screen
        const magicDrops = document.querySelectorAll('.magic-drop');
        if (magicDrops.length > CONFIG.performance.maxMagicDrops) {
            const excessDrops = magicDrops.length - CONFIG.performance.maxMagicDrops;
            for (let i = 0; i < excessDrops; i++) {
                if (magicDrops[i]) {
                    magicDrops[i].remove();
                }
            }
        }
        
        // Clean up sparkles that should be removed
        const sparkles = document.querySelectorAll('.sparkle');
        sparkles.forEach(sparkle => {
            const age = Date.now() - (sparkle.dataset.created || 0);
            if (age > 2000) { // Remove sparkles older than 2 seconds
                sparkle.remove();
            }
        });
        
        // Limit the number of sparkles
        if (sparkles.length > CONFIG.performance.maxSparkles) {
            const excessSparkles = sparkles.length - CONFIG.performance.maxSparkles;
            for (let i = 0; i < excessSparkles; i++) {
                if (sparkles[i]) {
                    sparkles[i].remove();
                }
            }
        }
    },
    
    // Start periodic cleanup
    startCleanupInterval: () => {
        performance.cleanupIntervalId = setInterval(
            performance.cleanupElements, 
            CONFIG.performance.cleanupInterval || 60000
        );
    },
    
    // Stop cleanup interval
    stopCleanupInterval: () => {
        if (performance.cleanupIntervalId) {
            clearInterval(performance.cleanupIntervalId);
            performance.cleanupIntervalId = null;
        }
    },
    
    // Properly dispose resources when tab is hidden/closed
    setupPageVisibilityHandling: () => {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab is hidden
                performance.pauseAllAnimations();
            } else {
                // Tab is visible again
                performance.resumeAllAnimations();
            }
        });
        
        // Handle before unload to clean up resources
        window.addEventListener('beforeunload', () => {
            performance.disposeAllResources();
        });
    },
    
    // Pause all animations and timers when tab is not visible
    pauseAllAnimations: () => {
        // Stop update intervals for time and date to save CPU
        if (performance.timeIntervalId) {
            clearInterval(performance.timeIntervalId);
            performance.timeIntervalId = null;
        }
        
        if (performance.dateIntervalId) {
            clearInterval(performance.dateIntervalId);
            performance.dateIntervalId = null;
        }
        
        // Pause only visual animations, let audio continue playing
        if (magicRain && magicRain.state && magicRain.state.isActive && !magicRain.state.wasPaused) {
            // Pause only the visual effect but keep track of state
            magicRain.pauseVisualOnly();
        }
        
        // Cleanup any excessive elements
        performance.cleanupElements();
    },
    
    // Resume animations when tab becomes visible again
    resumeAllAnimations: () => {
        // Restart time updates (frequent)
        if (!performance.timeIntervalId) {
            performance.timeIntervalId = setInterval(
                ui.updateDateTime, 
                CONFIG.dateTime.timeUpdateInterval
            );
        }
        
        // Restart date updates (less frequent)
        if (!performance.dateIntervalId) {
            performance.dateIntervalId = setInterval(
                ui.updateDate, 
                CONFIG.dateTime.dateUpdateInterval
            );
        }
        
        // Resume visual effects if they were active
        if (magicRain && magicRain.state && magicRain.state.wasPaused) {
            magicRain.resumeVisualOnly();
        }
    },
    
    // Clean up all resources when tab is closed
    disposeAllResources: () => {
        // Stop all intervals
        performance.stopCleanupInterval();
        
        if (performance.timeIntervalId) {
            clearInterval(performance.timeIntervalId);
        }
        
        if (performance.dateIntervalId) {
            clearInterval(performance.dateIntervalId);
        }
        
        // Stop magic rain interval
        if (magicRain.state.interval) {
            clearInterval(magicRain.state.interval);
        }
        
        // Remove all magic drops
        const magicDrops = document.querySelectorAll('.magic-drop');
        magicDrops.forEach(drop => drop.remove());
        
        // Remove all sparkles
        const sparkles = document.querySelectorAll('.sparkle');
        sparkles.forEach(sparkle => sparkle.remove());
        
        // Clean up audio resources
        if (elements.backgroundMusic) {
            elements.backgroundMusic.pause();
            elements.backgroundMusic.src = '';
        }
        
        if (elements.rainSound) {
            elements.rainSound.pause();
            elements.rainSound.src = '';
        }
    }
};

// Initialize the application
async function initialize() {
    // Load configuration first
    await loadConfiguration();
    
    // Load fallback verses for offline/API-down scenarios
    await loadFallbackVerses();
    
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
    
    if (elements.rainVolumeSlider) {
        elements.rainVolumeSlider.addEventListener('input', eventHandlers.handleRainVolumeChange);
    }
    
    if (elements.chapterInfoButton) {
        elements.chapterInfoButton.addEventListener('click', eventHandlers.handleChapterInfoToggle);
    }
    
    if (elements.mayurPankh) {
        elements.mayurPankh.addEventListener('click', eventHandlers.handleFeatherClick);
    }
    
    quoteManager.fetchQuote();
    ui.updateDateTime();
    
    // Initial update of date and time
    ui.updateDateTime();
    
    // Set up separate intervals for time and date updates
    performance.timeIntervalId = setInterval(
        ui.updateDateTime, 
        CONFIG.dateTime.timeUpdateInterval
    );
    
    performance.dateIntervalId = setInterval(
        ui.updateDate, 
        CONFIG.dateTime.dateUpdateInterval
    );
    
    // Check initial offline status
    ui.updateOfflineStatus();
    
    // Set up network status listeners
    window.addEventListener('online', () => {
        console.log('Connection restored! Fetching new data...');
        ui.updateOfflineStatus();
        
        // Only fetch new data if we have an error state currently showing
        const errorElement = document.querySelector('.error-quote');
        if (errorElement) {
            quoteManager.fetchQuote();
        }
    });
    
    window.addEventListener('offline', () => {
        console.log('Connection lost! Will use cached data if available.');
        ui.updateOfflineStatus();
        
        // No need to take immediate action - the next user interaction
        // will be handled by our improved error handling logic
    });
    
    // Set up and start performance monitoring
    performance.setupPageVisibilityHandling();
    performance.startCleanupInterval();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);

