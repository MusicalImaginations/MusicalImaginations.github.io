# Project structure

```
musical-imaginations/
├── index.html        3-column layout, all element IDs the JS expects
├── styles.css        theme engine (3 presets) + glassmorphism + responsive grid
├── manifest.json     PWA manifest
├── sw.js             offline app-shell cache
├── icons/icon.svg    placeholder app icon — swap for your own art
└── js/
    ├── library.js     data model, home feed, playlists
    ├── fileSystem.js  folder picker + scanning + ID3 parsing
    ├── player.js      audio engine (play/pause/shuffle/loop/volume/progress)
    ├── inspector.js   now-playing panel + .lrc/.txt sidecar loading
    ├── theme.js       cycles the three theme presets, persists choice
    ├── uiWiring.js    tabs, nav highlighting, bottom-bar mirroring
    └── app.js         boots everything in the right order
```

Everything is already wired together — open `index.html` directly in a
browser (or via a local dev server; Chrome/Edge require a real server
or `file://` won't allow the File System Access API in some setups) and
it should run as-is. The three panels, the bottom player bar, and the
theme toggle in the left sidebar are all functional.

## Customizing in VS Code

- **Colors/fonts**: everything is CSS custom properties at the top of
  `styles.css`, split into three `[data-theme="..."]` blocks. Edit
  those, or duplicate a block and add its name to the `THEMES` array
  in `js/theme.js` to add a fourth preset.
- **Layout**: the grid is defined once, in `.app-shell` in `styles.css`
  (`grid-template-columns` / `grid-template-areas`). Resizing or
  reordering the three columns only touches that one rule.
- **Copy/icons**: text and emoji-as-icons live directly in `index.html`
  — swap the emoji buttons for an icon font or SVGs whenever you like,
  the JS only cares about the element `id`s, not their contents.
- The JS files don't need to change for visual tweaks — they query by
  `id` and class name, so you can restyle freely without breaking
  playback logic.

## Known limitations, called out honestly

- **Cover art**: the ID3 reader only parses text frames (TIT2/TPE1/TALB).
  I didn't wire up the `APIC` (embedded image) frame — it's a binary
  frame with an extra MIME-type/picture-type header to parse, which is
  reasonable to add but was out of scope for this pass. Right now
  `now-playing-art` falls back to whatever placeholder your CSS shows.
- **Sidecar `.lrc`/`.txt` lookup** only works when the browser supports
  the File System Access API (Chrome/Edge). Under the `webkitdirectory`
  fallback (Firefox, Safari) there's no directory handle to query a
  sibling file from, so `fileSystem.js`'s `ingestFiles()` would need to
  additionally retain non-audio files during the scan and match them by
  basename — I left a note in `inspector.js` marking exactly where that
  goes in.
- **FLAC/OGG/M4A metadata**: only duration is read for these (via the
  `<audio>` element); title/artist/album fall back to the filename,
  since embedded tag formats differ per container and weren't in scope
  for a from-scratch parser here.
- **Service worker** caches the app shell only, not music files —
  intentional, since those live outside the origin and are re-scanned
  from disk each session.

None of this is hidden in the code — same caveats are in comments at
the relevant spot in each file.
