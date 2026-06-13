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
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () {
          track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
        });
      });
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { wire(); reveals(); galleries(); });
  } else { wire(); reveals(); galleries(); }
})();
