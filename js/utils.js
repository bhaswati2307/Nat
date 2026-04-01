/* ==========================================
   NATHABIT ECOMMERCE - UTILITY FUNCTIONS
   ========================================== */

const API_BASE = 'tables';

// ── API HELPER ──────────────────────────────
async function apiGet(table, params = {}) {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/${table}${q ? '?' + q : ''}`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
async function apiPost(table, data) {
  const res = await fetch(`${API_BASE}/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
async function apiPatch(table, id, data) {
  const res = await fetch(`${API_BASE}/${table}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
async function apiDelete(table, id) {
  await fetch(`${API_BASE}/${table}/${id}`, { method: 'DELETE' });
}

// ── LOCAL STORAGE ──────────────────────────
const storage = {
  get: (key, def = null) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  remove: (key) => localStorage.removeItem(key)
};

// ── CART MANAGEMENT ──────────────────────────
const Cart = {
  getItems() { return storage.get('nh_cart', []); },
  saveItems(items) { storage.set('nh_cart', items); updateCartUI(); },
  add(product, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) { existing.qty += qty; }
    else { items.push({ id: product.id, name: product.name, price: product.price, original_price: product.original_price, image: product.image, slug: product.slug, qty }); }
    this.saveItems(items);
    showToast(`${product.name} added to cart!`, 'success');
  },
  remove(id) { this.saveItems(this.getItems().filter(i => i.id !== id)); },
  updateQty(id, qty) {
    if (qty < 1) { this.remove(id); return; }
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = qty; this.saveItems(items); }
  },
  clear() { storage.remove('nh_cart'); updateCartUI(); },
  count() { return this.getItems().reduce((s, i) => s + i.qty, 0); },
  subtotal() { return this.getItems().reduce((s, i) => s + i.price * i.qty, 0); },
  applyCoupon(code, discount) { storage.set('nh_coupon', { code, discount }); },
  getCoupon() { return storage.get('nh_coupon', null); },
  removeCoupon() { storage.remove('nh_coupon'); }
};

// ── WISHLIST MANAGEMENT ──────────────────────
const Wishlist = {
  get() { return storage.get('nh_wishlist', []); },
  toggle(product) {
    const items = this.get();
    const idx = items.findIndex(i => i.id === product.id);
    if (idx > -1) { items.splice(idx, 1); showToast('Removed from wishlist'); }
    else { items.push({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug }); showToast('Added to wishlist ❤️', 'success'); }
    storage.set('nh_wishlist', items);
    updateWishlistUI();
    return idx === -1;
  },
  has(id) { return this.get().some(i => i.id === id); },
  count() { return this.get().length; }
};

// ── USER AUTH ──────────────────────────────
const Auth = {
  getUser() { return storage.get('nh_user', null); },
  login(user) { storage.set('nh_user', user); updateAuthUI(); },
  logout() { storage.remove('nh_user'); storage.remove('nh_coupon'); updateAuthUI(); },
  isLoggedIn() { return !!this.getUser(); }
};

// ── TOAST NOTIFICATIONS ──────────────────────
function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'fadeOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, duration);
}

// ── FORMAT HELPERS ──────────────────────────
function formatPrice(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function getDiscount(original, sale) {
  if (!original || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}
function generateId() { return 'nh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); }
function generateOrderNumber() { return 'NH' + Date.now().toString().slice(-8); }
function slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function starHTML(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) s += '<i class="fas fa-star" style="color:#D4AF37"></i>';
    else if (i - rating < 1) s += '<i class="fas fa-star-half-alt" style="color:#D4AF37"></i>';
    else s += '<i class="far fa-star" style="color:#D4AF37"></i>';
  }
  return s;
}

// ── UI UPDATES ──────────────────────────────
function updateCartUI() {
  const count = Cart.count();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });
  renderCartSidebar();
}
function updateWishlistUI() {
  const count = Wishlist.count();
  document.querySelectorAll('.wishlist-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('show', count > 0);
  });
  document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
    btn.classList.toggle('active', Wishlist.has(btn.dataset.wishlistId));
    btn.querySelector('i') && (btn.querySelector('i').className = Wishlist.has(btn.dataset.wishlistId) ? 'fas fa-heart' : 'far fa-heart');
  });
}
function updateAuthUI() {
  const user = Auth.getUser();
  document.querySelectorAll('.auth-name').forEach(el => el.textContent = user ? user.name.split(' ')[0] : 'Account');
  document.querySelectorAll('.auth-logged-in').forEach(el => el.style.display = user ? '' : 'none');
  document.querySelectorAll('.auth-logged-out').forEach(el => el.style.display = user ? 'none' : '');
}

// ── RENDER CART SIDEBAR ──────────────────────
function renderCartSidebar() {
  const itemsEl = document.getElementById('cart-items-list');
  const emptyEl = document.getElementById('cart-empty');
  if (!itemsEl) return;
  const items = Cart.getItems();
  if (items.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl && (emptyEl.style.display = '');
  } else {
    emptyEl && (emptyEl.style.display = 'none');
    itemsEl.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80/fdf5eb/c17c3c?text=NH'">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)} <span class="cart-item-original">${item.original_price > item.price ? formatPrice(item.original_price) : ''}</span></div>
          <div class="qty-control">
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', ${item.qty - 1})">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
          <span class="cart-item-remove" onclick="Cart.remove('${item.id}')">Remove</span>
        </div>
        <div style="font-size:0.9rem;font-weight:700;color:var(--primary-dark);white-space:nowrap">${formatPrice(item.price * item.qty)}</div>
      </div>
    `).join('');
  }
  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = Cart.subtotal();
  const coupon = Cart.getCoupon();
  const discount = coupon ? coupon.discount : 0;
  const shipping = subtotal > 599 ? 0 : 99;
  const total = subtotal - discount + shipping;
  document.querySelectorAll('.cart-subtotal').forEach(el => el.textContent = formatPrice(subtotal));
  document.querySelectorAll('.cart-discount').forEach(el => el.textContent = discount > 0 ? '-' + formatPrice(discount) : '₹0');
  document.querySelectorAll('.cart-shipping').forEach(el => el.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping));
  document.querySelectorAll('.cart-total').forEach(el => el.textContent = formatPrice(total));
  // Coupon display
  const couponBadge = document.getElementById('coupon-applied-badge');
  if (couponBadge) { couponBadge.style.display = coupon ? 'flex' : 'none'; if (coupon) couponBadge.querySelector('.coupon-text').textContent = coupon.code + ': -' + formatPrice(coupon.discount); }
}

// ── PRODUCT CARD RENDERER ─────────────────────
function renderProductCard(p) {
  const disc = getDiscount(p.original_price, p.price);
  const badgeMap = { 'BEST SELLER': '', 'NEW LAUNCH': 'new', 'AWARD WINNER': 'award', 'FEATURED': 'featured' };
  const inWish = Wishlist.has(p.id);
  return `
    <div class="product-card" data-product-id="${p.id}">
      <div class="product-img-wrap">
        ${p.badge ? `<span class="product-badge ${badgeMap[p.badge] || ''}">${p.badge}</span>` : ''}
        <button class="product-wishlist-btn ${inWish ? 'active' : ''}" data-wishlist-id="${p.id}" onclick="toggleWishlist(this, ${JSON.stringify(p).replace(/"/g, '&quot;')})">
          <i class="${inWish ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <a href="product.html?slug=${p.slug}">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/400x400/fdf5eb/c17c3c?text=NH'">
        </a>
        <button class="product-add-btn" onclick="addToCartFromCard(${JSON.stringify(p).replace(/"/g, '&quot;')})" title="Add to cart">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="product-info">
        <a href="product.html?slug=${p.slug}">
          <div class="product-name">${p.name}</div>
        </a>
        <div class="product-short-desc">${p.short_desc || ''}</div>
        <div class="product-rating">
          <div class="stars">${starHTML(p.rating || 4.5)}</div>
          <span class="rating-count">(${(p.reviews_count || 0).toLocaleString()})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.original_price > p.price ? `<span class="price-original">${formatPrice(p.original_price)}</span>` : ''}
          ${disc > 0 ? `<span class="price-discount">${disc}% off</span>` : ''}
        </div>
      </div>
    </div>`;
}

function addToCartFromCard(product) {
  Cart.add(product, 1);
  openCart();
}
function toggleWishlist(btn, product) {
  const added = Wishlist.toggle(product);
  btn.classList.toggle('active', added);
  const icon = btn.querySelector('i');
  if (icon) icon.className = added ? 'fas fa-heart' : 'far fa-heart';
}

// ── CART SIDEBAR OPEN/CLOSE ──────────────────
function openCart() {
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartSidebar();
}
function closeCart() {
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

// ── APPLY COUPON ──────────────────────────────
async function applyCoupon(code) {
  if (!code) return;
  try {
    const res = await apiGet('coupons', { search: code, limit: 10 });
    const coupon = res.data?.find(c => c.code === code.toUpperCase() && c.is_active);
    if (!coupon) { showToast('Invalid coupon code', 'error'); return false; }
    const subtotal = Cart.subtotal();
    if (subtotal < coupon.min_order) { showToast(`Minimum order ₹${coupon.min_order} required`, 'error'); return false; }
    let discount = coupon.type === 'percentage' ? Math.round(subtotal * coupon.value / 100) : coupon.value;
    if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
    Cart.applyCoupon(coupon.code, discount);
    updateCartTotals();
    showToast(`Coupon applied! You saved ${formatPrice(discount)} 🎉`, 'success');
    return true;
  } catch (e) { showToast('Error applying coupon', 'error'); return false; }
}

// ── INITIALIZE ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  updateWishlistUI();
  updateAuthUI();

  // Cart toggle
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);

  // Search overlay
  document.getElementById('search-btn')?.addEventListener('click', () => {
    document.getElementById('search-overlay')?.classList.add('open');
    document.getElementById('search-input')?.focus();
  });
  document.getElementById('search-overlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
  });
  document.getElementById('search-close-btn')?.addEventListener('click', () => {
    document.getElementById('search-overlay')?.classList.remove('open');
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(async (e) => {
      const q = e.target.value.trim();
      const resultsEl = document.getElementById('search-results');
      if (!resultsEl) return;
      if (q.length < 2) { resultsEl.innerHTML = ''; return; }
      try {
        const res = await apiGet('products', { search: q, limit: 6 });
        if (res.data?.length) {
          resultsEl.innerHTML = res.data.map(p => `
            <a href="product.html?slug=${p.slug}" class="search-result-item" onclick="document.getElementById('search-overlay').classList.remove('open')">
              <img src="${p.image}" style="width:48px;height:48px;border-radius:8px;object-fit:cover" onerror="this.src='https://placehold.co/48/fdf5eb/c17c3c?text=NH'">
              <div><div style="font-weight:600;font-size:.9rem">${p.name}</div><div style="color:var(--primary);font-size:.85rem;font-weight:700">${formatPrice(p.price)}</div></div>
            </a>`).join('');
          resultsEl.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-top:12px';
        } else { resultsEl.innerHTML = '<p style="color:var(--text-light);font-size:.88rem;text-align:center;padding:12px">No products found</p>'; }
      } catch {}
    }, 300));
  }

  // Mobile menu
  document.getElementById('hamburger-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.add('open');
    document.getElementById('mobile-overlay')?.classList.add('open');
  });
  document.getElementById('mobile-menu-close')?.addEventListener('click', closeMobileMenu);
  document.getElementById('mobile-overlay')?.addEventListener('click', closeMobileMenu);

  // Coupon in cart sidebar
  document.getElementById('apply-coupon-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('coupon-input');
    if (input) await applyCoupon(input.value.trim());
  });
  document.getElementById('remove-coupon-btn')?.addEventListener('click', () => {
    Cart.removeCoupon();
    updateCartTotals();
    showToast('Coupon removed');
  });

  // Support widget
  document.getElementById('support-toggle')?.addEventListener('click', () => {
    document.getElementById('support-panel')?.classList.toggle('open');
  });

  // Hero slider
  initHeroSlider();
});

function closeMobileMenu() {
  document.getElementById('mobile-menu')?.classList.remove('open');
  document.getElementById('mobile-overlay')?.classList.remove('open');
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;
  let current = 0;
  function goTo(n) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  }
  document.getElementById('slider-prev')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('slider-next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(current + 1), 5000);
}

function debounce(fn, delay) {
  let timer;
  return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
}
