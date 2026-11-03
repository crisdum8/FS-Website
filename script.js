/* ========================================================================
   KTH FORMULA STUDENT · Mockup 6
   Scroll-triggered reveals + animated number counters + marquee pausing.
   ======================================================================== */

// ---------- Nav: shadow on scroll ----------
const nav = document.getElementById('anav');
const onScroll = () => {
  if (!nav) return;
  nav.classList.toggle('is-scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Nav: hamburger menu ----------
const navToggle = document.querySelector('.anav__toggle');
const navLinks = document.querySelector('.anav__links');
if (navToggle && nav) {
  const closeNav = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-nav-open');
  };
  const openNav = () => {
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-nav-open');
  };
  navToggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });
  navLinks && navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000 && nav.classList.contains('is-open')) closeNav();
  });
}

// ---------- Hero aurora (cursor-tracked gradient blobs) ----------
const ahero = document.getElementById('ahero');
if (ahero && !matchMedia('(hover: none)').matches) {
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, active = false;
  const onMove = (e) => {
    const rect = ahero.getBoundingClientRect();
    targetX = e.clientX - (rect.left + rect.width / 2);
    targetY = e.clientY - (rect.top + rect.height / 2);
    if (!active) { active = true; requestAnimationFrame(tick); }
  };
  const tick = () => {
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;
    ahero.style.setProperty('--mx', currentX.toFixed(1) + 'px');
    ahero.style.setProperty('--my', currentY.toFixed(1) + 'px');
    if (Math.abs(targetX - currentX) > 0.3 || Math.abs(targetY - currentY) > 0.3) {
      requestAnimationFrame(tick);
    } else {
      active = false;
    }
  };
  window.addEventListener('mousemove', onMove, { passive: true });

  const aheroObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        ahero.querySelectorAll('.ahero__blob').forEach((b) => {
          b.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
        });
      });
    },
    { threshold: 0 }
  );
  aheroObs.observe(ahero);
}

// ---------- Fade-in observer ----------
const fadeIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-shown');
      fadeIO.unobserve(e.target);
    });
  },
  { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-in').forEach((el) => fadeIO.observe(el));

// Also observe the vision title and signature so their nested
// highlight-bar / rule-draw animations fire independently.
document
  .querySelectorAll('.vision__title, .vision__sig')
  .forEach((el) => {
    const extraIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-shown');
          extraIO.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    extraIO.observe(el);
  });

// ---------- SVG stroke draw-in on scroll ----------
const drawObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      try {
        const len = el.getTotalLength ? el.getTotalLength() : 2000;
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len;
        void el.getBoundingClientRect();
        el.style.transition = `stroke-dashoffset 1.8s cubic-bezier(0.65,0,0.35,1) ${i * 0.08}s`;
        el.style.strokeDashoffset = 0;
      } catch (_) {
        el.classList.add('is-drawn');
      }
      drawObs.unobserve(el);
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll('.draw-in').forEach((el) => drawObs.observe(el));

// ---------- Animated number counters ----------
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const countObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      if (!Number.isFinite(target)) return;
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = Math.round(easeOut(p) * target).toString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('[data-count]').forEach((el) => countObs.observe(el));

// ---------- Team filter (Team page) ----------
const filterBtns = document.querySelectorAll('.afilter');
if (filterBtns.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const target = btn.dataset.filter;
      document.querySelectorAll('.adir').forEach((dir) => {
        if (target === 'all') {
          dir.style.display = '';
        } else {
          dir.style.display = dir.dataset.dept === target ? '' : 'none';
        }
      });
    });
  });
}

// ---------- Horizontal strip prev/next buttons ----------
document.querySelectorAll('.strip').forEach((strip) => {
  const scroller = strip.querySelector('.strip__scroller');
  if (!scroller) return;
  strip.querySelectorAll('.strip__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const first = scroller.querySelector('.strip__shot');
      if (!first) return;
      const step = first.getBoundingClientRect().width + 20;
      scroller.scrollBy({ left: btn.dataset.dir === 'next' ? step : -step, behavior: 'smooth' });
    });
  });
});

// ---------- FAQ accordion (About page) ----------
document.querySelectorAll('.afaq__q').forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.afaq__item');
    if (!item) return;
    const wasOpen = item.classList.contains('is-open');
    item.parentElement.querySelectorAll('.afaq__item').forEach((i) => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// ---------- YouTube lite embed (click thumbnail → load iframe) ----------
document.querySelectorAll('[data-video]').forEach((el) => {
  const activate = () => {
    if (el.classList.contains('is-playing')) return;
    const id = el.dataset.video;
    const start = parseInt(el.dataset.videoStart, 10);
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      playsinline: '1',
      modestbranding: '1',
    });
    if (Number.isFinite(start) && start > 0) params.set('start', String(start));
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params.toString()}`;
    iframe.title = 'KTH Formula Student documentary';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    el.appendChild(iframe);
    el.classList.add('is-playing');
  };
  el.addEventListener('click', activate);
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
  });
});

// ---------- Pause the partners marquee when offscreen ----------
const marObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
    });
  },
  { threshold: 0 }
);
document.querySelectorAll('.apart__track').forEach((el) => marObs.observe(el));

// ---------- Horizontal carousel (shared: team photos, Instagram feed) ----------
document.querySelectorAll('.acarousel').forEach((carousel) => {
  const viewport = carousel.querySelector('.acarousel__viewport');
  const track = carousel.querySelector('.acarousel__track');
  const slides = Array.from(carousel.querySelectorAll('.acarousel__slide'));
  const prevBtn = carousel.querySelector('.acarousel__btn--prev');
  const nextBtn = carousel.querySelector('.acarousel__btn--next');
  const curEl = carousel.querySelector('.acarousel__counter-cur');
  const totalEl = carousel.querySelector('.acarousel__counter-total');
  const progressBar = carousel.querySelector('.acarousel__progress-bar');
  if (!viewport || !track || !slides.length) return;

  if (totalEl) totalEl.textContent = String(slides.length).padStart(2, '0');

  const slideStep = () => {
    if (slides.length < 2) return viewport.clientWidth;
    return slides[1].offsetLeft - slides[0].offsetLeft; // slide width + gap
  };

  const maxScroll = () => viewport.scrollWidth - viewport.clientWidth;

  const update = () => {
    const step = slideStep() || 1;
    const idx = Math.round(viewport.scrollLeft / step);
    const clamped = Math.max(0, Math.min(slides.length - 1, idx));
    if (curEl) curEl.textContent = String(clamped + 1).padStart(2, '0');
    if (progressBar) {
      const pct = maxScroll() > 0 ? (viewport.scrollLeft / maxScroll()) * 100 : 100;
      progressBar.style.width = Math.max(5, Math.min(100, pct)) + '%';
    }
    if (prevBtn) prevBtn.toggleAttribute('disabled', viewport.scrollLeft <= 1);
    if (nextBtn) nextBtn.toggleAttribute('disabled', viewport.scrollLeft >= maxScroll() - 1);
  };

  const scrollBySlides = (dir) => {
    viewport.scrollBy({ left: dir * slideStep(), behavior: 'smooth' });
  };

  prevBtn && prevBtn.addEventListener('click', () => scrollBySlides(-1));
  nextBtn && nextBtn.addEventListener('click', () => scrollBySlides(1));

  let scrollRaf = 0;
  viewport.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      update();
    });
  });

  window.addEventListener('resize', () => requestAnimationFrame(update));

  update();
});

// ---------- Team page: scroll-spy for sticky team nav chips ----------
(() => {
  const teamNav = document.getElementById('ateamnav');
  if (!teamNav) return;

  const chips = Array.from(teamNav.querySelectorAll('.ateamnav__chip'));
  const sectionIds = chips.map((c) => c.getAttribute('href').slice(1));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const chipById = new Map();
  chips.forEach((c) => chipById.set(c.getAttribute('href').slice(1), c));

  const setActive = (id) => {
    chips.forEach((c) => c.classList.remove('is-active'));
    const target = chipById.get(id);
    if (target) {
      target.classList.add('is-active');
      // keep the active chip in view inside the horizontal scroller
      const navInner = teamNav.querySelector('.ateamnav__inner');
      if (navInner) {
        const rect = target.getBoundingClientRect();
        const parentRect = navInner.getBoundingClientRect();
        if (rect.left < parentRect.left || rect.right > parentRect.right) {
          navInner.scrollTo({
            left: target.offsetLeft - navInner.clientWidth / 2 + target.clientWidth / 2,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  // pick the section whose top is closest to just below the sticky nav
  const spyObs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      if (visible[0]) setActive(visible[0].id);
    },
    {
      rootMargin: '-150px 0px -55% 0px',
      threshold: 0,
    }
  );
  sections.forEach((s) => spyObs.observe(s));

  // smooth scroll on chip click (CSS scroll-margin-top handles offset)
  chips.forEach((c) => {
    c.addEventListener('click', (e) => {
      const id = c.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
      setActive(id);
    });
  });
})();
