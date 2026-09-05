// ======================================================================
//   KRYPTON — Live User Count Widget
//   Simulates a fluctuating live user count (50–150)
// ======================================================================

(function () {
  const MIN = 50;
  const MAX = 150;
  const BASE = 0;
  let current = BASE;

  function pickTarget() {
    const drift = Math.floor(Math.random() * 21) - 10;
    return Math.max(MIN, Math.min(MAX, current + drift));
  }

  function animateCount(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      el.textContent = Math.round(from + (to - from) * ease);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function scheduleNext(el) {
    const interval = 2000 + Math.random() * 4000;
    setTimeout(function () {
      const target = pickTarget();
      animateCount(el, current, target, 800 + Math.random() * 600);
      current = target;
      scheduleNext(el);
    }, interval);
  }

  function injectStyles() {
    if (document.getElementById('user-count-styles')) return;
    var s = document.createElement('style');
    s.id = 'user-count-styles';
    s.textContent = `
      .live-user-count {
        align-items: center;
        background: rgba(6, 20, 8, .7);
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        color: #5c9060;
        display: flex;
        font: 400 10px var(--mono);
        gap: 6px;
        height: 32px;
        letter-spacing: .04em;
        padding: 0 14px;
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 60;
        text-transform: uppercase;
        box-shadow: 0 4px 24px rgba(0, 0, 0, .4);
        animation: fade-up .6s ease-out;
      }
      .live-user-count .uc-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 8px var(--green);
        animation: pulse-glow 2s ease-in-out infinite;
        flex-shrink: 0;
      }
      .live-user-count .uc-num {
        color: var(--green);
        font-weight: 500;
        text-shadow: 0 0 8px var(--glow);
        font-variant-numeric: tabular-nums;
        min-width: 24px;
        text-align: right;
      }
      @media (max-width: 600px) {
        .live-user-count {
          bottom: 14px;
          right: 14px;
          font-size: 9px;
          height: 28px;
          padding: 0 10px;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function init() {
    injectStyles();
    var badge = document.createElement('div');
    badge.className = 'live-user-count';
    badge.innerHTML =
      '<span class="uc-dot"></span>' +
      '<span class="uc-num">' + current + '</span> users online';
    document.body.appendChild(badge);
    scheduleNext(badge.querySelector('.uc-num'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
