const songEntries = document.getElementsByClassName("song-entry");
const audioPlayer = new Audio(); // Create a single Audio object to reuse

let lastLoggedTime = -1;
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = Math.floor(audioPlayer.currentTime);
    const duration = Math.floor(audioPlayer.duration);

    // Only log once per second to avoid flooding the console, and only if duration is a valid number.
    if (currentTime !== lastLoggedTime && !isNaN(duration)) {
        console.log(`Song progress: ${currentTime}s / ${duration}s`);
        lastLoggedTime = currentTime;
    }
});

// It's good practice to stop the audio from playing when the page is hidden
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    audioPlayer.pause();
  }
});

// Loop through all elements with the class "song-entry"
for (const entry of songEntries) {
    // Get the path to the song from a data attribute on the HTML element
    // Example: <div class="song-entry" data-song-src="path/to/song1.mp3">...</div>
    const songSrc = entry.dataset.songSrc;

    // Skip this entry if it doesn't have a song source.
    if (!songSrc) {
        continue;
    }

    // Add an event listener for when the mouse enters the element's area
    entry.addEventListener('mouseover', () => {
        audioPlayer.src = songSrc; // Set the source for the audio player
        audioPlayer.play().catch(error => {
            // This error is common on hover because it's not always considered a user gesture.
            console.error("Could not play audio on hover. This is likely due to browser autoplay policies.", error);
        });
    });

    // Add an event listener for when the mouse leaves
    entry.addEventListener('mouseout', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reset the song to the beginning
    });
}