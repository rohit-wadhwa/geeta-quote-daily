// Background Service Worker for Geeta Quote Daily

// Configuration
const CONFIG = {
    content: {
        defaultLanguage: 'hindi'
    }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    // Set up daily alarm for quote refresh
    chrome.alarms.create('dailyQuoteRefresh', {
        when: getNextRefreshTime(),
        periodInMinutes: 24 * 60 // 24 hours
    });

    // Initialize storage
    chrome.storage.local.set({
        lastRefresh: Date.now(),
        languagePreference: CONFIG.content.defaultLanguage
    });
});

// Handle alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyQuoteRefresh') {
        // Notify content script to refresh quote
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'refreshQuote'
                });
            }
        });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateLastRefresh') {
        chrome.storage.local.set({ lastRefresh: Date.now() });
    }
});

// Helper function to calculate next refresh time
function getNextRefreshTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
} 