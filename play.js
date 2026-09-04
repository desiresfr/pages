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
  
  // Set iframe source
  const iframe = document.getElementById('game-iframe');
  iframe.src = `Games/${encodeURIComponent(gameFile)}`;

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
