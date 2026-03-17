/* ===== LUMIÈRE CANDLE CO. — MAIN SCRIPT ===== */

// ===== CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
if (cursor && cursorFollower) {
  let fx = 0, fy = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });
  function animateCursor() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    cursorFollower.style.left = fx + 'px';
    cursorFollower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); cursorFollower.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); cursorFollower.classList.remove('hovering'); });
  });
}

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1200);
});

// ===== NAVBAR =====
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== HAMBURGER =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks && navLinks.classList.toggle('open');
    const s = hamburger.querySelectorAll('span');
    hamburger.classList.toggle('open');
  });
}

// ===== ACTIVE NAV =====
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ===== DARK MODE =====
const darkToggle = document.querySelector('.dark-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
if (darkToggle) {
  darkToggle.textContent = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
  darkToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    darkToggle.textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
  });
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem('lumiere_cart') || '[]');

function saveCart() {
  localStorage.setItem('lumiere_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = cart.reduce((s, i) => s + i.qty, 0));
  renderCartItems();
}

function addToCart(product, btn) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) { existing.qty++; } else { cart.push({ ...product, qty: 1 }); }
  saveCart();
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 1800);
    createRipple(btn);
  }
  showToast(`${product.name} added to cart 🕯️`);
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else saveCart();
  }
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><div class="cart-icon">🕯️</div><p>Your cart is empty</p><a href="shop.html" class="btn-primary" style="display:inline-block;text-decoration:none">Explore Candles</a></div>`;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img"><div style="width:100%;height:100%;background:linear-gradient(135deg,${item.color||'#f5cac3'},#f7ede2);display:flex;align-items:center;justify-content:center;font-size:2rem">${item.emoji||'🕯️'}</div></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price}</div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Remove">✕</button>
      </div>
    `).join('');
  }
  const total = cart.reduce((s, i) => s + (parseInt(i.price) * i.qty), 0);
  const el = document.getElementById('cart-total');
  if (el) el.textContent = `₹${total.toLocaleString('en-IN')}`;
}

function openCart() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-sidebar')?.classList.add('open');
}
function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-sidebar')?.classList.remove('open');
}

document.querySelector('.cart-btn')?.addEventListener('click', openCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);

updateCartUI();

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== RIPPLE =====
function createRipple(btn) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
  ripple.style.left = '0px'; ripple.style.top = '0px';
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}
document.querySelectorAll('.btn-primary, .add-cart, .checkout-btn').forEach(btn => {
  btn.addEventListener('click', () => createRipple(btn));
});

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== QUICK VIEW MODAL =====
const products = [
  { id: 'p1', name: 'Floral Clay Candle', category: 'Floral', price: '899', emoji: '🌸', color: '#f5cac3', badge: 'bestseller', desc: 'Handcrafted with natural soy wax, this stunning floral clay candle blooms with the soft scent of fresh rose petals. Perfect for meditation, gifting, or home décor. Burns for 40+ hours.', burnTime: '40+ hrs', wax: 'Natural Soy', fragrance: 'Rose Petal', weight: '200g' },
  { id: 'p2', name: 'Rose Aroma Candle', category: 'Floral', price: '749', emoji: '🌹', color: '#e8b4b8', badge: 'new', desc: 'Indulge in the timeless elegance of pure rose essence. Hand-poured in small batches using premium soy wax and pure rose essential oil. A luxurious sensory experience.', burnTime: '35+ hrs', wax: 'Soy Blend', fragrance: 'Rose Essence', weight: '180g' },
  { id: 'p3', name: 'White Oudh Soy Candle', category: 'Woody', price: '1,249', emoji: '🤍', color: '#f0ebe3', badge: 'premium', desc: 'A sophisticated blend of white oudh and warm amber. This premium soy candle fills your space with an exotic, grounding fragrance that lingers for hours.', burnTime: '55+ hrs', wax: 'Pure Soy', fragrance: 'White Oudh', weight: '300g' },
  { id: 'p4', name: 'Lavender Calm Candle', category: 'Herbal', price: '699', emoji: '💜', color: '#c8b4d4', badge: '', desc: 'Unwind and relax with the soothing scent of French lavender. This calming candle is perfect for bedtime rituals, yoga sessions, or anytime you need a moment of peace.', burnTime: '38+ hrs', wax: 'Natural Soy', fragrance: 'French Lavender', weight: '200g' },
  { id: 'p5', name: 'Butterfly Pot Candle', category: 'Decorative', price: '1,099', emoji: '🦋', color: '#b4d4e8', badge: 'limited', desc: 'A whimsical butterfly-shaped candle in a hand-painted terracotta pot. Each piece is uniquely crafted making it a perfect art piece and a luxurious candle in one.', burnTime: '30+ hrs', wax: 'Beeswax Blend', fragrance: 'Jasmine', weight: '250g' },
  { id: 'p6', name: 'Vintage Glass Candle', category: 'Classic', price: '849', emoji: '🏺', color: '#e8d4b4', badge: '', desc: 'Inspired by vintage Parisian elegance, this candle comes in a beautiful reusable amber glass jar. A blend of sandalwood, vanilla, and musk creates a warm, sophisticated ambiance.', burnTime: '45+ hrs', wax: 'Coconut Soy', fragrance: 'Sandalwood Vanilla', weight: '220g' },
];

function openQuickView(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const modal = document.getElementById('quick-view-modal');
  if (!modal) return;
  modal.querySelector('.modal-category').textContent = product.category;
  modal.querySelector('.modal-name').textContent = product.name;
  modal.querySelector('.modal-price').textContent = `₹${product.price}`;
  modal.querySelector('.modal-desc').textContent = product.desc;
  modal.querySelector('.modal-img').innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,${product.color},#f7ede2);display:flex;align-items:center;justify-content:center;font-size:6rem">${product.emoji}</div>`;
  modal.querySelector('.modal-add-cart').onclick = () => {
    addToCart(product, modal.querySelector('.modal-add-cart'));
    closeQuickView();
  };
  modal.dataset.productId = id;
  document.getElementById('modal-overlay')?.classList.add('open');
}
function closeQuickView() {
  document.getElementById('modal-overlay')?.classList.remove('open');
}
document.getElementById('modal-overlay')?.addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeQuickView();
});
document.getElementById('modal-close')?.addEventListener('click', closeQuickView);

// ===== ADD TO CART BUTTONS =====
document.querySelectorAll('.add-cart[data-id]').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const product = products.find(p => p.id === id);
    if (product) addToCart(product, btn);
  });
});
document.querySelectorAll('.quick-view[data-id]').forEach(btn => {
  btn.addEventListener('click', () => openQuickView(btn.dataset.id));
});

// ===== WISHLIST =====
let wishlist = JSON.parse(localStorage.getItem('lumiere_wishlist') || '[]');
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  const id = btn.dataset.id;
  if (wishlist.includes(id)) { btn.classList.add('active'); btn.textContent = '♥'; }
  btn.addEventListener('click', () => {
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(w => w !== id);
      btn.classList.remove('active'); btn.textContent = '♡';
    } else {
      wishlist.push(id);
      btn.classList.add('active'); btn.textContent = '♥';
      showToast('Added to wishlist ♥');
    }
    localStorage.setItem('lumiere_wishlist', JSON.stringify(wishlist));
  });
});

// ===== SHOP FILTERS =====
function applyFilters() {
  const search = document.getElementById('search-input')?.value.toLowerCase() || '';
  const activeCategories = [...document.querySelectorAll('.filter-cat:checked')].map(c => c.value);
  const activeFragrances = [...document.querySelectorAll('.filter-frag:checked')].map(f => f.value);
  const maxPrice = parseInt(document.getElementById('price-range')?.value || '2000');

  document.querySelectorAll('.product-card[data-category]').forEach(card => {
    const name = card.dataset.name?.toLowerCase() || '';
    const cat = card.dataset.category || '';
    const frag = card.dataset.fragrance || '';
    const price = parseInt(card.dataset.price || '0');

    const matchSearch = !search || name.includes(search);
    const matchCat = activeCategories.length === 0 || activeCategories.includes(cat);
    const matchFrag = activeFragrances.length === 0 || activeFragrances.includes(frag);
    const matchPrice = price <= maxPrice;

    card.style.display = (matchSearch && matchCat && matchFrag && matchPrice) ? '' : 'none';
  });

  const priceVal = document.getElementById('price-val');
  if (priceVal) priceVal.textContent = `₹${maxPrice.toLocaleString('en-IN')}`;
}

document.getElementById('search-input')?.addEventListener('input', applyFilters);
document.querySelectorAll('.filter-cat, .filter-frag').forEach(el => el.addEventListener('change', applyFilters));
document.getElementById('price-range')?.addEventListener('input', applyFilters);

const sortSelect = document.getElementById('sort-select');
sortSelect?.addEventListener('change', () => {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.product-card')];
  cards.sort((a, b) => {
    const pa = parseInt(a.dataset.price || 0);
    const pb = parseInt(b.dataset.price || 0);
    const na = a.dataset.name || '';
    const nb = b.dataset.name || '';
    switch (sortSelect.value) {
      case 'price-asc': return pa - pb;
      case 'price-desc': return pb - pa;
      case 'name-asc': return na.localeCompare(nb);
      default: return 0;
    }
  });
  cards.forEach(c => grid.appendChild(c));
});

// ===== PRODUCT GALLERY THUMBS =====
document.querySelectorAll('.thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    const mainImg = document.querySelector('.main-image');
    if (mainImg) {
      mainImg.style.background = thumb.dataset.color || '';
    }
  });
});

// ===== NEWSLETTER =====
document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Thank you for subscribing! 🕯️');
  e.target.reset();
});

// ===== CONTACT FORM =====
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon ✨');
  e.target.reset();
});

// ===== PAGE TRANSITION =====
function navigateTo(url) {
  const pt = document.querySelector('.page-transition');
  if (!pt) { location.href = url; return; }
  pt.classList.add('entering');
  setTimeout(() => { location.href = url; }, 600);
}
window.addEventListener('pageshow', () => {
  const pt = document.querySelector('.page-transition');
  if (pt) { pt.classList.add('exiting'); setTimeout(() => pt.classList.remove('entering', 'exiting'), 700); }
});

// ===== CHECKOUT STUB =====
document.querySelector('.checkout-btn')?.addEventListener('click', () => {
  if (cart.length === 0) return showToast('Your cart is empty!');
  showToast('🎉 Redirecting to checkout…');
  setTimeout(closeCart, 2000);
});

// ===== IMAGE ZOOM =====
document.querySelectorAll('.main-image img').forEach(img => {
  img.addEventListener('mousemove', e => {
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
    img.style.transformOrigin = `${x}% ${y}%`;
  });
  img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.3)');
  img.addEventListener('mouseleave', () => { img.style.transform = ''; img.style.transformOrigin = ''; });
});
