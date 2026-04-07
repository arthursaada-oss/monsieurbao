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

  // --- Couverture vidéo sur mobile : première frame si pas de poster
  document.querySelectorAll('.temoignages-video__player').forEach(function (video) {
    if (video.poster && video.poster.trim() !== '') return;

    function captureFirstFrame() {
      try {
        if (video.videoWidth === 0 || video.videoHeight === 0) return;
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        video.poster = canvas.toDataURL('image/jpeg', 0.85);
      } catch (e) {}
    }

    video.addEventListener('seeked', function onSeeked() {
      captureFirstFrame();
    }, { once: true });

    function ensureFirstFrameReady() {
      if (video.readyState >= 2) {
        if (video.currentTime === 0) {
          captureFirstFrame();
        } else {
          video.currentTime = 0;
        }
      }
    }

    video.addEventListener('loadeddata', ensureFirstFrameReady, { once: true });
    video.addEventListener('loadedmetadata', function () {
      video.currentTime = 0;
    }, { once: true });

    if (video.readyState >= 2) {
      ensureFirstFrameReady();
    } else if (video.readyState >= 1) {
      video.currentTime = 0;
    }
  });

  // --- Pagination des articles du blog (6 par page par défaut)
  var blogList = document.querySelector('.blog-list');
  var pagination = document.querySelector('.blog-pagination');
  if (blogList && pagination) {
    var cards = Array.prototype.slice.call(blogList.querySelectorAll('.blog-card'));
    var pageSize = parseInt(blogList.getAttribute('data-page-size') || '6', 10);
    if (!Number.isFinite(pageSize) || pageSize <= 0) pageSize = 6;

    var totalPages = Math.max(1, Math.ceil(cards.length / pageSize));
    var currentPage = 1;

    var prevBtn = pagination.querySelector('.blog-pagination__btn--prev');
    var nextBtn = pagination.querySelector('.blog-pagination__btn--next');
    var pagesWrap = pagination.querySelector('.blog-pagination__pages');

    function buildPageButtons() {
      pagesWrap.innerHTML = '';
      for (var page = 1; page <= totalPages; page += 1) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'blog-pagination__page';
        btn.textContent = String(page);
        btn.setAttribute('aria-label', 'Aller à la page ' + page);
        btn.setAttribute('data-page', String(page));
        pagesWrap.appendChild(btn);
      }
    }

    function getPageFromUrl() {
      try {
        var params = new URLSearchParams(window.location.search);
        var requested = parseInt(params.get('page') || '1', 10);
        if (!Number.isFinite(requested)) return 1;
        return requested;
      } catch (e) {
        return 1;
      }
    }

    function updateUrl(page) {
      try {
        var url = new URL(window.location.href);
        if (page <= 1) {
          url.searchParams.delete('page');
        } else {
          url.searchParams.set('page', String(page));
        }
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

    function renderPage(page, shouldUpdateUrl) {
      currentPage = Math.min(Math.max(1, page), totalPages);
      var start = (currentPage - 1) * pageSize;
      var end = start + pageSize;

      cards.forEach(function (card, index) {
        card.hidden = index < start || index >= end;
      });

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;

      pagesWrap.querySelectorAll('.blog-pagination__page').forEach(function (btn) {
        var btnPage = parseInt(btn.getAttribute('data-page') || '1', 10);
        if (btnPage === currentPage) {
          btn.setAttribute('aria-current', 'page');
        } else {
          btn.removeAttribute('aria-current');
        }
      });

      if (shouldUpdateUrl !== false) {
        updateUrl(currentPage);
      }
    }

    if (totalPages > 1) {
      pagination.hidden = false;
      buildPageButtons();
      renderPage(getPageFromUrl(), false);

      prevBtn.addEventListener('click', function () {
        renderPage(currentPage - 1);
      });
      nextBtn.addEventListener('click', function () {
        renderPage(currentPage + 1);
      });
      pagesWrap.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.classList.contains('blog-pagination__page')) return;
        var requestedPage = parseInt(target.getAttribute('data-page') || '1', 10);
        renderPage(requestedPage);
      });
    }
  }
})();
