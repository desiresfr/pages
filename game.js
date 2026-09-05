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

const INITIAL_SHOW = 8;
let allFiles = [];
let shownCount = 0;

let showAllMode = false;

function renderCards(files, append) {
  const shelf = document.querySelector('#game-shelf');
  const showMoreBtn = document.querySelector('#show-more-games');
  const showAllBtn = document.querySelector('#show-all-games');

  if (!append) {
    shelf.innerHTML = '';
    shownCount = 0;
    if (!files.length) {
      shelf.innerHTML = '<p class="empty-shelf">No games found. Drop .html game files into the <strong>Games</strong> folder, then add them to <code>games-manifest.json</code>.</p>';
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
        allFiles = files;
        renderCards(files, false);
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
      allFiles = files;
      renderCards(files, false);
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
    'Friday Night Funkin.html',
    'FNAF UCN.html',
    'Shift at Midnight.html',
    'Slow Roads.html',
    'Smash Karts.html',
    'Speed Stars.html',
    'Fall Guys.html',
    'FNAF 2.html',
    'FNAF 3.html',
    'FNAF 4.html',
    'FNAF 4 Halloween.html',
    'Football Bros.html',
    'Five Nights at Winstons.html',
    'Geometry Dash Wave.html',
    'Grow a Garden.html',
    'Infinate Craft.html',
    'Idle Game Dev.html',
    'Ink Game.html',
    'Animal Crossing.html',
    'Death Run.html',
    'Minecraft Modern Client.html',
    'Temple Run 2.html',
    'Paper io 3d.html',
    'Karlson.html',
    'Poly Track.html',
    'Super Mario 64.html',
    'Survivor io.html',
    'Papas Pizzeria.html',
    'Monkey Mart.html',
    'Flappy Bird.html',
    'Eggy Car.html',
    'Drive Mad.html',
    'Drift Boss.html',
    'Death Run 3d.html',
    'Capybara Clicker.html',
    'Crossy Road.html',
    'Gladihoppers.html',
    'Happy Wheels.html',
    'Level Devil.html',
    'Plants VS Zombies.html',
    'Undertale.html',
    'Tiny Fishing.html',
    'Tag.html',
    'OvO.html',
    'OvO 2.html',
    'OvO 3d.html',
    'PacMan.html',
    'Johnny Trigger.html',
    'Jumping Shell.html',
    'Shell Shockers.html',
    'Granny.html',
    'Granny 2.html',
    'Getaway Shootout.html',
    'Fruit Ninja.html',
    'Crazy Cattle 3d.html',
    'Angry Birds.html',
    '2048.html',
    'Space Waves.html',
    'Run.html',
    'The Impossible Quiz.html',
    'The Impossible Quiz 2.html',
    'Stack.html',
    'Pou.html',
    'Papas Burgeria.html',
    'Papas Bakeria.html',
    'Papas Sushiria.html',
    'Hole io.html',
    'Elastic Face.html',
    'Doodle Jump.html',
    'Cut The Rope.html',
    'Cluster Rush.html',
    'Gorilla Tag.html',
    'GTA 3.html',
    'Gun Spin.html',
    'Gym Stack.html',
    'Gravity.html',
    'We Become What we Behold.html',
    'Volley Random.html',
    'R.E.P.O Bad.html',
    'Russian Buckshot Roulette.html',
    'Rooftop Snipers 2.html'
  ];
  allFiles = knownGames;
  renderCards(knownGames, false);
}


// Show more / Show all
const showMoreGames = document.querySelector('#show-more-games');
const showAllGames = document.querySelector('#show-all-games');
if (showMoreGames) {
  showMoreGames.addEventListener('click', () => renderCards(allFiles, true));
}
if (showAllGames) {
  showAllGames.addEventListener('click', () => {
    showAllMode = true;
    shownCount = 0;
    renderCards(allFiles, false);
  });
}

loadGames();
