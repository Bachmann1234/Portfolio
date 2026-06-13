/* ============================================================
   Matt Bachmann — Portfolio  ·  shared behavior
   Theme/font/mode are fixed defaults on the <html> tag; this
   file only handles scroll-reveal animations.
   ============================================================ */
(function () {
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', reveals);
  } else { reveals(); }
})();
