// ---------- GALLERY: DOMINO CROSSFADE ----------

const PERIOD  = 5500; // how often each tile changes
const STAGGER = 1000; // delay between one tile and the next
const FADE_MS = 900;  // must match the opacity transition

// Order the dominoes fall
const ORDER = [0, 1, 2, 3, 4, 5];

// EXTRA photos for each tile
const MORE_PHOTOS = [
  // 0: Wedding
  [
    'images/gallery/weddings/wedding2.jpg',
    'images/gallery/weddings/wedding3.jpg'
  ],
  // 1: Photo Booth
  [
    'images/gallery/photobooth/photobooth2.jpg',
    'images/gallery/photobooth/photobooth5.jpg'
  ],
  // 2: Bar & Bat Mitzvahs
  [
    'images/gallery/mitzvah/party5.jpg'
  ],
  // 3: Corporate
  [
    'images/gallery/corporate/corporate2.png'
  ],
  // 4: School Event
  [
    'images/gallery/school/party2.jpg'
  ],
  // 5: Party
  [
   'images/gallery/party/party7.jpg'
  ],
];

const tiles = [...document.querySelectorAll('.gallery-tile--image')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (tiles.length && !reduceMotion) {

  const state = tiles.map((tile, i) => {
    const first = tile.querySelector('.gallery-image');
    return {
      tile,
      alt: first.alt,
      photos: [first.getAttribute('src'), ...(MORE_PHOTOS[i] ?? [])],
      index: 0,
      busy: false,
    };
  });

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function advance(s) {
    if (s.photos.length < 2 || s.busy || document.hidden) return;
    s.busy = true;

    for (let tries = 0; tries < s.photos.length; tries++) {
      const next = (s.index + 1 + tries) % s.photos.length;
      try {
        await loadImage(s.photos[next]);
      } catch {
        continue;
      }

      const old = s.tile.querySelector('.gallery-image:last-of-type');
      const incoming = document.createElement('img');
      incoming.className = 'gallery-image is-entering';
      incoming.alt = s.alt;
      incoming.decoding = 'async';
      incoming.src = s.photos[next];
      old.after(incoming);

      incoming.getBoundingClientRect();           // commit the starting (invisible) state
      incoming.classList.remove('is-entering');   // fade in over the old photo

      setTimeout(() => {
        s.tile.querySelectorAll('.gallery-image').forEach(img => {
          if (img !== incoming) img.remove();
        });
      }, FADE_MS + 50);

      s.index = next;
      break;
    }
    s.busy = false;
  }

  // start each tile in domino order, then keep each on its own repeating timer
  ORDER.forEach((tileNumber, position) => {
    const s = state[tileNumber];
    if (!s) return;
    setTimeout(() => {
      // first change after PERIOD, so the page opens on the original photos
      setInterval(() => advance(s), PERIOD);
    }, position * STAGGER);
  });
}