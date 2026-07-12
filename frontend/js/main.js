/**
 * AM SPORT — Main Storefront JS
 */

// WHATSAPP_PHONE مُعرّف في cart.js (بيتحمل قبل main.js في كل الصفحات)

/* ── SUBCATEGORY LABELS ────────────────────────────────── */
const SUB_LABELS = {
  tshirt:     'تيشيرتات',
  shorts:     'شورتات',
  hoodie:     'هودي',
  pants:      'بناطيل',
  tank:       'تانك توب',
  jacket:     'جاكيتات',
  bra:        'سبورت براه',
  leggings:   'ليغنز',
  longsleeve: 'كم طويل',
};

/* ── COLOR MAP ──────────────────────────────────────────── */
const COLOR_HEX = {
  'Black':    '#111',
  'White':    '#FAFAF8',
  'Charcoal': '#3D3D40',
  'Graphite': '#5A5A5E',
  'Ivory':    '#F5F0E8',
  'Grey':     '#8A8A8E',
};

/* ── TOAST ──────────────────────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = {
    success: '<svg class="toast-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg class="toast-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg class="toast-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>',
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type] || ''}<span>${message}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('page-loader')?.classList.add('hidden'), 1800);
});

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── HEADER SCROLL ──────────────────────────────────────── */
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => siteHeader?.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

/* ── SEARCH ─────────────────────────────────────────────── */
const searchOverlay = document.getElementById('searchOverlay');
const searchInput   = document.getElementById('searchInput');

document.getElementById('searchToggle')?.addEventListener('click', () => {
  searchOverlay.classList.add('open');
  setTimeout(() => searchInput?.focus(), 150);
});

window.closeSearch = () => {
  searchOverlay?.classList.remove('open');
  if (searchInput) searchInput.value = '';
};

searchOverlay?.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeSearch(); closeModal(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput?.focus(), 150);
  }
});

/* ── MOBILE NAV ─────────────────────────────────────────── */
const mobileNav  = document.getElementById('mobileNav');
const menuToggle = document.getElementById('menuToggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileNav?.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── WISHLIST ────────────────────────────────────────────── */
const getWishlist  = () => JSON.parse(localStorage.getItem('ig_wishlist') || '[]');
const saveWishlist = (l) => localStorage.setItem('ig_wishlist', JSON.stringify(l));

function toggleWishlist(product) {
  let list = getWishlist();
  const idx = list.findIndex(p => p._id === product._id);
  if (idx > -1) {
    list.splice(idx, 1);
    showToast('تمت الإزالة من المفضلة', 'info');
  } else {
    list.push({ _id: product._id, name: product.name, price: product.price, image: product.image });
    showToast('تمت الإضافة إلى المفضلة ❤️', 'success');
  }
  saveWishlist(list);
  return idx === -1;
}

/* ── RECENTLY VIEWED ─────────────────────────────────────── */
const getRV = () => JSON.parse(localStorage.getItem('ig_rv') || '[]');
function addRV(product) {
  let list = getRV().filter(p => p._id !== product._id);
  list.unshift({ _id: product._id, name: product.name, price: product.price, image: product.image });
  localStorage.setItem('ig_rv', JSON.stringify(list.slice(0, 6)));
}

function renderRecentlyViewed(api) {
  const list    = getRV();
  const section = document.getElementById('recentlyViewed');
  const grid    = document.getElementById('rvGrid');
  if (!list.length || !section || !grid) return;
  section.style.display = 'block';
  grid.innerHTML = list.map(p => `
    <div class="rv-item" onclick="openProductById('${p._id}')" role="button" tabindex="0">
      <img src="${api.resolveImageUrl(p.image)}" alt="${p.name}" loading="lazy">
      <div class="rv-info">
        <div class="rv-name">${p.name}</div>
        <div class="rv-price">${Number(p.price).toLocaleString('ar-EG')} ج.م</div>
      </div>
    </div>
  `).join('');
}

/* ── MAIN INIT ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  const api          = new PilatesApiService();
  const productsGrid = document.getElementById('productsGrid');
  const itemsCount   = document.getElementById('itemsCount');
  const subPillsWrap = document.getElementById('subPills');

  let allProducts     = [];
  let activeSub       = 'all';

  // Load products
  allProducts = await api.getAllProducts();
  renderGrid(allProducts);
  renderRecentlyViewed(api);

  // Women-only platform: no gender filter needed
  // renderSubPills() will show only women's subcategories

  // Search live filter
  searchInput?.addEventListener('input', (e) => applyFilters(e.target.value.toLowerCase().trim()));

  /* ── SUB PILLS ── */
  function renderSubPills() {
    // Women-only platform: always show subcategory pills
    const subs = [...new Set(allProducts.map(p => p.subcategory).filter(Boolean))];

    if (!subs.length) { subPillsWrap.style.display = 'none'; return; }

    subPillsWrap.style.display = 'flex';
    subPillsWrap.innerHTML = `
      <button class="sub-pill active" data-sub="all">الكل</button>
      ${subs.map(s => `<button class="sub-pill" data-sub="${s}">${SUB_LABELS[s] || s}</button>`).join('')}
    `;

    subPillsWrap.querySelectorAll('.sub-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        subPillsWrap.querySelectorAll('.sub-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeSub = pill.dataset.sub;
        applyFilters();
      });
    });
  }

  /* ── FILTER ── */
  function applyFilters(query = '') {
    const filtered = allProducts.filter(p => {
      const matchSearch = !query ||
        p.name?.toLowerCase().includes(query) ||
        p.name_ar?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query);
      const matchSub    = activeSub === 'all' || p.subcategory === activeSub;
      return matchSearch && matchSub;
    });
    renderGrid(filtered);
  }

  /* ── RENDER GRID ── */
  function renderGrid(products) {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    if (itemsCount) itemsCount.textContent = products.length;

    if (!products.length) {
      productsGrid.innerHTML = `
        <div class="empty-state" role="alert">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" style="color:var(--muted);margin:0 auto 1rem"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <p>لم نجد أي قطع تطابق بحثك.</p>
        </div>`;
      return;
    }

    const wishlist = getWishlist();

    products.forEach((product, i) => {
      const imgSrc   = api.resolveImageUrl(product.image);
      const catLabel = product.gender === 'women' ? "WOMEN'S WEAR" : "MEN'S WEAR";
      const price    = Number(product.price).toLocaleString('ar-EG') + ' ج.م';
      const wished   = wishlist.some(p => p._id === product._id);

      // Badge
      const badgeHtml = product.badge
        ? `<span class="card-badge badge-${product.badge === 'خصم' ? 'sale' : product.badge === 'جديد' ? 'new' : 'hot'}">${product.badge}</span>`
        : '';

      // Sale price
      const priceHtml = product.original_price && product.is_sale
        ? `<div class="card-price-wrap">
             <span class="card-price">${Number(product.price).toLocaleString('ar-EG')} ج.م</span>
             <span class="card-price-original">${Number(product.original_price).toLocaleString('ar-EG')} ج.م</span>
           </div>`
        : `<div class="card-price-wrap"><span class="card-price">${price}</span></div>`;

      // Rating stars
      const stars = product.rating ? renderStars(product.rating) : '';

      const card = document.createElement('article');
      card.className = 'product-card';
      card.style.animationDelay = `${Math.min(i * 0.06, 0.4)}s`;
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="card-image">
          <img src="${imgSrc}" alt="${product.name_ar || product.name}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async">
          ${badgeHtml}
          <div class="card-overlay">
            <button class="card-quick-view" aria-label="عرض تفاصيل ${product.name_ar || product.name}">عرض التفاصيل</button>
          </div>
          <button class="wishlist-btn ${wished ? 'active' : ''}" aria-label="إضافة إلى المفضلة" data-id="${product._id}">
            <svg width="16" height="16" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
        <div class="card-body">
          <span class="card-category">${catLabel}</span>
          <h3 class="card-name">${product.name_ar || product.name}</h3>
          ${stars ? `<div class="card-rating">${stars}<span class="card-rating-num">${product.rating}</span></div>` : ''}
          ${priceHtml}
        </div>
      `;

      card.addEventListener('click', (e) => {
        if (!e.target.closest('.wishlist-btn')) openModal(product, api);
      });
      card.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.wishlist-btn')) openModal(product, api);
      });
      card.querySelector('.wishlist-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const btn = e.currentTarget;
        const now = toggleWishlist(product);
        btn.classList.toggle('active', now);
        btn.querySelector('svg').setAttribute('fill', now ? 'currentColor' : 'none');
      });

      productsGrid.appendChild(card);
    });
  }

  window.openProductById = (id) => {
    const p = allProducts.find(p => p._id === id);
    if (p) openModal(p, api);
  };
});

/* ── STARS ───────────────────────────────────────────────── */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const star  = (type) => {
    if (type === 'full') return `<svg width="11" height="11" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    if (type === 'half') return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><polygon points="12 2 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="var(--gold)"/></svg>`;
    return `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  };
  return Array(full).fill(star('full')).join('') +
         Array(half).fill(star('half')).join('') +
         Array(empty).fill(star('empty')).join('');
}

/* ── MODAL ───────────────────────────────────────────────── */
const productModal = document.getElementById('productModal');
let selectedSize  = null;
let selectedColor = null;
let currentModalProduct = null;
let currentWhatsAppUrl = '';

function openModal(product, api) {
  currentModalProduct = product;
  const imgSrc   = api.resolveImageUrl(product.image);
  const catLabel = product.gender === 'women' ? "WOMEN'S WEAR" : "MEN'S WEAR";

  document.getElementById('modalImg').src       = imgSrc;
  document.getElementById('modalImg').alt       = product.name_ar || product.name;
  document.getElementById('modalCategory').textContent = catLabel;
  document.getElementById('modalTitle').textContent    = product.name_ar || product.name;

  // Price + discount
  const priceEl    = document.getElementById('modalPrice');
  const origEl     = document.getElementById('modalOriginalPrice');
  const discountEl = document.getElementById('modalDiscount');
  priceEl.textContent = Number(product.price).toLocaleString('ar-EG') + ' ج.م';
  if (product.original_price && product.is_sale) {
    origEl.textContent    = Number(product.original_price).toLocaleString('ar-EG') + ' ج.م';
    origEl.style.display  = 'inline';
    const pct = Math.round((1 - product.price / product.original_price) * 100);
    discountEl.textContent = `خصم ${pct}%`;
    discountEl.style.display = 'inline-flex';
  } else {
    origEl.style.display     = 'none';
    discountEl.style.display = 'none';
  }

  // Rating
  const ratingEl = document.getElementById('modalRating');
  if (product.rating) {
    ratingEl.innerHTML = `${renderStars(product.rating)}<span style="font-size:.8rem;color:var(--dim);margin-inline-start:.4rem">${product.rating}</span>`;
  } else {
    ratingEl.innerHTML = '';
  }

  document.getElementById('modalDesc').textContent = product.description;

  // Reset selections
  selectedSize  = null;
  selectedColor = null;

  // Colors
  const colorsGroup = document.getElementById('modalColorsGroup');
  const colorsEl    = document.getElementById('modalColors');
  const colorLabel  = document.getElementById('selectedColorLabel');
  if (product.colors?.length) {
    colorsGroup.style.display = 'block';
    colorsEl.innerHTML = product.colors.map(c => `
      <button class="color-swatch" data-color="${c}" title="${c}" style="--swatch: ${COLOR_HEX[c] || '#888'}">
        ${c === 'White' || c === 'Ivory' ? '<span class="swatch-border"></span>' : ''}
      </button>
    `).join('');
    colorLabel.textContent = '';
    colorsEl.querySelectorAll('.color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        colorsEl.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedColor = btn.dataset.color;
        colorLabel.textContent = selectedColor;

        // تبديل الصورة الرئيسية حسب اللون المختار (لو فيه صورة مخصصة لهذا اللون)
        const modalImgEl = document.getElementById('modalImg');
        const colorSpecificImage = product.colorImages && product.colorImages[selectedColor];
        modalImgEl.src = api.resolveImageUrl(colorSpecificImage || product.image);

        updateWhatsApp(product);
      });
    });
  } else {
    colorsGroup.style.display = 'none';
  }

  // Sizes
  const sizesGroup = document.getElementById('modalSizesGroup');
  const sizesEl    = document.getElementById('modalSizes');
  const sizeLabel  = document.getElementById('selectedSizeLabel');
  if (product.sizes?.length) {
    sizesGroup.style.display = 'block';
    sizesEl.innerHTML = product.sizes.map(s => `
      <button class="size-btn" data-size="${s}">${s}</button>
    `).join('');
    sizeLabel.textContent = '';
    sizesEl.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizesEl.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        sizeLabel.textContent = selectedSize;
        updateWhatsApp(product);
      });
    });
  } else {
    sizesGroup.style.display = 'none';
  }

  updateWhatsApp(product);
  productModal?.classList.add('active');
  document.body.style.overflow = 'hidden';
  addRV(product);
}

function updateWhatsApp(product) {
  const sizeText  = selectedSize  ? `\n- المقاس: ${selectedSize}`  : '';
  const colorText = selectedColor ? `\n- اللون: ${selectedColor}` : '';
  const msg = encodeURIComponent(
    `مرحباً AM SPORT،\n\nأريد الاستفسار عن:\n- ${product.name_ar || product.name}\n- السعر: ${product.price} ج.م${sizeText}${colorText}\n\nيرجى تأكيد التوافر.`
  );
  currentWhatsAppUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
}

/* ── MODAL ACTION BUTTONS ─────────────────────────────────── */
document.getElementById('modalAddToCartBtn')?.addEventListener('click', () => {
  if (!currentModalProduct) return;

  if (currentModalProduct.sizes?.length && !selectedSize) {
    showToast('يرجى اختيار المقاس', 'error');
    return;
  }
  if (currentModalProduct.colors?.length && !selectedColor) {
    showToast('يرجى اختيار اللون', 'error');
    return;
  }

  cart.addItem(currentModalProduct, selectedSize || 'one-size', selectedColor || 'default', 1);
  showToast('تمت الإضافة إلى السلة ✓', 'success');
});

document.getElementById('whatsappDirectBtn')?.addEventListener('click', () => {
  if (!currentWhatsAppUrl) return;
  window.open(currentWhatsAppUrl, '_blank');
});

window.closeModal = () => {
  productModal?.classList.remove('active');
  document.body.style.overflow = '';
};
