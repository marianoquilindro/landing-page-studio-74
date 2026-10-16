/* ═══════════════════════════════════════════════════════
   STUDIO 74 — MAIN SCRIPT
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Navbar scroll ───────────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── Mobile hamburger ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* ── Reveal on scroll (IntersectionObserver) ─────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Stack bars animation ────────────────────────── */
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || 0;
          // Small delay for stagger effect
          setTimeout(() => { bar.style.width = width + '%'; }, 100);
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll('.stack-bar').forEach(bar => barObserver.observe(bar));

  /* ── Screenshot carousel ─────────────────────────── */
  const track     = document.querySelector('.screenshot-carousel__track');
  const slides    = document.querySelectorAll('.screenshot-carousel__slide');
  const dots      = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoTimer;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  if (track && slides.length > 0) {
    // Init first slide
    slides[0].classList.add('active');
    dots[0].classList.add('active');

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        stopAuto();
        startAuto();
      });
    });

    // Pause on hover
    const carousel = document.querySelector('.screenshot-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }

    startAuto();
  }

  /* ── Contact form ────────────────────────────────── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.btn-primary');
      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        ¡Mensaje enviado!`;
      submitBtn.classList.add('success');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.classList.remove('success');
        submitBtn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  /* ── Active nav link on scroll ───────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__link:not(.nav__cta)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            const isActive = a.getAttribute('href') === `#${id}`;
            a.style.color = isActive ? 'var(--cream)' : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

})();
