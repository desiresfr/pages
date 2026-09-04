function titleFromFile(file) {
  return decodeURIComponent(file.split('/').pop().replace(/\.[^/.]+$/, '')).replace(/[-_]+/g, ' ');
}

async function loadGames() {
  const shelf = document.querySelector('#game-shelf');
  try {
    const response = await fetch('Games/');
    if (!response.ok) throw new Error('Games folder unavailable');
    const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
    const files = [...documentFragment.querySelectorAll('a[href]')]
      .map((link) => link.getAttribute('href'))
      .filter((href) => href.toLowerCase().endsWith('.html') || href.toLowerCase().endsWith('.htm'));
    shelf.replaceChildren(...files.map((file, index) => {
      const card = document.createElement('a');
      card.className = 'folder-game-card';
      card.href = `Games/${file}`;
      card.innerHTML = `<span class="folder-number">${String(index + 1).padStart(2, '0')}</span><strong>${titleFromFile(file)}</strong><span class="launch">Launch ↗</span>`;
      return card;
    }));
    if (!files.length) shelf.innerHTML = '<p class="empty-shelf">No games added yet. Drop HTML games into the Games folder.</p>';
  } catch {
    shelf.innerHTML = '<p class="empty-shelf">Games folder ready for your first upload.</p>';
  }
}

loadGames();