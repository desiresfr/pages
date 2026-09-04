function titleFromFile(file) {
  return decodeURIComponent(file.split('/').pop().replace(/\.[^/.]+$/, '')).replace(/[-_]+/g, ' ');
}

function buildCard(file, index) {
  const card = document.createElement('a');
  card.className = 'folder-game-card';
  card.href = `play.html?game=${encodeURIComponent(file)}`;
  card.dataset.title = titleFromFile(file).toLowerCase();
  card.innerHTML = `
    <span class="card-index">${String(index + 1).padStart(2, '0')}</span>
    <div class="card-body">
      <strong>${titleFromFile(file)}</strong>
      <span class="card-file">${file}</span>
    </div>
    <span class="launch">Launch <span>↗</span></span>`;
  return card;
}

function renderCards(files) {
  const shelf = document.querySelector('#game-shelf');
  if (!files.length) {
    shelf.innerHTML = '<p class="empty-shelf">No games found. Drop .html game files into the <strong>Games</strong> folder, then add them to <code>games-manifest.json</code>.</p>';
    return;
  }
  shelf.replaceChildren(...files.map((f, i) => buildCard(f, i)));
  updateCount(files.length);
}

function updateCount(n) {
  const counter = document.querySelector('#game-count');
  if (counter) counter.textContent = `${n} game${n !== 1 ? 's' : ''} available`;
}

async function loadGames() {
  const shelf = document.querySelector('#game-shelf');
  let files = [];

  // 1. Try the manifest first (works on any web server)
  try {
    const res = await fetch('games-manifest.json');
    if (res.ok) {
      files = await res.json();
      if (Array.isArray(files) && files.length) {
        renderCards(files);
        return;
      }
    }
  } catch { /* fall through */ }

  // 2. Fallback: fetch the Games/ directory listing (needs a server with autoIndex)
  try {
    const res = await fetch('Games/');
    if (!res.ok) throw new Error('no listing');
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    files = [...doc.querySelectorAll('a[href]')]
      .map(a => a.getAttribute('href'))
      .filter(h => /\.html?$/i.test(h));
    if (files.length) {
      renderCards(files);
      return;
    }
  } catch { /* fall through */ }

  // 3. Ultimate fallback: hardcoded game list (works even on file://)
  const knownGames = [
    'A Dance With Fire And Ice.html',
    'Escape Road 2.html',
    'Geometry Dash Lite.html',
    'BitLife.html',
    'BlackJack.html',
    'Cookie Clicker.html',
    'Paper io.html',
    'Slope.html',
    'Subway Surfers.html',
    'Agar io Lite.html',
    'CSGO Clicker.html',
    'Tetris 64.html',
    'Basketball Legends.html',
    'BrawlStars.html',
    'Ragdoll Archers.html',
    'Ragdoll Hit.html',
    'Jetpack Joyride.html',
    'Spacebar Clicker.html',
    'Steal a Brainrot.html',
    'Retro Bowl.html',
    'Retro Bowl College.html',
    'Rocket League.html',
    'Bad Parenting.html',
    'Five Nights at Epsteins.html',
    'FNAF.html',
    'Backrooms.html',
    'Slither io.html',
    'Super Hot.html',
    'There is no Game.html',
    'Friday Night Funkin.html'
  ];
  renderCards(knownGames);
}


// Wire up search
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.folder-game-card').forEach(card => {
      card.style.display = card.dataset.title.includes(q) ? '' : 'none';
    });
  });
}

loadGames();
