// Example of a basic implementation for randomness
// This example assumes a maximum of 700 verses across the Bhagavad Gita for simplicity
const totalChapters = 18;
const maxVersesPerChapter = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78]; // max verses in each chapter

function getRandomChapter() {
    return Math.floor(Math.random() * totalChapters) + 1;
}

function getRandomVerse(chapter) {
    return Math.floor(Math.random() * maxVersesPerChapter[chapter - 1]) + 1;
}

// Fetch and display the quote
function fetchQuote() {
    const quoteElement = document.getElementById('quote');
    const reloadButton = document.getElementById('reload');

    // Disable the button and show loading state
    reloadButton.disabled = true;
    reloadButton.textContent = 'Loading...';
    const chapter = getRandomChapter();
    const verse = getRandomVerse(chapter);
    fetch(`https://bhagavadgitaapi.in/slok/${chapter}/${verse}/`)
        .then(response => response.json())
        .then(data => {
            quoteElement.innerHTML = `
      <p>${data.slok}</p>
      <p>${data.tej.ht}</p>`;
            quoteElement.style.opacity = 0; // Prepare for animation
            setTimeout(() => {
                quoteElement.style.opacity = 1; // Start animation
                reloadButton.disabled = false;
                reloadButton.textContent = '⟳ Reload';
            }, 1200); // Short delay to ensure the opacity change triggers animation
        })
        .catch(error => {
            console.error('Error fetching the quote:', error);
            // Handle error state here, optionally re-enabling the button or providing user feedback
            reloadButton.disabled = false;
            reloadButton.textContent = '⟳ Reload';
        });

}

// Reload quote
document.getElementById('reload').addEventListener('click', function () {
    // const quoteElement = document.getElementById('quote');
    // quoteElement.innerHTML =`Loading...`;
    fetchQuote();
    updateDateTime();
    changeBackground();
});

// Update date and time
// Generate and update date-time with animation
function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});

    // Update date
    const dateTimeContainer = document.getElementById('date-time');
    dateTimeContainer.innerHTML = `<div class="date">${dateString}</div><div class="time">${timeString}</div>`;
}

// Initialize
fetchQuote();
updateDateTime();
// Update the date and time every minute
setInterval(updateDateTime, 1000);

document.getElementById('music-toggle').addEventListener('click', function () {
    const music = document.getElementById('background-music');
    if (music.paused) {
        music.play();
        this.textContent = '🔇 Stop Music'; // Update button text
    } else {
        music.pause();
        this.textContent = '🔊 Play Music'; // Update button text
    }
});

function changeBackground() {
    // Array of background images
    const backgrounds = [
        'images/bg1.jpg',
        'images/bg2.jpg',
        'images/bg3.jpg',
        'images/bg4.jpg',
        'images/background.png'
    ];

    // Select a random background
    const selectedBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // Set the background style
    document.body.style.backgroundImage = `url('${selectedBackground}')`;
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
}

// Initialize the page with your existing functions
document.addEventListener("DOMContentLoaded", function () {
    changeBackground();
});
