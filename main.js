/* ============================================================
   KUMOWEAVE ORGANICS — PREMIUM INTERACTION SYSTEM
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMobileMenu();
  initNav();
  initReveal();
  initCart();
  initModals();
  initAnchorScroll();
  initMagneticButtons();
});


/* --- Preloader --- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 600);
  });
}

/* --- Navigation & Scroll Header --- */
function initNav() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Scrolled class for blur/background
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Hide/Show on scroll
    if (currentScroll > lastScroll && currentScroll > 150) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScroll = currentScroll;
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('active');
      body.style.overflow = 'auto';
    });
  });
}

/* --- Magnetic Buttons --- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn, .cart-trigger, .nav-logo');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0, 0)`;
    });
  });
}

/* --- Enhanced Scroll Reveal --- */
function initReveal() {
  const options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.hasAttribute('data-reveal-once')) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, options);

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

/* --- Cart Logic --- */
function initCart() {
  let cart = JSON.parse(localStorage.getItem('kumoweave_cart')) || [];
  updateCartUI(cart);

  window.addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    showToast(`Added ${product.name} to cart!`);
  };
}

function saveCart(cart) {
  localStorage.setItem('kumoweave_cart', JSON.stringify(cart));
  updateCartUI(cart);
}

function updateCartUI(cart) {
  const count = document.getElementById('cart-count');
  const mobileCount = document.getElementById('mobile-cart-count');
  if (count) {
    const total = cart.reduce((acc, item) => acc + item.qty, 0);
    count.textContent = total;
    count.style.display = total > 0 ? 'flex' : 'none';
    if (mobileCount) mobileCount.textContent = total;
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
    background: var(--brand-primary); color: white; padding: 12px 30px;
    border-radius: 40px; font-size: 0.9rem; z-index: 3000; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    opacity: 0; animation: fadeSlideIn 0.4s forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeSlideOut 0.4s forwards';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Global styles for JS-injected elements
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeSlideIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
  @keyframes fadeSlideOut { from { opacity: 1; transform: translate(-50%, 0); } to { opacity: 0; transform: translate(-50%, -20px); } }
`;
document.head.append(style);

/* --- Modals --- */
function initModals() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.innerHTML = `
    <div class="coming-soon-modal">
      <button class="modal-close">✕</button>
      <div class="label-small">Status</div>
      <h2 style="font-size: 3rem; margin: 10px 0 24px;">Launching <br>Soon</h2>
      <p style="opacity: 0.8; font-size: 1.1rem;">Stay tuned — our website and products are on their way!</p>
      <div style="margin-top: 40px; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brand-secondary);">KUMOWEAVE ORGANICS</div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  const closeBtn = modalOverlay.querySelector('.modal-close');
  closeBtn.onclick = () => modalOverlay.classList.remove('active');
  modalOverlay.onclick = (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('active'); };

  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href') === '#coming-soon') {
      e.preventDefault();
      modalOverlay.classList.add('active');
    }
  });
}

/* --- Anchor Smoothing --- */
function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (anchor.getAttribute('href') === '#coming-soon') return;
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });
}

