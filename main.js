(function () {
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  var dd = document.querySelector('.dropdown');
  if (dd) {
    var btn = dd.querySelector('.dropdown-toggle');
    var menu = dd.querySelector('.dropdown-menu');
    var setOpen = function (open) {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', function () { setOpen(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setOpen(false); });
    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); }
    });
    dd.addEventListener('focusout', function (e) {
      if (!dd.contains(e.relatedTarget)) setOpen(false);
    });
  }

  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = Array.prototype.forEach;
  if (reduce || !('IntersectionObserver' in window)) {
    each.call(items, function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  each.call(items, function (el) { io.observe(el); });
  document.addEventListener('focusin', function (e) {
    var r = e.target.closest && e.target.closest('.reveal');
    if (r) { r.classList.add('is-in'); io.unobserve(r); }
  });
})();
