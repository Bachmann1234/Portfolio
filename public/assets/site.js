/* ============================================================
   Matt Bachmann — Portfolio  ·  shared behavior
   Theme + font persistence across pages, scroll reveals
   ============================================================ */
(function () {
  var THEMES = ['forest', 'teal', 'berner'];
  var FONTS  = ['journal', 'spectral'];
  var root = document.documentElement;

  function getStore(key, fallback, allowed) {
    var v;
    try { v = localStorage.getItem(key); } catch (e) { v = null; }
    return (v && allowed.indexOf(v) !== -1) ? v : fallback;
  }
  function setStore(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  var theme = getStore('pf-theme', 'forest', THEMES);
  var font  = getStore('pf-font', 'journal', FONTS);

  // mode: stored wins, else follow system, else light
  var storedMode = null;
  try { storedMode = localStorage.getItem('pf-mode'); } catch (e) {}
  var mode;
  if (storedMode === 'dark' || storedMode === 'light') {
    mode = storedMode;
  } else {
    mode = 'dark';   // default landing mode
  }

  root.setAttribute('data-theme', theme);
  root.setAttribute('data-font', font);
  root.setAttribute('data-mode', mode);

  function syncUI() {
    document.querySelectorAll('.swatch').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.theme === theme ? 'true' : 'false');
    });
    var fb = document.querySelector('.fontbtn');
    if (fb) fb.textContent = (font === 'journal') ? 'Aa · Newsreader' : 'Aa · Spectral';
    var mb = document.querySelector('.modebtn');
    if (mb) {
      mb.textContent = (mode === 'dark') ? '☀' : '☾';
      mb.setAttribute('aria-label', (mode === 'dark') ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function wire() {
    document.querySelectorAll('.swatch').forEach(function (b) {
      b.addEventListener('click', function () {
        theme = b.dataset.theme;
        root.setAttribute('data-theme', theme);
        setStore('pf-theme', theme);
        syncUI();
      });
    });
    var fb = document.querySelector('.fontbtn');
    if (fb) {
      fb.addEventListener('click', function () {
        font = (font === 'journal') ? 'spectral' : 'journal';
        root.setAttribute('data-font', font);
        setStore('pf-font', font);
        syncUI();
      });
    }
    var mb = document.querySelector('.modebtn');
    if (mb) {
      mb.addEventListener('click', function () {
        mode = (mode === 'dark') ? 'light' : 'dark';
        root.setAttribute('data-mode', mode);
        setStore('pf-mode', mode);
        syncUI();
      });
    }
    syncUI();
  }

  // scroll reveal
  function reveals() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  // multi-photo build galleries: progressive enhancement over CSS scroll-snap.
  // Dots become clickable and track the scroll position. Swipe/scroll works
  // even if this never runs.
  function galleries() {
    document.querySelectorAll('[data-gallery]').forEach(function (g) {
      var track = g.querySelector('.gallery__track');
      var dots = g.querySelectorAll('.gdot');
      if (!track || dots.length < 2) return;
      function goTo(i) {
        i = Math.max(0, Math.min(dots.length - 1, i));
        track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
      }
      function current() { return Math.round(track.scrollLeft / track.clientWidth); }
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); });
      });
      var prev = g.querySelector('.gallery__nav--prev');
      var next = g.querySelector('.gallery__nav--next');
      if (prev) prev.addEventListener('click', function () { goTo(current() - 1); });
      if (next) next.addEventListener('click', function () { goTo(current() + 1); });
      var raf;
      track.addEventListener('scroll', function () {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var i = Math.round(track.scrollLeft / track.clientWidth);
          dots.forEach(function (d, j) { d.classList.toggle('on', j === i); });
        });
      }, { passive: true });
    });
  }

  // click-to-expand: any card image opens a full, uncropped view in the lightbox
  function lightbox() {
    var box = document.getElementById('lightbox');
    if (!box) return;
    var bimg = box.querySelector('img');
    function open(src, alt) {
      bimg.setAttribute('src', src);
      bimg.alt = alt || '';
      box.hidden = false;
    }
    function close() { box.hidden = true; bimg.removeAttribute('src'); }
    document.querySelectorAll('.proj__media img, .build__media img').forEach(function (img) {
      img.addEventListener('click', function () { open(img.currentSrc || img.src, img.alt); });
    });
    box.addEventListener('click', close); // backdrop or close button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) close();
    });
  }

  function init() { wire(); reveals(); galleries(); lightbox(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
