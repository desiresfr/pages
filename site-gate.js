(function () {
  const KEY_OWNER = 'krypton_owner';
  const KEY_WHATSNEW = 'krypton_whatsnew_seen';

  /* ===== Owner Key ===== */
  window.kryptonIsOwner = function () {
    return localStorage.getItem(KEY_OWNER) === '1';
  };

  window.kryptonUnlock = function () {
    return new Promise((resolve) => {
      injectStyles();
      const overlay = document.createElement('div');
      overlay.className = 'wn-overlay';
      overlay.innerHTML = `
        <div class="wn-box">
          <div class="wn-badge">Owner Access</div>
          <h2 class="wn-title">Enter Key</h2>
          <input type="password" class="wn-key-input" placeholder="Owner key" autofocus>
          <div class="wn-key-actions">
            <button class="wn-key-submit glow-button">Unlock <span>→</span></button>
            <button class="wn-key-cancel outline-button">Go home</button>
          </div>
          <p class="wn-key-hint"></p>
        </div>`;
      document.body.appendChild(overlay);

      const input = overlay.querySelector('.wn-key-input');
      const hint = overlay.querySelector('.wn-key-hint');

      overlay.querySelector('.wn-key-submit').addEventListener('click', () => {
        if (input.value === 'Desiownsyoufr22') {
          localStorage.setItem(KEY_OWNER, '1');
          overlay.remove();
          resolve(true);
        } else {
          hint.textContent = 'Invalid key.';
          hint.style.color = '#ff6b6b';
          input.value = '';
          input.focus();
        }
      });

      overlay.querySelector('.wn-key-cancel').addEventListener('click', () => {
        overlay.remove();
        location.href = 'index.html';
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') overlay.querySelector('.wn-key-submit').click();
      });
    });
  };

  /* ===== What's New Popup ===== */
  function injectStyles() {
    if (document.getElementById('whatsnew-styles')) return;
    const s = document.createElement('style');
    s.id = 'whatsnew-styles';
    s.textContent = `
      .wn-overlay {
        align-items: center;
        background: rgba(1, 10, 2, .85);
        backdrop-filter: blur(14px);
        display: flex;
        inset: 0;
        justify-content: center;
        position: fixed;
        z-index: 200;
        animation: wn-fade .3s ease-out;
      }
      @keyframes wn-fade { from { opacity: 0; } to { opacity: 1; } }
      .wn-box {
        background: rgba(4, 16, 6, .9);
        border: 1px solid var(--border);
        border-radius: var(--r);
        max-width: 420px;
        padding: 36px 32px;
        text-align: center;
        position: relative;
        box-shadow: 0 16px 48px rgba(0, 0, 0, .5), 0 0 1px rgba(53, 255, 53, .3);
      }
      .wn-badge {
        background: rgba(53, 255, 53, .08);
        border: 1px solid rgba(53, 255, 53, .2);
        border-radius: 30px;
        color: var(--green);
        display: inline-block;
        font: 500 10px var(--mono);
        letter-spacing: .1em;
        padding: 5px 14px;
        text-transform: uppercase;
        margin-bottom: 16px;
      }
      .wn-title {
        color: #fff;
        font: 700 22px var(--display);
        letter-spacing: -.02em;
        margin-bottom: 14px;
      }
      .wn-list {
        color: #7cc77f;
        font: 400 12px var(--mono);
        line-height: 2;
        list-style: none;
        margin-bottom: 24px;
        text-align: left;
      }
      .wn-list li::before {
        content: '+';
        color: var(--green);
        margin-right: 8px;
      }
      .wn-close {
        background: var(--green);
        border: none;
        border-radius: var(--r-sm);
        color: #020a02;
        cursor: pointer;
        font: 600 11px var(--mono);
        padding: 12px 32px;
        text-transform: uppercase;
        letter-spacing: .04em;
        transition: box-shadow .2s, transform .2s;
      }
      .wn-close:hover {
        box-shadow: 0 0 20px rgba(53, 255, 53, .3);
        transform: translateY(-1px);
      }

      /* ===== Dev Overlay ===== */
      .dev-overlay {
        align-items: center;
        background: rgba(1, 10, 2, .9);
        backdrop-filter: blur(16px);
        display: flex;
        inset: 0;
        justify-content: center;
        position: fixed;
        z-index: 150;
      }
      .dev-box {
        background: rgba(4, 16, 6, .85);
        border: 1px solid var(--border);
        border-radius: var(--r);
        max-width: 380px;
        padding: 40px 32px;
        text-align: center;
        box-shadow: 0 16px 48px rgba(0, 0, 0, .5);
      }
      .dev-icon {
        color: #ff6b6b;
        font-size: 36px;
        margin-bottom: 16px;
      }
      .dev-title {
        color: #ff6b6b;
        font: 700 18px var(--display);
        margin-bottom: 8px;
      }
      .dev-sub {
        color: #3a6a3e;
        font: 400 12px var(--mono);
        line-height: 1.6;
        margin-bottom: 24px;
      }
      .dev-btn {
        background: transparent;
        border: 1px solid rgba(255, 107, 107, .3);
        border-radius: var(--r-sm);
        color: #ff6b6b;
        cursor: pointer;
        font: 500 11px var(--mono);
        padding: 10px 24px;
        text-transform: uppercase;
        letter-spacing: .04em;
        transition: background .2s, border-color .2s;
      }
      .dev-btn:hover {
        background: rgba(255, 107, 107, .08);
        border-color: rgba(255, 107, 107, .5);
      }

      .wn-key-input {
        background: rgba(53, 255, 53, .04);
        border: 1px solid var(--border);
        border-radius: var(--r-sm);
        color: var(--text);
        font: 500 13px var(--mono);
        margin-bottom: 16px;
        outline: none;
        padding: 12px 16px;
        text-align: center;
        width: 100%;
        transition: border-color .2s, box-shadow .2s;
      }
      .wn-key-input:focus {
        border-color: rgba(53, 255, 53, .3);
        box-shadow: 0 0 12px rgba(53, 255, 53, .08);
      }
      .wn-key-input::placeholder { color: #3a6a3e; }
      .wn-key-actions {
        display: flex;
        gap: 8px;
        justify-content: center;
      }
      .wn-key-actions .glow-button, .wn-key-actions .outline-button {
        font-size: 10px;
        padding: 10px 20px;
      }
      .wn-key-hint {
        color: #ff6b6b;
        font-size: 11px;
        margin-top: 10px;
        min-height: 16px;
      }
    `;
    document.head.appendChild(s);
  }

  function showWhatsNew() {
    injectStyles();
    const overlay = document.createElement('div');
    overlay.className = 'wn-overlay';
    overlay.innerHTML = `
      <div class="wn-box">
        <div class="wn-badge">New Update</div>
        <h2 class="wn-title">What's New</h2>
        <ul class="wn-list">
          <li>Full site redesign</li>
          <li>Custom right-click menu</li>
          <li>New movie player with custom controls</li>
          <li>Continue watching feature</li>
          <li>Show more / Show all buttons</li>
        </ul>
        <button class="wn-close">Got it</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.wn-close').addEventListener('click', () => {
      overlay.remove();
      localStorage.setItem(KEY_WHATSNEW, '1');
    });
  }

  function showDevOverlay() {
    injectStyles();
    const overlay = document.createElement('div');
    overlay.className = 'dev-overlay';
    overlay.innerHTML = `
      <div class="dev-box">
        <div class="dev-icon">🚧</div>
        <h2 class="dev-title">In Development</h2>
        <p class="dev-sub">This feature is currently in development.<br>Owner key required for use.</p>
        <button class="dev-btn">Enter Key</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.dev-btn').addEventListener('click', async () => {
      if (await kryptonUnlock()) {
        overlay.remove();
        sessionStorage.setItem('movies_unlocked', '1');
      }
    });
  }

  /* ===== Init ===== */
  if (location.pathname.endsWith('index.html') || location.pathname.endsWith('/') || location.pathname === '') {
    if (!localStorage.getItem(KEY_WHATSNEW)) {
      showWhatsNew();
    }
  }

  if (location.pathname.endsWith('movies.html')) {
    if (!sessionStorage.getItem('movies_unlocked') && !kryptonIsOwner()) {
      showDevOverlay();
    }
  }
})();
