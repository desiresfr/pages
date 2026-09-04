const modal = document.querySelector('#game-modal');
const modalTitle = document.querySelector('#modal-title');
const instructions = document.querySelector('#modal-instructions');
const target = document.querySelector('#target');
const startMessage = document.querySelector('#start-message');
const startGame = document.querySelector('#start-game');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const result = document.querySelector('#game-result');
let score = 0;
let timeLeft = 20;
let timerId;
let gameActive = false;
const typewriter = document.querySelector('.typewriter');
const typewriterText = 'Play smarter. Have fun.';
let typewriterIndex = 0;

function typeTitle() {
  if (typewriterIndex > typewriterText.length) return;
  typewriter.textContent = typewriterText.slice(0, typewriterIndex);
  typewriterIndex += 1;
  window.setTimeout(typeTitle, typewriterIndex === typewriterText.length + 1 ? 1400 : 75);
}

typeTitle();

const gameDetails = {
  drift: ['Krypton Drift', 'Click the targets as they appear. Score 10 points before time runs out.'],
  bloom: ['Bloom Room', 'A quiet garden is coming soon. Try Krypton Drift while you wait.'],
  grid: ['Gridlock', 'A quick puzzle mode is coming soon. Try Krypton Drift while you wait.'],
  orbit: ['Orbit', 'A calm orbiting challenge is coming soon. Try Krypton Drift while you wait.'],
  word: ['Word Shift', 'A word game is coming soon. Try Krypton Drift while you wait.'],
  memory: ['Memory Lane', 'A memory challenge is coming soon. Try Krypton Drift while you wait.']
};

function openGame(gameName) {
  const [title, copy] = gameDetails[gameName] || gameDetails.drift;
  modalTitle.textContent = title;
  instructions.textContent = copy;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  resetGame();
}

function closeGame() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  clearInterval(timerId);
  gameActive = false;
}

function resetGame() {
  clearInterval(timerId);
  score = 0;
  timeLeft = 20;
  gameActive = false;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  result.textContent = '';
  target.style.display = 'none';
  startMessage.style.display = 'flex';
}

function moveTarget() {
  const stage = document.querySelector('#game-stage');
  const maxX = stage.clientWidth - target.offsetWidth;
  const maxY = stage.clientHeight - target.offsetHeight;
  target.style.left = `${Math.max(8, Math.random() * maxX)}px`;
  target.style.top = `${Math.max(8, Math.random() * maxY)}px`;
}

function finishGame() {
  clearInterval(timerId);
  gameActive = false;
  target.style.display = 'none';
  startMessage.style.display = 'flex';
  startMessage.querySelector('span').textContent = score >= 10 ? '✦' : '○';
  startGame.innerHTML = 'Play again <span>→</span>';
  result.textContent = score >= 10 ? `You did it. Final score: ${score}.` : `Nice try. Final score: ${score}.`;
}

function beginGame() {
  score = 0;
  timeLeft = 20;
  gameActive = true;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  result.textContent = '';
  startMessage.style.display = 'none';
  target.style.display = 'block';
  moveTarget();
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) finishGame();
  }, 1000);
}

document.querySelectorAll('[data-game]').forEach((card) => {
  card.querySelector('.play-button').addEventListener('click', () => openGame(card.dataset.game));
});

document.querySelector('.close-modal').addEventListener('click', closeGame);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeGame();
});
startGame.addEventListener('click', beginGame);
target.addEventListener('click', () => {
  if (!gameActive) return;
  score += 1;
  scoreDisplay.textContent = score;
  moveTarget();
  if (score >= 10) finishGame();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeGame();
});

document.querySelectorAll('.filter').forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((button) => button.classList.remove('active-filter'));
    filterButton.classList.add('active-filter');
    const selected = filterButton.dataset.filter;
    document.querySelectorAll('.game-card').forEach((card) => {
      card.hidden = selected !== 'all' && !card.dataset.category.includes(selected);
    });
  });
});