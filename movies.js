function titleFromFile(file) {
  return decodeURIComponent(file.split('/').pop().replace(/\.[^/.]+$/, '')).replace(/[-_]+/g, ' ');
}

function fmtTime(s) {
  if (isNaN(s)) return '0:00:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h + ':' + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function buildCard(file, index) {
  const card = document.createElement('a');
  card.className = 'folder-game-card';
  card.href = `play.html?movie=${encodeURIComponent(file)}`;
  card.dataset.title = titleFromFile(file).toLowerCase();
  card.innerHTML = `
    <span class="card-index">${String(index + 1).padStart(2, '0')}</span>
    <div class="card-body">
      <strong>${titleFromFile(file)}</strong>
      <span class="card-file">${file}</span>
    </div>
    <span class="launch">Watch <span>↗</span></span>`;
  return card;
}

function thumbForFile(file) {
  const name = file.replace(/\.[^/.]+$/, '');
  return 'continue-movie/' + encodeURIComponent(name) + '.jpg';
}

function buildContinueCard(entry) {
  const pct = entry.duration ? Math.round((entry.time / entry.duration) * 100) : 0;
  const card = document.createElement('a');
  card.className = 'cw-card';
  card.href = `play.html?movie=${encodeURIComponent(entry.file)}`;
  card.innerHTML = `
    <div class="cw-thumb">
      <div class="cw-gradient"></div>
      <span class="cw-play-icon">▶</span>
      <div class="cw-progress-track">
        <div class="cw-progress-fill" style="width:${pct}%"></div>
      </div>
    </div>
    <div class="cw-info">
      <span class="cw-title">${entry.title}</span>
      <span class="cw-time">${fmtTime(entry.time)} / ${fmtTime(entry.duration)}</span>
    </div>`;
  const thumb = card.querySelector('.cw-thumb');
  const img = new Image();
  img.src = thumbForFile(entry.file);
  img.onload = () => {
    thumb.style.background = `url('${img.src}') center/cover no-repeat`;
  };
  return card;
}

function getContinueWatching() {
  const items = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('krypton_continue_')) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (data && data.time && data.duration) {
        const pct = data.time / data.duration;
        if (pct < 0.95) items.push(data);
      }
    } catch {}
  }
  items.sort((a, b) => (b.saved || 0) - (a.saved || 0));
  return items;
}

function renderContinueWatching() {
  const items = getContinueWatching();
  const section = document.getElementById('continue-section');
  const shelf = document.getElementById('continue-shelf');
  if (!items.length) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  shelf.replaceChildren(...items.map(e => buildContinueCard(e)));
}

const INITIAL_SHOW = 8;
let allFiles = [];
let shownCount = 0;

let showAllMode = false;

function renderCards(files, append) {
  const shelf = document.querySelector('#movie-shelf');
  const showMoreBtn = document.querySelector('#show-more-movies');
  const showAllBtn = document.querySelector('#show-all-movies');

  if (!append) {
    shelf.innerHTML = '';
    shownCount = 0;
    if (!files.length) {
      shelf.innerHTML = '<p class="empty-shelf">No movies found.</p>';
      if (showMoreBtn) showMoreBtn.style.display = 'none';
      if (showAllBtn) showAllBtn.style.display = 'none';
      return;
    }
  }

  const start = append ? shownCount : 0;
  const end = showAllMode ? files.length : (append ? Math.min(shownCount + INITIAL_SHOW, files.length) : INITIAL_SHOW);
  const visible = files.slice(start, end);
  visible.forEach((f, i) => {
    shelf.appendChild(buildCard(f, start + i));
  });

  shownCount = end;

  if (files.length > shownCount && !showAllMode) {
    if (showMoreBtn) {
      showMoreBtn.style.display = '';
      showMoreBtn.querySelector('span').textContent = files.length - shownCount;
    }
    if (showAllBtn) showAllBtn.style.display = '';
  } else {
    if (showMoreBtn) showMoreBtn.style.display = 'none';
    if (showAllBtn) showAllBtn.style.display = 'none';
  }

  updateCount(files.length);
}

function updateCount(n) {
  const counter = document.querySelector('#movie-count');
  if (counter) counter.textContent = `${n} movie${n !== 1 ? 's' : ''} available`;
}

async function loadMovies() {
  const shelf = document.querySelector('#movie-shelf');
  let files = [];

  try {
    const res = await fetch('movies-manifest.json');
    if (res.ok) {
      files = await res.json();
      if (Array.isArray(files) && files.length) {
        allFiles = files;
        renderCards(files, false);
        return;
      }
    }
  } catch { /* fall through */ }

  try {
    const res = await fetch('Movies/');
    if (!res.ok) throw new Error('no listing');
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    files = [...doc.querySelectorAll('a[href]')]
      .map(a => a.getAttribute('href'))
      .filter(h => /\.(mp4|mov|webm|mkv)$/i.test(h));
    if (files.length) {
      allFiles = files;
      renderCards(files, false);
      return;
    }
  } catch { /* fall through */ }

  const knownMovies = [
    'Coco.mkv',
    'Deadpool.mp4',
    'Barbie.mkv'
  ];
  allFiles = knownMovies;
  renderCards(knownMovies, false);
}

// Show more / Show all
const showMoreMovies = document.querySelector('#show-more-movies');
const showAllMovies = document.querySelector('#show-all-movies');
if (showMoreMovies) {
  showMoreMovies.addEventListener('click', () => renderCards(allFiles, true));
}
if (showAllMovies) {
  showAllMovies.addEventListener('click', () => {
    showAllMode = true;
    shownCount = 0;
    renderCards(allFiles, false);
  });
}

renderContinueWatching();
loadMovies();
