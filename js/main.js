(function () {
  'use strict';

  // Google Analytics 4 — chargé uniquement après consentement explicite.
  var GA_MEASUREMENT_ID = 'G-1SXFZ5X4PM';
  var GA_CONSENT_KEY = 'monsieurbao-analytics-consent';

  function loadGoogleAnalytics() {
    if (window.__monsieurBaoGaLoaded || !GA_MEASUREMENT_ID) return;
    window.__monsieurBaoGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  function initAnalytics() {
    var choice = null;
    try { choice = window.localStorage.getItem(GA_CONSENT_KEY); } catch (error) { /* stockage indisponible */ }

    if (choice === 'accepted') {
      loadGoogleAnalytics();
      return;
    }
    if (choice === 'declined') return;

    var banner = document.createElement('aside');
    banner.className = 'analytics-consent';
    banner.setAttribute('aria-label', 'Préférences de mesure d’audience');
    banner.innerHTML = '<div class="analytics-consent__copy"><strong>Votre expérience compte</strong><p>Nous utilisons une mesure d’audience anonyme pour améliorer le site. Vous pouvez accepter ou refuser.</p></div><div class="analytics-consent__actions"><button type="button" class="analytics-consent__button analytics-consent__button--secondary" data-analytics-choice="declined">Refuser</button><button type="button" class="analytics-consent__button" data-analytics-choice="accepted">Accepter</button></div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-analytics-choice]');
      if (!button) return;
      var value = button.getAttribute('data-analytics-choice');
      try { window.localStorage.setItem(GA_CONSENT_KEY, value); } catch (error) { /* choix valable pour la session */ }
      if (value === 'accepted') loadGoogleAnalytics();
      banner.remove();
    });
  }

  function initAnalyticsEvents() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link || typeof window.gtag !== 'function') return;
      var href = link.getAttribute('href') || '';
      var eventName = '';
      if (href.indexOf('#trouver') !== -1) eventName = 'click_find_store';
      else if (href.indexOf('#recettes') !== -1) eventName = 'click_recipes';
      else if (href.indexOf('mailto:') === 0 || href.indexOf('#contact') !== -1) eventName = 'click_contact';
      if (eventName) window.gtag('event', eventName, { link_text: (link.textContent || '').trim().slice(0, 80) });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAnalytics(); initAnalyticsEvents(); });
  } else {
    initAnalytics();
    initAnalyticsEvents();
  }

  var HEADER_OFFSET = 80;

  function initCountdown() {
    var countdownEl = document.getElementById('countdown');
    var bandeauCountdown = document.getElementById('countdown-bandeau');
    if (!countdownEl || !bandeauCountdown) return;

    var endAttr = bandeauCountdown.getAttribute('data-countdown-end');
    var COUNTDOWN_END = endAttr ? new Date(endAttr) : new Date(2026, 6, 1, 0, 0, 0, 0);
    if (isNaN(COUNTDOWN_END.getTime())) {
      COUNTDOWN_END = new Date(2026, 6, 1, 0, 0, 0, 0);
    }

    var valueEls = {
      days: countdownEl.querySelector('[data-countdown="days"]'),
      hours: countdownEl.querySelector('[data-countdown="hours"]'),
      minutes: countdownEl.querySelector('[data-countdown="minutes"]'),
      seconds: countdownEl.querySelector('[data-countdown="seconds"]')
    };

    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }

    function pulse(el) {
      if (!el) return;
      el.classList.remove('countdown__value--pulse');
      void el.offsetWidth;
      el.classList.add('countdown__value--pulse');
    }

    var prevSeconds = -1;

    function tick() {
      var diff = COUNTDOWN_END.getTime() - Date.now();

      if (diff <= 0) {
        bandeauCountdown.classList.add('bandeau--launched');
        countdownEl.setAttribute('aria-hidden', 'true');
        return false;
      }

      var totalSec = Math.floor(diff / 1000);
      var days = Math.floor(totalSec / 86400);
      var hours = Math.floor((totalSec % 86400) / 3600);
      var minutes = Math.floor((totalSec % 3600) / 60);
      var seconds = totalSec % 60;

      if (valueEls.days) valueEls.days.textContent = String(days);
      if (valueEls.hours) valueEls.hours.textContent = pad(hours);
      if (valueEls.minutes) valueEls.minutes.textContent = pad(minutes);
      if (valueEls.seconds) {
        valueEls.seconds.textContent = pad(seconds);
        if (seconds !== prevSeconds) {
          pulse(valueEls.seconds);
          prevSeconds = seconds;
        }
      }
      return true;
    }

    tick();
    var interval = setInterval(function () {
      if (!tick()) clearInterval(interval);
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
  } else {
    initCountdown();
  }

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
})();
