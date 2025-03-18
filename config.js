// Configuration for Geeta Quote Daily extension
const CONFIG = {
    // Extension metadata
    extension: {
        name: 'Geeta Quote Daily',
        version: '2.0',
        description: 'Get daily wisdom from Bhagavad Gita.',
        author: 'Rohit Wadhwa',
        copyright: '© 2024 Geeta Quote Daily. All rights reserved.',
        license: 'MIT'
    },

    // API Configuration
    api: {
        baseUrl: 'https://vedicscriptures.github.io/slok',
        attribution: 'Made possible with Bhagvad Gita API'
    },

    // Content Configuration
    content: {
        totalChapters: 18,
        maxVersesPerChapter: [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78],
        defaultLanguage: 'hindi',
        animationDuration: 500,
        dateTimeUpdateInterval: 1000
    },

    // Cache Configuration
    cache: {
        key: 'geeta_quotes_cache',
        expiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        maxCachedQuotes: 50
    },

    // Background Images
    backgrounds: {
        images: [
            'images/bg1.jpg',
            'images/bg2.jpg',
            'images/bg3.jpg',
            'images/bg4.jpg',
            'images/bg5.jpg',
            'images/bg6.jpg'
        ],
        transitionDuration: 1000
    },

    // Audio Configuration
    audio: {
        backgroundMusic: {
            url: 'https://aac.saavncdn.com/100/098c92cfdc25fa1373be9f572b72ea90_320.mp4',
            volume: 0.5
        },
        rainSound: {
            url: 'https://assets.mixkit.co/active_storage/sfx/1253/1253-preview.mp3',
            volume: 0.3
        }
    },

    // Magic Rain Effect Configuration
    magicRain: {
        initialDrops: 100,
        maxDrops: 150,
        dropInterval: 200,
        newDropsPerInterval: 5,
        dropSize: {
            min: 2,
            max: 5
        },
        dropOpacity: {
            min: 0.2,
            max: 0.5
        },
        animationDuration: {
            min: 1,
            max: 2.5
        }
    },

    // External Links
    links: {
        saavn: 'https://www.jiosaavn.com/album/mahabharat-krishna-theme-unplugged-version/XNhL0PS1ZtA_',
        buyMeCoffee: 'https://www.buymeacoffee.com/rohit.wadhwa',
        api: 'https://vedicscriptures.github.io/'
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
} 