document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameFile = urlParams.get('game');
  
  if (!gameFile) {
    window.location.href = 'game.html'; // Redirect back if no game specified
    return;
  }

  // Format title
  const title = decodeURIComponent(gameFile.split('/').pop().replace(/\.[^/.]+$/, '')).replace(/[-_]+/g, ' ');
  
  document.getElementById('game-title').textContent = title;
  document.title = `${title} | Krypton`;
  
  // Set iframe source and loading logic
  const iframe = document.getElementById('game-iframe');
  const loadingScreen = document.getElementById('loading-screen');
  
  // Show loading screen for 2 seconds, then fade out and load the game
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      iframe.src = `Games/${encodeURIComponent(gameFile)}`;
    }, 500); // Wait for transition to finish
  }, 2000); // 2 second loading delay

  // Fullscreen logic
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const iframeContainer = document.getElementById('iframe-container');

  fullscreenBtn.addEventListener('click', () => {
    if (iframeContainer.requestFullscreen) {
      iframeContainer.requestFullscreen();
    } else if (iframeContainer.webkitRequestFullscreen) { /* Safari */
      iframeContainer.webkitRequestFullscreen();
    } else if (iframeContainer.msRequestFullscreen) { /* IE11 */
      iframeContainer.msRequestFullscreen();
    }
  });
});
