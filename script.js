/* ═══════════════════════════════════════════════
   TOURPILOT AI — Promotional Website Scripts
   CRO-optimized with conversion tracking
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ──
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
  // Fallback: hide loader after 3s no matter what
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ── NAV SCROLL ──
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE MENU ──
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // Close menu on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ── SMOOTH SCROLL for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── REVEAL ON SCROLL ──
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ── LIGHTBOX ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.benefits-img img, .hero-image img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  // ═══════════════════════════════════════
  // CRO: FORM SUBMIT TRACKING + UX
  // ═══════════════════════════════════════

  // Main contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = document.getElementById('submitBtn');
      const btnText = btn.querySelector('.btn-text');
      const btnLoading = btn.querySelector('.btn-loading');

      // Show loading state
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      // Track as GA4 conversion
      if (typeof trackFormSubmit === 'function') {
        trackFormSubmit('main_contact_form');
      }

      // Submit via fetch
      const formData = new FormData(contactForm);
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          // Success state
          contactForm.innerHTML = `
            <div style="text-align:center;padding:3rem 1rem;">
              <div style="font-size:3rem;margin-bottom:1rem;">✅</div>
              <h3 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#1a1a18;margin-bottom:.8rem;">Demo request received!</h3>
              <p style="color:#7a7a6e;font-size:.95rem;line-height:1.7;">I'll personally review your request and send you a tailored demo link within 4 hours.<br><br><strong style="color:#A87D42;">— Hassan Oubella, Founder</strong></p>
            </div>
          `;
        } else {
          btnText.style.display = 'inline';
          btnLoading.style.display = 'none';
          btn.disabled = false;
          btn.style.opacity = '1';
          alert('Something went wrong. Please try again or WhatsApp us directly.');
        }
      }).catch(() => {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btn.disabled = false;
        btn.style.opacity = '1';
        alert('Network error. Please try again or WhatsApp us directly.');
      });
    });
  }

  // Exit intent form
  const exitForm = document.getElementById('exitForm');
  if (exitForm) {
    exitForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (typeof trackFormSubmit === 'function') {
        trackFormSubmit('exit_intent_form');
      }

      const formData = new FormData(exitForm);
      fetch(exitForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          const popup = document.getElementById('exitPopup');
          popup.querySelector('.exit-popup-content').innerHTML = `
            <div style="padding:1.5rem;text-align:center;">
              <div style="font-size:2.5rem;margin-bottom:.8rem;">🎉</div>
              <h3 style="font-family:'Playfair Display',serif;font-size:1.4rem;color:#1a1a18;margin-bottom:.6rem;">You're in!</h3>
              <p style="color:#7a7a6e;font-size:.9rem;">Check your email within 4 hours for your personalized demo link.</p>
            </div>
          `;
          setTimeout(() => popup.classList.remove('active'), 4000);
        }
      });
    });
  }


  // ═══════════════════════════════════════
  // CRO: EXIT INTENT POPUP
  // ═══════════════════════════════════════

  const exitPopup = document.getElementById('exitPopup');
  const exitClose = document.getElementById('exitClose');
  let exitShown = false;

  // Desktop: mouse leaves viewport from top
  document.addEventListener('mouseout', (e) => {
    if (exitShown) return;
    if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) {
      // Only show after 15 seconds on site and if scrolled past hero
      if (performance.now() > 15000 && window.scrollY > 400) {
        exitPopup.classList.add('active');
        exitShown = true;
        sessionStorage.setItem('exitShown', 'true');
      }
    }
  });

  // Mobile: detect back button / scroll up quickly
  let lastScrollTop = 0;
  let rapidScrollCount = 0;
  window.addEventListener('scroll', () => {
    if (exitShown) return;
    const st = window.scrollY;
    if (st < lastScrollTop && lastScrollTop - st > 100) {
      rapidScrollCount++;
      if (rapidScrollCount >= 3 && performance.now() > 20000) {
        exitPopup.classList.add('active');
        exitShown = true;
      }
    } else {
      rapidScrollCount = 0;
    }
    lastScrollTop = st;
  }, { passive: true });

  // Don't show if already shown this session
  if (sessionStorage.getItem('exitShown') === 'true') {
    exitShown = true;
  }

  // Close popup
  if (exitClose) {
    exitClose.addEventListener('click', () => {
      exitPopup.classList.remove('active');
    });
  }
  if (exitPopup) {
    exitPopup.querySelector('.exit-popup-overlay').addEventListener('click', () => {
      exitPopup.classList.remove('active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && exitPopup && exitPopup.classList.contains('active')) {
      exitPopup.classList.remove('active');
    }
  });


  // ═══════════════════════════════════════
  // CRO: MOBILE STICKY CTA VISIBILITY
  // ═══════════════════════════════════════

  const mobileCta = document.getElementById('mobileCta');
  const contactSection = document.getElementById('contact');

  if (mobileCta && contactSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Hide sticky CTA when contact form is visible
        mobileCta.style.transform = entry.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
        mobileCta.style.transition = 'transform 0.3s ease';
      });
    }, { threshold: 0.1 });

    ctaObserver.observe(contactSection);
  }


  // ═══════════════════════════════════════
  // CRO: TRACK CTA CLICKS
  // ═══════════════════════════════════════

  document.querySelectorAll('.btn-primary, .nav-cta, .whatsapp-float, .whatsapp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        const label = btn.textContent.trim().substring(0, 40);
        gtag('event', 'cta_click', {
          event_category: 'engagement',
          event_label: label
        });
      }
    });
  });

});
