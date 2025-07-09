const songEntries = document.getElementsByClassName("song-entry");
const audioPlayer = new Audio(); // Create a single Audio object to reuse

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

    // Add an event listener for when the mouse enters the element's area
    entry.addEventListener('mouseover', () => {
        audioPlayer.src = songSrc; // Set the source for the audio player
        audioPlayer.play();
    });

    // Add an event listener for when the mouse leaves
    entry.addEventListener('mouseout', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reset the song to the beginning
    });
}