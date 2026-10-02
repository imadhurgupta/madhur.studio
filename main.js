/* ─────────────────────────────────────────
   madhur.studio — main.js
───────────────────────────────────────── */
'use strict';

// ── Navbar scroll state ──────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Hamburger menu ───────────────────────
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    mobileMenu.setAttribute('aria-hidden', true);
  });
});

// ── Reveal on scroll (IntersectionObserver) ──
const revealItems = document.querySelectorAll('.reveal-item');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-item:not(.visible)'));
      siblings.forEach((sibling, idx) => {
        setTimeout(() => {
          sibling.classList.add('visible');
        }, idx * 100);
      });
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealItems.forEach(item => revealObserver.observe(item));

// ── Animated counters ────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObserver.observe(statsRow);

// ── Contact form ─────────────────────────
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success-msg');
const submitBtn = document.getElementById('form-submit-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  if (!name || !email || !message) {
    successMsg.style.color = '#e07070';
    successMsg.textContent = 'Please fill in all required fields.';
    return;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    successMsg.style.color = '#e07070';
    successMsg.textContent = 'Please enter a valid email address.';
    return;
  }

  // Simulate sending
  const btnText = submitBtn.querySelector('.btn-text');
  const btnIcon = submitBtn.querySelector('.btn-icon');
  btnText.textContent = 'Sending…';
  btnIcon.textContent = '⌛';
  submitBtn.disabled = true;

  setTimeout(() => {
    successMsg.style.color = '#c9a96e';
    successMsg.textContent = '✦ Thank you! We\'ll be in touch within 24 hours.';
    form.reset();
    btnText.textContent = 'Send Message';
    btnIcon.textContent = '→';
    submitBtn.disabled = false;

    setTimeout(() => { successMsg.textContent = ''; }, 6000);
  }, 1400);
});

// ── Footer year ──────────────────────────
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Smooth active nav highlight ──────────
const sections = document.querySelectorAll('section[id], div[id="contact"]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

// ── Cursor parallax for hero orbs ────────
const orbs = document.querySelectorAll('.orb');
document.addEventListener('mousemove', (e) => {
  const cx = e.clientX / window.innerWidth  - 0.5;
  const cy = e.clientY / window.innerHeight - 0.5;
  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 18;
    orb.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
  });
}, { passive: true });
