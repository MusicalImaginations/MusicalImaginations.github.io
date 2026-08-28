/**
 * app.js
 * ----------------------------------------------------------------------
 * Entry point. Drop this <script> in last, after library.js, fileSystem.js,
 * player.js, and inspector.js (or bundle them; load order matters since
 * each module is a plain IIFE global, not an ES module import graph).
 *
 * <script src="js/library.js"></script>
 * <script src="js/fileSystem.js"></script>
 * <script src="js/player.js"></script>
 * <script src="js/inspector.js"></script>
 * <script src="js/theme.js"></script>
 * <script src="js/uiWiring.js"></script>
 * <script src="js/app.js"></script>
 * ----------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  ThemeEngine.init();
  Library.init();
  FileSystem.init();
  Player.init();
  Inspector.init();

  registerServiceWorker();
});

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('sw.js');
    console.log('Musical Imaginations: offline shell cached.');
  } catch (err) {
    console.warn('Service worker registration failed:', err);
  }
}
