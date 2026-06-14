/* ============================================================
   Matt Bachmann — Portfolio  ·  shared behavior
   Scroll reveals, photo galleries, image lightbox
   ============================================================ */
(function () {
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
    if (!box || typeof box.showModal !== 'function') return; // needs <dialog>
    var bimg = box.querySelector('img');
    function open(src, alt) {
      bimg.setAttribute('src', src);
      bimg.alt = alt || '';
      box.showModal(); // native: focus trap + Escape + ::backdrop
    }
    document.querySelectorAll('.proj__media img, .build__media img').forEach(function (img) {
      // make each card image a keyboard-operable trigger
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      function trigger() { open(img.currentSrc || img.src, img.alt); }
      img.addEventListener('click', trigger);
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
      });
    });
    // close on a click outside the image (backdrop) or on the close button
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__close')) box.close();
    });
    // clear the src after close (Escape, button, or backdrop) to free memory
    box.addEventListener('close', function () { bimg.removeAttribute('src'); });
  }

  function init() { reveals(); galleries(); lightbox(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
