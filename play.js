document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameFile = urlParams.get('game');
  const movieFile = urlParams.get('movie');
  const file = gameFile || movieFile;

  if (!file) {
    window.location.href = movieFile !== null ? 'movies.html' : 'game.html';
    return;
  }

  const isMovie = !!movieFile;
  const isVideo = isMovie && /\.(mp4|mov|webm|mkv)$/i.test(file);
  const folder = isMovie ? 'Movies' : 'Games';
  const backPage = isMovie ? 'movies.html' : 'game.html';

  const title = decodeURIComponent(file.split('/').pop().replace(/\.[^/.]+$/, '')).replace(/[-_]+/g, ' ');

  document.getElementById('game-title').textContent = title;
  document.title = `${title} | Krypton`;

  const iframe = document.getElementById('game-iframe');
  const loadingScreen = document.getElementById('loading-screen');
  const iframeContainer = document.getElementById('iframe-container');

  const STORAGE_KEY = 'krypton_continue_' + file;

  function saveProgress(currentTime, duration) {
    if (!duration || !isFinite(duration)) return;
    const pct = currentTime / duration;
    if (pct > 0.95) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          time: currentTime,
          duration: duration,
          title: title,
          file: file,
          saved: Date.now()
        }));
      } catch {}
    }
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  const SVG_PLAY = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const SVG_PAUSE = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>';
  const SVG_VOL = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
  const SVG_MUTE = '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  const SVG_FS = '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
  const SVG_REWIND = '<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>';

  function fmt(s) {
    if (isNaN(s)) return '0:00:00';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h + ':' + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  if (isVideo) {
    iframe.style.display = 'none';

    const player = document.createElement('div');
    player.className = 'video-player';

    const vid = document.createElement('video');
    vid.src = `${folder}/${encodeURIComponent(file)}`;
    vid.playsInline = true;

    const bigPlay = document.createElement('div');
    bigPlay.className = 'vc-big-play';
    bigPlay.innerHTML = SVG_PLAY;

    const controls = document.createElement('div');
    controls.className = 'video-controls show';

    controls.innerHTML = `
      <div class="vc-seek">
        <input type="range" min="0" max="100" value="0" step="0.1">
        <span class="vc-time">0:00:00 / 0:00:00</span>
      </div>
      <div class="vc-row">
        <button class="vc-btn play-btn" title="Play">${SVG_PLAY}</button>
        <button class="vc-btn rewind-btn" title="Rewind 10s">${SVG_REWIND}</button>
        <div class="vc-volume">
          <button class="vc-btn vol-btn" title="Mute">${SVG_VOL}</button>
          <input type="range" min="0" max="1" value="1" step="0.05">
        </div>
        <div class="vc-spacer"></div>
        <button class="vc-btn fs-btn" title="Fullscreen">${SVG_FS}</button>
      </div>`;

    player.appendChild(vid);
    player.appendChild(bigPlay);
    player.appendChild(controls);
    iframeContainer.appendChild(player);

    const playBtn = controls.querySelector('.play-btn');
    const rewindBtn = controls.querySelector('.rewind-btn');
    const seekInput = controls.querySelector('.vc-seek input');
    const timeLabel = controls.querySelector('.vc-time');
    const volBtn = controls.querySelector('.vol-btn');
    const volInput = controls.querySelector('.vc-volume input');
    const fsBtn = controls.querySelector('.fs-btn');

    // Resume prompt
    const saved = loadProgress();
    let resumed = false;
    if (saved && saved.time > 5) {
      const resumeOverlay = document.createElement('div');
      resumeOverlay.className = 'resume-overlay';
      resumeOverlay.innerHTML = `
        <div class="resume-box">
          <p class="resume-title">Continue watching?</p>
          <p class="resume-sub">You were at ${fmt(saved.time)}</p>
          <div class="resume-btns">
            <button class="glow-button resume-yes">Resume <span>▶</span></button>
            <button class="outline-button resume-no">Start over</button>
          </div>
        </div>`;
      player.appendChild(resumeOverlay);

      resumeOverlay.querySelector('.resume-yes').addEventListener('click', () => {
        vid.currentTime = saved.time;
        vid.play();
        resumeOverlay.remove();
        resumed = true;
      });
      resumeOverlay.querySelector('.resume-no').addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        vid.play();
        resumeOverlay.remove();
        resumed = true;
      });
    } else {
      vid.autoplay = true;
      vid.play().catch(() => {});
    }

    function togglePlay() {
      if (vid.paused) { vid.play(); } else { vid.pause(); }
    }

    vid.addEventListener('error', () => {
      const msg = document.createElement('div');
      msg.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#ff6b6b;font-size:14px;background:#010a02;z-index:20;text-align:center;padding:40px;gap:12px;';
      msg.innerHTML = '<p style="font-size:18px;color:#ff6b6b;">Failed to load video</p><p style="color:#3a6a3e;">The file may use HEVC (H.265) which your browser cannot play.</p><p style="color:#3a6a3e;">Run <code style="background:rgba(53,255,53,.08);padding:2px 6px;border-radius:4px;color:#a5ff82;">convert-video.bat</code> to fix it.</p>';
      player.appendChild(msg);
    });

    vid.addEventListener('click', togglePlay);
    bigPlay.addEventListener('click', togglePlay);

    vid.addEventListener('play', () => {
      playBtn.innerHTML = SVG_PAUSE;
      bigPlay.classList.add('hidden');
    });
    vid.addEventListener('pause', () => {
      playBtn.innerHTML = SVG_PLAY;
      bigPlay.classList.remove('hidden');
      saveProgress(vid.currentTime, vid.duration);
    });
    playBtn.addEventListener('click', togglePlay);

    rewindBtn.addEventListener('click', () => {
      vid.currentTime = Math.max(0, vid.currentTime - 10);
    });

    vid.addEventListener('timeupdate', () => {
      if (!seekInput.matches(':active')) {
        const pct = vid.duration ? (vid.currentTime / vid.duration) * 100 : 0;
        seekInput.value = pct;
        seekInput.style.setProperty('--progress', pct + '%');
      }
      timeLabel.textContent = fmt(vid.currentTime) + ' / ' + fmt(vid.duration);
    });

    // Save every 5 seconds
    let saveInterval = setInterval(() => {
      if (!vid.paused) saveProgress(vid.currentTime, vid.duration);
    }, 5000);

    seekInput.addEventListener('input', () => {
      if (vid.duration) {
        vid.currentTime = (seekInput.value / 100) * vid.duration;
        seekInput.style.setProperty('--progress', seekInput.value + '%');
      }
    });

    let prevVol = 1;
    volBtn.addEventListener('click', () => {
      if (vid.muted || vid.volume === 0) {
        vid.muted = false;
        vid.volume = prevVol || 0.5;
        volBtn.innerHTML = SVG_VOL;
      } else {
        prevVol = vid.volume;
        vid.muted = true;
        volBtn.innerHTML = SVG_MUTE;
      }
      volInput.value = vid.muted ? 0 : vid.volume;
    });

    volInput.addEventListener('input', () => {
      vid.volume = parseFloat(volInput.value);
      vid.muted = vid.volume === 0;
      volBtn.innerHTML = vid.muted || vid.volume === 0 ? SVG_MUTE : SVG_VOL;
    });

    fsBtn.addEventListener('click', () => {
      if (iframeContainer.requestFullscreen) iframeContainer.requestFullscreen();
      else if (iframeContainer.webkitRequestFullscreen) iframeContainer.webkitRequestFullscreen();
      else if (iframeContainer.msRequestFullscreen) iframeContainer.msRequestFullscreen();
    });

    let hideTimer;
    function showControls() {
      controls.classList.add('show');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!vid.paused) controls.classList.remove('show');
      }, 3000);
    }
    player.addEventListener('mousemove', showControls);
    player.addEventListener('click', showControls);

    vid.addEventListener('ended', () => {
      localStorage.removeItem(STORAGE_KEY);
      bigPlay.classList.remove('hidden');
      controls.classList.add('show');
      playBtn.innerHTML = SVG_PLAY;
    });

    window.addEventListener('beforeunload', () => {
      saveProgress(vid.currentTime, vid.duration);
      clearInterval(saveInterval);
    });

    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 600);
    }, 2000);

  } else {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        iframe.src = `${folder}/${encodeURIComponent(file)}`;
      }, 600);
    }, 3000);
  }

  const fullscreenBtn = document.getElementById('fullscreen-btn');
  fullscreenBtn.addEventListener('click', () => {
    if (iframeContainer.requestFullscreen) iframeContainer.requestFullscreen();
    else if (iframeContainer.webkitRequestFullscreen) iframeContainer.webkitRequestFullscreen();
    else if (iframeContainer.msRequestFullscreen) iframeContainer.msRequestFullscreen();
  });

  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.href = backPage;
    if (isMovie) backBtn.innerHTML = 'Back to Movies <span>↺</span>';
  }
});
