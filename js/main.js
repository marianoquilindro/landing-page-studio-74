/* ═══════════════════════════════════════════════════════
   STUDIO 74 — MAIN SCRIPT V2
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const header = document.querySelector('.header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');
  const navAnchors = document.querySelectorAll('.nav__link');

  /* ── Navbar scroll effect ────────────────────────── */
  const handleScrollNav = () => {
    const y = window.scrollY;
    if (y > 24) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNav, { passive: true });
  handleScrollNav();

  /* ── Mobile menu ─────────────────────────────────── */
  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    navBackdrop.classList.remove('is-visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navLinks.classList.add('is-open');
    hamburger.classList.add('is-active');
    navBackdrop.classList.add('is-visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  navBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  navAnchors.forEach((a) => a.addEventListener('click', closeMenu));

  /* ── Active nav link on scroll ──────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const linkMap = Array.from(navAnchors);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          linkMap.forEach((link) => {
            const href = link.getAttribute('href');
            const isActive = href === `#${id}`;
            link.classList.toggle('is-active', isActive);
          });
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: '-10% 0px -50% 0px',
    }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Reveal on scroll ───────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -80px 0px',
    }
  );

  revealEls.forEach((el) => {
    const delay = el.getAttribute('data-reveal-delay');
    if (delay) {
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    }
    revealObserver.observe(el);
  });

  /* ── Counters ───────────────────────────────────── */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter || '0', 10);
          const duration = 1600;
          const start = 0;
          const startTime = performance.now();

          const tick = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const val = Math.floor(start + eased * (target - start));
            el.textContent = val.toLocaleString('es-AR');
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target.toLocaleString('es-AR');
            }
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* ── Stack bars ─────────────────────────────────── */
  const bars = document.querySelectorAll('.stack-bar__fill');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || '0';
          requestAnimationFrame(() => {
            bar.style.width = `${width}%`;
          });
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((b) => barObserver.observe(b));

  /* ── Carousel ────────────────────────────────────── */
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel__slides');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const dots = carousel.querySelectorAll('.carousel__dot');
    let current = 0;
    let timer;

    const goTo = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    };

    const start = () => {
      stop();
      timer = setInterval(() => goTo(current + 1), 4500);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        stop();
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    goTo(0);
    start();
  }

  /* ── Contact form ───────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('.btn--primary');
    const originalHTML = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!submitBtn) return;

      form.classList.add('is-sent');
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        ¡Mensaje enviado!
      `;

      setTimeout(() => {
        form.classList.remove('is-sent');
        submitBtn.innerHTML = originalHTML;
        form.reset();
      }, 4200);
    });
  }
})();