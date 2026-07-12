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

/* ── COLOR IMAGE INPUT TOGGLE ────────────────────────────── */
document.querySelectorAll('.color-opt').forEach(cb => {
  cb.addEventListener('change', () => {
    const input = document.querySelector(`.color-img-input[data-color="${cb.value}"]`);
    if (input) input.style.display = cb.checked ? 'block' : 'none';
  });
});

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

    tbody.innerHTML = products.map(p => {
      const imgSrc   = api.resolveImageUrl(p.image);
      const catLabel = p.category === 'clothing' ? 'ملابس رياضية' : 'معدات';
      const price    = Number(p.price).toLocaleString('ar-EG');
      return `
        <tr>
          <td><img src="${imgSrc}" class="td-img" alt="${p.name}" loading="lazy" onerror="this.style.opacity=0.3"></td>
          <td><span class="td-name">${p.name}</span></td>
          <td><span class="td-cat">${catLabel}</span></td>
          <td><span class="td-price">${price} ج.م</span></td>
          <td>
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

/* ── ADD PRODUCT ─────────────────────────────────────────── */
document.getElementById('addProductForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
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
    const res = await api.createProduct(payload, token);

    if (res.ok) {
      showToast(`تمت إضافة "${payload.name}" بنجاح! ✓`, 'success');
      document.getElementById('addProductForm').reset();
      document.querySelectorAll('.color-img-input').forEach(inp => { inp.style.display = 'none'; });
      const preview = document.getElementById('imagePreview');
      if (preview) { preview.src = ''; preview.style.display = 'none'; }
      fetchAdminProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      showToast(data.message || 'حدث خطأ أثناء الإضافة.', 'error');
    }
  } catch (err) {
    console.error('[Admin] createProduct:', err);
    showToast('خطأ في الاتصال بالسيرفر.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> حفظ المنتج`;
    }
  }
});

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
