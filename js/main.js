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

  /* ── Entrada escalonada en grillas ───────────────── */
  /* Las tarjetas de una misma grilla entran una detrás
     de otra en vez de todas juntas. */
  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      if (child.hasAttribute('data-reveal') && !child.hasAttribute('data-reveal-delay')) {
        child.style.setProperty('--reveal-delay', `${i * 90}ms`);
      }
    });
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

  /* ── Foco que sigue el cursor (tarjetas) ─────────── */
  /* Un halo lima muy sutil sigue al mouse dentro de la tarjeta.
     Solo en dispositivos con puntero fino y sin reduced-motion. */
  const spotlightCards = document.querySelectorAll('[data-spotlight]');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (spotlightCards.length && canHover && !reduceMotion) {
    spotlightCards.forEach((card) => {
      let x = 0;
      let y = 0;
      let queued = false;

      const paint = () => {
        queued = false;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${x - rect.left}px`);
        card.style.setProperty('--my', `${y - rect.top}px`);
      };

      card.addEventListener(
        'pointermove',
        (e) => {
          x = e.clientX;
          y = e.clientY;
          if (!queued) {
            queued = true;
            requestAnimationFrame(paint);
          }
        },
        { passive: true }
      );
    });
  }

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
  /* Tres modos, en este orden:
     1. contact.php — hosting con PHP (Hostinger). No usa terceros.
     2. Web3Forms — relay para hosting estático (GitHub Pages), donde el PHP
        no corre. Usa una sola "access key" fija: a diferencia de FormSubmit,
        no hay activación por formulario ni mails de confirmación.
     3. mailto: — último recurso: abrimos el cliente de correo del
        visitante con el mensaje precargado.
     Nunca mostramos "mensaje enviado" si no se envió nada. */
  const form = document.getElementById('contactForm');
  if (form) {
    const submitBtn = form.querySelector('.btn--primary');
    const note = form.querySelector('.form__note');
    const startedInput = form.querySelector('[name="started"]');
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    const originalNote = note ? note.textContent : '';
    const CONTACT_EMAIL = 'studio74dev@gmail.com';
    /* Relay de Web3Forms para el hosting estático.
       La access key se pide gratis en https://web3forms.com con el mail del
       estudio: llega un mail con la clave y se pega acá. Es fija y no vence. */
    const WEB3FORMS_KEY = 'dcea2867-da4a-4854-b353-7538e8f4c5da';
    const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
    const CHECK_SVG = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <polyline points="20 6 9 17 4 12" />
        </svg>`;

    let stateTimer = null;

    const refreshStarted = () => {
      if (startedInput) startedInput.value = String(Math.floor(Date.now() / 1000));
    };

    /* state: 'is-loading' | 'is-sent' | 'is-error' | null */
    const setState = (state, opts = {}) => {
      const { btn = null, note: noteText = null, ms = 4200, reset = false } = opts;
      clearTimeout(stateTimer);
      form.classList.remove('is-loading', 'is-sent', 'is-error');
      if (state) form.classList.add(state);
      if (submitBtn) {
        submitBtn.disabled = state === 'is-loading';
        if (btn) submitBtn.innerHTML = btn;
      }
      if (note && noteText) note.textContent = noteText;
      if (state === 'is-loading') return;

      stateTimer = setTimeout(() => {
        form.classList.remove('is-sent', 'is-error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
        if (note) note.textContent = originalNote;
        if (reset) {
          form.reset();
          refreshStarted();
        }
      }, ms);
    };

    refreshStarted();

    const openMailto = (data) => {
      const subject = `Consulta desde la web — ${data.get('service') || 'Proyecto'}`;
      const body = [
        `Nombre: ${data.get('name') || ''}`,
        `Email: ${data.get('email') || ''}`,
        `Tipo de proyecto: ${data.get('service') || ''}`,
        '',
        data.get('message') || '',
      ].join('\n');
      const a = document.createElement('a');
      a.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    };

    /* 1) contact.php — hosting con PHP. Devuelve 'sent' | 'limit' | 'fail' */
    const sendViaPhp = async (data) => {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10000);
        const res = await fetch('contact.php', {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
          signal: ctrl.signal,
        });
        clearTimeout(timeout);

        if (res.status === 429) {
          const info = await res.json().catch(() => null);
          return {
            state: 'limit',
            message: (info && info.message) || 'Demasiados envíos, probá de nuevo en unos minutos',
          };
        }

        const info = await res.json().catch(() => null);
        return res.ok && info && info.ok ? { state: 'sent' } : { state: 'fail' };
      } catch (_) {
        // Sin PHP (GitHub Pages) o sin red: seguimos con el relay.
        return { state: 'fail' };
      }
    };

    /* 2) Web3Forms — relay para hosting estático, donde el PHP no corre.
        Sin key todavía: devuelve false y seguimos con el mailto. */
    const sendViaRelay = async (data) => {
      if (!WEB3FORMS_KEY) return false;
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 15000);
        const res = await fetch(WEB3FORMS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Consulta desde la web — ${data.get('service') || 'Proyecto'}`,
            from_name: 'Studio 74 · Web',
            name: data.get('name') || '',
            email: data.get('email') || '',
            replyto: data.get('email') || '',
            'Tipo de proyecto': data.get('service') || '',
            message: data.get('message') || '',
          }),
        });
        clearTimeout(timeout);
        const info = await res.json().catch(() => null);
        // Web3Forms contesta { "success": true } solo si aceptó el envío.
        return res.ok && !!info && info.success === true;
      } catch (_) {
        return false;
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;
      if (form.classList.contains('is-loading') || form.classList.contains('is-sent')) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot lleno → bot: éxito falso, sin abrir nada.
      const hp = form.querySelector('[name="company"]');
      if (hp && hp.value.trim() !== '') {
        setState('is-sent', { btn: `${CHECK_SVG} ¡Mensaje enviado!`, reset: true });
        return;
      }

      const data = new FormData(form);
      setState('is-loading', { btn: 'Enviando…' });

      const sent = () => setState('is-sent', { btn: `${CHECK_SVG} ¡Mensaje enviado!`, reset: true });

      // 1) Hosting con PHP (Hostinger): envío propio, sin terceros.
      const php = await sendViaPhp(data);
      if (php.state === 'sent') return sent();
      if (php.state === 'limit') {
        setState('is-error', {
          btn: 'No se pudo enviar',
          note: php.message,
          ms: 6000,
        });
        return;
      }

      // 2) Hosting estático (GitHub Pages): relay por Web3Forms.
      if (await sendViaRelay(data)) return sent();

      // 3) Último recurso: abrimos el correo del visitante.
      openMailto(data);
      setState('is-sent', {
        btn: 'Se abrió tu correo',
        note: 'El mensaje está listo en tu app de correo: solo tenés que darle a enviar.',
        ms: 6000,
      });
    });
  }
})();