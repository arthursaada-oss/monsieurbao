(function () {
  'use strict';

  var HEADER_OFFSET = 80;

  // --- Nav sticky : ajouter .scrolled après un certain scroll
  var header = document.getElementById('header');
  if (header) {
    function onScroll() {
      if (window.scrollY > HEADER_OFFSET) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Menu burger : toggle nav mobile
  var burger = document.querySelector('.header__burger');
  var nav = document.querySelector('.header__nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    // Fermer le menu au clic sur un lien (ancres)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });
  }

  // --- Smooth scroll pour les ancres (renforcement du scroll-behavior: smooth)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var id = anchor.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
