/**
 * AM SPORT — Admin Dashboard JS
 * Full CRUD, image upload, stats, toasts.
 */

const token   = localStorage.getItem('adminToken');


/* ── TOAST ─────────────────────────────────────────────── */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = {
    success: '<svg class="ti" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg class="ti" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg class="ti" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>',
  };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type]}<span>${message}</span>`;
  container?.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ── LOGOUT ─────────────────────────────────────────────── */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  window.location.replace('login.html');
});

/* ── COLOR DEFINITIONS ────────────────────────────────────── */
const COLOR_DEFS = [
  { value: 'Black',        hex: '#111111', label: 'أسود' },
  { value: 'White',        hex: '#FAFAF8', label: 'أبيض' },
  { value: 'Charcoal',     hex: '#3D3D40', label: 'فحمي' },
  { value: 'Graphite',     hex: '#5A5A5E', label: 'جرافيت' },
  { value: 'Ivory',        hex: '#F5F0E8', label: 'عاجي' },
  { value: 'Grey',         hex: '#8A8A8E', label: 'رمادي' },
  { value: 'BrightRed',    hex: '#E30613', label: 'أحمر فاقع' },
  { value: 'Burgundy',     hex: '#6D071A', label: 'خمري' },
  { value: 'WineRed',      hex: '#722F37', label: 'أحمر نبيتي' },
  { value: 'CoralRed',     hex: '#FF6B5B', label: 'أحمر مرجاني' },
  { value: 'HotPink',      hex: '#FF69B4', label: 'وردي فاقع' },
  { value: 'BabyPink',     hex: '#F4C2C2', label: 'وردي فاتح' },
  { value: 'OrchidPink',   hex: '#DA95C4', label: 'وردي أوركيد' },
  { value: 'DustyMauve',   hex: '#B784A0', label: 'موف ترابي' },
  { value: 'Beige',        hex: '#E8D5B7', label: 'بيج' },
  { value: 'LightGray',    hex: '#D3D3D3', label: 'رمادي فاتح' },
  { value: 'CharcoalGray', hex: '#4A4A4D', label: 'رمادي فحمي' },
  { value: 'RoyalBlue',    hex: '#4169E1', label: 'أزرق ملكي' },
  { value: 'SkyBlue',      hex: '#87CEEB', label: 'أزرق سماوي' },
  { value: 'NavyBlue',     hex: '#1B1F3B', label: 'كحلي' },
  { value: 'OliveGreen',   hex: '#708238', label: 'أخضر زيتوني' },
];

/* ── RENDER COLOR OPTIONS ─────────────────────────────────── */
function renderColorOptions() {
  const container = document.getElementById('colorOptionsContainer');
  if (!container) return;

  container.innerHTML = COLOR_DEFS.map(c => `
    <div class="color-row">
      <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;cursor:pointer">
        <input type="checkbox" class="color-opt" value="${c.value}" data-hex="${c.hex}">
        <span style="width:14px;height:14px;border-radius:50%;display:inline-block;background:${c.hex};border:1px solid var(--border-h)"></span> ${c.label}
      </label>
      <input type="url" class="color-img-input" data-color="${c.value}" placeholder="رابط صورة لون ${c.label} (اختياري)" style="display:none;margin-top:0.4rem;width:100%;padding:0.5rem 0.75rem;background:var(--graph);border:1px solid var(--border);color:var(--white);border-radius:var(--r-sm);font-size:0.8rem">
    </div>
  `).join('');

  // Toggle image input visibility when a color is checked
  container.querySelectorAll('.color-opt').forEach(cb => {
    cb.addEventListener('change', () => {
      const input = container.querySelector(`.color-img-input[data-color="${cb.value}"]`);
      if (input) input.style.display = cb.checked ? 'block' : 'none';
    });
  });
}
renderColorOptions();

/* ── IMAGE URL PREVIEW ───────────────────────────────────── */
document.getElementById('imageUrl')?.addEventListener('input', (e) => {
  const preview = document.getElementById('imagePreview');
  const url = e.target.value.trim();
  if (!preview) return;

  if (url) {
    preview.src = url;
    preview.style.display = 'block';
    preview.onerror = () => { preview.style.display = 'none'; };
  } else {
    preview.style.display = 'none';
  }
});

/* ── FETCH PRODUCTS ──────────────────────────────────────── */
async function fetchAdminProducts() {
  try {
    const products = await api.getAllProducts();
    window._adminProducts = products; // نحتفظ بنسخة لاستخدامها عند التعديل

    // Stats
    document.getElementById('totalProducts').textContent   = products.length;
    document.getElementById('inStockProducts').textContent = products.length;
    document.getElementById('clothingCount').textContent   = products.filter(p => p.category === 'clothing').length;
    document.getElementById('equipmentCount').textContent  = products.filter(p => p.category === 'equipment').length;

    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    if (!products.length) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-table">
            <svg fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
            <p>لا توجد منتجات حتى الآن. ابدأ بإضافة منتج!</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = products.map((p, idx) => {
      const imgSrc   = api.resolveImageUrl(p.image);
      const catLabel = p.category === 'clothing' ? 'ملابس رياضية' : 'معدات';
      const price    = Number(p.price).toLocaleString('ar-EG');
      const isFirst  = idx === 0;
      const isLast   = idx === products.length - 1;
      return `
        <tr>
          <td><img src="${imgSrc}" class="td-img" alt="${p.name}" loading="lazy" onerror="this.style.opacity=0.3"></td>
          <td><span class="td-name">${p.name}</span></td>
          <td><span class="td-cat">${catLabel}</span></td>
          <td><span class="td-price">${price} ج.م</span></td>
          <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
            <button
              class="btn btn-outline btn-sm"
              onclick="moveProduct('${p._id}', 'up')"
              aria-label="تحريك ${p.name} لأعلى"
              ${isFirst ? 'disabled style="opacity:0.35;cursor:not-allowed"' : ''}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            </button>
            <button
              class="btn btn-outline btn-sm"
              onclick="moveProduct('${p._id}', 'down')"
              aria-label="تحريك ${p.name} لأسفل"
              ${isLast ? 'disabled style="opacity:0.35;cursor:not-allowed"' : ''}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            </button>
            <button
              class="btn btn-outline btn-sm"
              onclick="editProduct('${p._id}')"
              aria-label="تعديل ${p.name}"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              تعديل
            </button>
            <button
              class="btn btn-danger btn-sm"
              onclick="deleteProduct('${p._id}')"
              aria-label="حذف ${p.name}"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              حذف
            </button>
          </td>
        </tr>`;
    }).join('');

  } catch (err) {
    console.error('[Admin] fetchAdminProducts:', err);
    showToast('خطأ في تحميل المنتجات.', 'error');
  }
}

/* ── ADD / UPDATE PRODUCT ────────────────────────────────── */
document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const editingId = document.getElementById('editingId').value;
  const selectedColors = Array.from(document.querySelectorAll('.color-opt:checked')).map(c => c.value);
  const selectedSizes  = Array.from(document.querySelectorAll('.size-opt:checked')).map(s => s.value);
  const colorImages = {};
  selectedColors.forEach(colorName => {
    const input = document.querySelector(`.color-img-input[data-color="${colorName}"]`);
    if (input && input.value.trim()) colorImages[colorName] = input.value.trim();
  });
  const payload = {
    name:        document.getElementById('name').value.trim(),
    category:    document.getElementById('category').value,
    subcategory: document.getElementById('subcategory').value,
    price:       parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value.trim(),
    image:       document.getElementById('imageUrl').value ||
                 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    colors:      selectedColors,
    colorImages: colorImages,
    sizes:       selectedSizes,
  };

  if (!payload.name || !payload.price || !payload.description) {
    showToast('يرجى ملء جميع الحقول المطلوبة.', 'error');
    return;
  }

  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span>جارٍ الحفظ...</span>'; }

  try {
    const res = editingId
      ? await api.updateProduct(editingId, payload, token)
      : await api.createProduct(payload, token);

    if (res.ok) {
      showToast(editingId ? `تم تحديث "${payload.name}" بنجاح! ✓` : `تمت إضافة "${payload.name}" بنجاح! ✓`, 'success');
      resetProductForm();
      fetchAdminProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      showToast(data.message || 'حدث خطأ أثناء الحفظ.', 'error');
    }
  } catch (err) {
    console.error('[Admin] saveProduct:', err);
    showToast('خطأ في الاتصال بالسيرفر.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> <span id="submitBtnText">${document.getElementById('editingId').value ? 'حفظ التعديلات' : 'حفظ المنتج'}</span>`;
    }
  }
});

/* ── EDIT PRODUCT: تعبئة الفورم ببيانات المنتج المختار ──── */
window.editProduct = (id) => {
  const product = (window._adminProducts || []).find(p => p._id === id);
  if (!product) {
    showToast('تعذر العثور على بيانات المنتج.', 'error');
    return;
  }

  document.getElementById('editingId').value   = product._id;
  document.getElementById('name').value        = product.name || '';
  document.getElementById('category').value    = product.category || 'clothing';
  document.getElementById('subcategory').value = product.subcategory || '';
  document.getElementById('price').value       = product.price || '';
  document.getElementById('description').value = product.description || '';
  document.getElementById('imageUrl').value    = product.image || '';

  const preview = document.getElementById('imagePreview');
  if (preview && product.image) {
    preview.src = product.image;
    preview.style.display = 'block';
  }

  // تحديد الألوان المختارة سابقًا وتعبئة صور كل لون
  document.querySelectorAll('.color-opt').forEach(cb => {
    const isSelected = (product.colors || []).includes(cb.value);
    cb.checked = isSelected;
    const imgInput = document.querySelector(`.color-img-input[data-color="${cb.value}"]`);
    if (imgInput) {
      imgInput.style.display = isSelected ? 'block' : 'none';
      imgInput.value = (product.colorImages && product.colorImages[cb.value]) || '';
    }
  });

  // تحديد المقاسات المختارة سابقًا
  document.querySelectorAll('.size-opt').forEach(cb => {
    cb.checked = (product.sizes || []).includes(cb.value);
  });

  document.getElementById('formTitle').textContent    = 'تعديل المنتج';
  document.getElementById('formSubtitle').textContent = `تعديل بيانات "${product.name}"`;
  document.getElementById('submitBtnText').textContent = 'حفظ التعديلات';

  document.querySelector('.admin-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/* ── RESET FORM (إضافة جديدة أو إلغاء التعديل) ───────────── */
window.resetProductForm = () => {
  document.getElementById('addProductForm').reset();
  document.getElementById('editingId').value = '';
  document.querySelectorAll('.color-img-input').forEach(inp => { inp.style.display = 'none'; inp.value = ''; });
  const preview = document.getElementById('imagePreview');
  if (preview) { preview.src = ''; preview.style.display = 'none'; }
  document.getElementById('formTitle').textContent    = 'إضافة منتج جديد';
  document.getElementById('formSubtitle').textContent = 'أضف قطعة جديدة إلى تشكيلة AM SPORT';
  document.getElementById('submitBtnText').textContent = 'حفظ المنتج';
};

/* ── MOVE PRODUCT UP/DOWN (تغيير ترتيب العرض) ────────────── */
window.moveProduct = async (id, direction) => {
  const products = [...(window._adminProducts || [])];
  const idx = products.findIndex(p => p._id === id);
  if (idx === -1) return;

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= products.length) return;

  // بدّل مكان المنتجين في القائمة
  [products[idx], products[swapIdx]] = [products[swapIdx], products[idx]];

  try {
    // نحفظ ترتيب كل المنتجات من جديد حسب موضعها الفعلي في القائمة
    // (يضمن ترقيم متسلسل صحيح دائمًا، حتى لو كانت القيم القديمة متساوية)
    await Promise.all(
      products.map((p, i) => api.updateProduct(p._id, { ...p, order: i }, token))
    );
    fetchAdminProducts();
  } catch (err) {
    console.error('[Admin] moveProduct:', err);
    showToast('خطأ في تغيير الترتيب.', 'error');
  }
};

/* ── DELETE PRODUCT ──────────────────────────────────────── */
window.deleteProduct = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذه القطعة؟ لا يمكن التراجع عن هذا الإجراء.')) return;

  try {
    const res = await api.deleteProduct(id, token);
    if (res.ok) {
      showToast('تم حذف المنتج بنجاح.', 'success');
      fetchAdminProducts();
    } else {
      showToast('فشل حذف المنتج.', 'error');
    }
  } catch (err) {
    console.error('[Admin] deleteProduct:', err);
    showToast('خطأ في الاتصال بالسيرفر.', 'error');
  }
};

/* ── INIT ────────────────────────────────────────────────── */
fetchAdminProducts();
