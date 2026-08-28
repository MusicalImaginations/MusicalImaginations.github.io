/**
 * uiWiring.js
 * ----------------------------------------------------------------------
 * Small bits of pure-UI behavior that don't belong in the data/logic
 * modules: switching the inspector's tabbed panels, highlighting the
 * active left-nav link, and mirroring the current track into the
 * always-visible bottom player bar (which has its own compact art/title/
 * artist elements separate from the right-panel inspector).
 * ----------------------------------------------------------------------
 */

const UiWiring = (() => {
  function init() {
    bindInspectorTabs();
    bindLeftNav();
    bindPlayerBarMirror();
    bindPlayPauseIconSync();
  }

  // ---- Inspector tabs: Up next / Lyrics / Credits ----------------------
  function bindInspectorTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        tabButtons.forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.panel === targetTab);
        });
      });
    });
  }

  // ---- Left nav active state (Home / Library) ---------------------------
  function bindLeftNav() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.toggle('active', l === link));
        // Hook point: swap #home-feed content for a full library list view
        // when data-view="library" is selected. Left as a small, deliberate
        // gap since "Library" browsing/sorting wasn't part of the original
        // feature spec — the feed already renders from Library.getAllTracks().
      });
    });
  }

  // ---- Mirror now-playing info into the compact bottom bar ---------------
  function bindPlayerBarMirror() {
    document.addEventListener('mi:track-changed', (e) => {
      const track = e.detail.track;
      const titleEl = document.querySelector('.player-bar-title');
      const artistEl = document.querySelector('.player-bar-artist');
      const artEl = document.getElementById('player-bar-art');

      if (titleEl) titleEl.textContent = track.title;
      if (artistEl) artistEl.textContent = track.artist;
      if (artEl && track.coverUrl) artEl.style.backgroundImage = `url(${track.coverUrl})`;
    });
  }

  // ---- Keep the play/pause glyph in sync with actual audio state ---------
  // player.js toggles the 'is-playing' class; this just swaps the glyph
  // shown inside the button so ▶ / ⏸ always matches reality, including
  // when playback is paused/resumed via OS media keys.
  function bindPlayPauseIconSync() {
    const audio = document.getElementById('audio-element');
    const btn = document.getElementById('btn-play-pause');
    if (!audio || !btn) return;

    audio.addEventListener('play', () => { btn.textContent = '⏸'; });
    audio.addEventListener('pause', () => { btn.textContent = '▶'; });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => UiWiring.init());
