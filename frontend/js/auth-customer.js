/**
 * AM SPORT / IT GIRL PILATES — Customer Authentication
 * Registration and Login for the storefront
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

class CustomerAuthService {
  static async register(fullName, email, phone, password) {
    try {
      const response = await fetch(`${API_BASE}/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطأ في التسجيل');
      }

      // Save token and customer info
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customer', JSON.stringify(data.customer));

      return {
        success: true,
        customer: data.customer,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطأ في تسجيل الدخول');
      }

      // Save token and customer info
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customer', JSON.stringify(data.customer));

      return {
        success: true,
        customer: data.customer,
        token: data.token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  static logout() {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customer');
  }

  static getToken() {
    return localStorage.getItem('customerToken');
  }

  static getCustomer() {
    const customer = localStorage.getItem('customer');
    return customer ? JSON.parse(customer) : null;
  }

  static isLoggedIn() {
    return !!this.getToken();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const customer = CustomerAuthService.getCustomer();
  
  // Update UI if customer is logged in
  if (customer) {
    updateUIForLoggedInCustomer(customer);
  }
});

// Handle login form
const loginForm = document.getElementById('customerLoginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      showToast('الرجاء ملء جميع الحقول', 'error');
      return;
    }

    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري تسجيل الدخول...';

    const result = await CustomerAuthService.login(email, password);

    if (result.success) {
      showToast('تم تسجيل الدخول بنجاح! 🎉', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showToast(result.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Handle register form
const registerForm = document.getElementById('customerRegisterForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showToast('الرجاء ملء جميع الحقول', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('كلمات المرور غير متطابقة', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }

    // Show loading state
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري التسجيل...';

    const result = await CustomerAuthService.register(fullName, email, phone, password);

    if (result.success) {
      showToast('تم التسجيل بنجاح! أهلاً بك 🎉', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      showToast(result.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Toast notification (shared with main.js)
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return; // Toast container not found

  const icons = {
    success:
      '<svg class="toast-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    error:
      '<svg class="toast-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg class="toast-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>',
  };

  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${icons[type] || ''}<span>${message}</span>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// Update UI for logged-in customer
function updateUIForLoggedInCustomer(customer) {
  const loginBtn = document.querySelector('[aria-label*="login"], [aria-label*="دخول"]');
  if (loginBtn) {
    loginBtn.innerHTML = `
      <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"/>
      </svg>
      <span>${customer.fullName}</span>
    `;
    loginBtn.addEventListener('click', () => {
      if (confirm('هل تريد تسجيل الخروج؟')) {
        CustomerAuthService.logout();
        window.location.href = 'index.html';
      }
    });
  }
}
