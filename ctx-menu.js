(function () {
  const menu = document.createElement('div');
  menu.className = 'ctx-menu';
  menu.innerHTML = `
    <button class="ctx-item" data-action="back">← Back</button>
    <button class="ctx-item" data-action="home">⌂ Home</button>
    <button class="ctx-item ctx-sep"></button>
    <button class="ctx-item" data-action="games">Games</button>
    <button class="ctx-item" data-action="movies">Movies</button>
    <button class="ctx-item ctx-sep"></button>
    <button class="ctx-item" data-action="reload">↻ Reload</button>
    <button class="ctx-item" data-action="top">↑ Scroll to top</button>
  `;
  document.body.appendChild(menu);

  const style = document.createElement('style');
  style.textContent = `
    .ctx-menu {
      background: rgba(6, 20, 8, .92);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(53, 255, 53, .15);
      border-radius: 10px;
      display: none;
      flex-direction: column;
      gap: 2px;
      min-width: 170px;
      padding: 6px;
      position: fixed;
      z-index: 999;
      box-shadow: 0 8px 32px rgba(0, 0, 0, .5), 0 0 1px rgba(53, 255, 53, .3);
    }
    .ctx-menu.show { display: flex; }
    .ctx-item {
      align-items: center;
      background: none;
      border: none;
      color: #b0d4b2;
      cursor: pointer;
      font: 400 12px var(--mono);
      padding: 8px 14px;
      border-radius: 6px;
      text-align: left;
      transition: background .12s, color .12s;
    }
    .ctx-item:hover {
      background: rgba(53, 255, 53, .1);
      color: var(--green);
    }
    .ctx-sep {
      height: 1px;
      background: rgba(53, 255, 53, .1);
      margin: 2px 8px;
      padding: 0;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.classList.add('show');
    const x = Math.min(e.clientX, window.innerWidth - 190);
    const y = Math.min(e.clientY, window.innerHeight - 260);
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
  });

  document.addEventListener('click', () => menu.classList.remove('show'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menu.classList.remove('show'); });

  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.ctx-item');
    if (!btn) return;
    const a = btn.dataset.action;
    if (a === 'back') history.back();
    else if (a === 'home') location.href = 'index.html';
    else if (a === 'games') location.href = 'game.html';
    else if (a === 'movies') location.href = 'movies.html';
    else if (a === 'reload') location.reload();
    else if (a === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
