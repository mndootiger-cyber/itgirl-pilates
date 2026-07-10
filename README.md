# 🎀 IT GIRL PILATES - Full-Stack CMS Platform

> تحويل موقع ثابت إلى منصة متكاملة بمعايير الإنتاج 2026

## 📚 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المتطلبات](#المتطلبات)
3. [البدء السريع](#البدء-السريع)
4. [هيكل المشروع](#هيكل-المشروع)
5. [API Documentation](#api-documentation)
6. [مميزات الأمان](#مميزات-الأمان)
7. [النشر للإنتاج](#النشر-للإنتاج)

---

## نظرة عامة

هذا المشروع عبارة عن **Full-Stack CMS** متكامل لمتجر IT GIRL للبيلاتس الفاخر مع:

✅ **Backend REST API** مع Express.js و MongoDB  
✅ **Authentication System** آمن بـ JWT و bcryptjs  
✅ **Admin Dashboard** احترافي للإدارة  
✅ **Image Upload** نظام رفع صور متقدم بـ Multer  
✅ **Security** حماية عالية المستوى بـ Helmet و CORS  
✅ **Scalable Architecture** معمارية نظيفة وقابلة للتوسع  

---

## المتطلبات

قبل البدء، تأكد من تثبيت:

- **Node.js** (v16+) - [تحميل](https://nodejs.org/)
- **MongoDB** (Local أو Atlas) - [تحميل](https://www.mongodb.com/try/download/community)
- **npm** (يأتي مع Node.js)

### تثبيت MongoDB محلياً (Windows)

```bash
# بعد التحميل من الرابط أعلاه
# 1. قم بتثبيت MongoDB Community Server
# 2. اختر "Install as Service" أثناء التثبيت
# 3. سيبدأ تلقائياً على: mongodb://localhost:27017
```

---

## البدء السريع

### 1️⃣ الخطوة الأولى: تشغيل السيرفر

```bash
# اذهب إلى مجلد backend
cd backend

# تثبيت الاعتماديات
npm install

# تشغيل السيرفر
npm start
```

**النتيجة المتوقعة:**
```
🚀 Production Server running on port 5000
MongoDB Connected: localhost
Seeded Initial Luxury Collection Items Successfully.
```

### 2️⃣ الخطوة الثانية: إنشاء حساب الأدمن

في terminal جديد:

```bash
cd backend
npm run seed
```

**النتيجة:**
```
Admin Imported! Login with: admin@itgirl.com / password123
```

### 3️⃣ الخطوة الثالثة: فتح لوحة التحكم

افتح في المتصفح:

```
http://localhost:5000/../frontend/login.html
```

**بيانات الدخول:**
- البريد الإلكتروني: `admin@itgirl.com`
- كلمة المرور: `password123`

---

## هيكل المشروع

```
itgirl-pilates/
├── backend/
│   ├── config/
│   │   └── db.js              # اتصال MongoDB
│   ├── controllers/
│   │   ├── authController.js  # منطق الدخول
│   │   └── productController.js # منطق المنتجات
│   ├── middleware/
│   │   ├── authMiddleware.js  # حماية JWT
│   │   └── uploadMiddleware.js # رفع الصور
│   ├── models/
│   │   ├── Admin.js           # نموذج الأدمن
│   │   └── Product.js         # نموذج المنتج
│   ├── routes/
│   │   ├── authRoutes.js      # مسارات الدخول
│   │   └── productRoutes.js   # مسارات المنتجات
│   ├── uploads/               # مجلد الصور المرفوعة
│   ├── .env                   # متغيرات البيئة
│   ├── package.json
│   ├── seeder.js              # إنشاء الأدمن
│   └── server.js              # نقطة البدء
│
└── frontend/
    ├── login.html             # صفحة الدخول
    ├── admin.html             # لوحة التحكم
    ├── index.html             # الصفحة الرئيسية
    ├── css/
    │   └── main.css
    └── js/
        ├── login.js           # منطق الدخول
        ├── admin.js           # منطق لوحة التحكم
        ├── api.js             # تفاعل API
        └── main.js
```

---

## API Documentation

### 🔐 Authentication Endpoints

#### تسجيل الدخول
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@itgirl.com",
  "password": "password123"
}
```

**الاستجابة الناجحة:**
```json
{
  "_id": "65abc123...",
  "email": "admin@itgirl.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 📦 Products Endpoints

#### الحصول على جميع المنتجات
```http
GET http://localhost:5000/api/products
```

#### إضافة منتج جديد (محمي)
```http
POST http://localhost:5000/api/products
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "name": "طقم ليفل المخملي",
  "category": "clothing",
  "price": 2100,
  "image": "/uploads/luxury-1234567890.jpg",
  "description": "مصنوع من نسيج فاخر مرن..."
}
```

#### رفع صورة (محمي)
```http
POST http://localhost:5000/api/products/upload
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data

[يتم إرسال ملف الصورة]
```

**الاستجابة:**
```
/uploads/luxury-1234567890.jpg
```

#### حذف منتج (محمي)
```http
DELETE http://localhost:5000/api/products/{PRODUCT_ID}
Authorization: Bearer {TOKEN}
```

---

## مميزات الأمان

### 🔒 الحماية المدمجة:

1. **JWT Authentication**
   - توكن 30 يوم
   - Token-based stateless authentication
   - محدش يقدر يدخل المنتجات بدون توكن

2. **Password Encryption**
   - bcryptjs 10 salts
   - لا تُخزن كلمات المرور بصيغة عادية

3. **Image Validation**
   - صور فقط (JPG, PNG, WEBP)
   - حد أقصى 5MB
   - معالجة آمنة

4. **CORS & Helmet**
   - حماية من CSRF attacks
   - Security headers
   - XSS Prevention

5. **Frontend Protection**
   - التحقق من التوكن على الصفحات الحساسة
   - إعادة توجيه تلقائي في حالة الدخول غير المصرح

---

## ملف البيئة (.env)

ملف `backend/.env` يحتوي على:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/itgirl_store
JWT_SECRET=ItGirlPilates_Luxury_Secret_Key_2026_!@#
JWT_EXPIRES_IN=30d
```

⚠️ **لا تنسَ:** لا تنشر هذا الملف على GitHub!

---

## النشر للإنتاج

### خيار 1: نشر على Render (للـ Backend)

1. اذهب إلى [Render.com](https://render.com)
2. اختر "New Web Service"
3. ارتبط بـ GitHub repository
4. اختر "Node"
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. أضف متغيرات البيئة:
   - `MONGO_URI` (من MongoDB Atlas)
   - `JWT_SECRET` (غيّر القيمة!)
8. اضغط Deploy

### خيار 2: نشر على MongoDB Atlas (قاعدة البيانات)

1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب مجاني
3. أنشئ Cluster جديد
4. احصل على Connection String
5. ضعه في متغير `MONGO_URI`

### خيار 3: نشر الـ Frontend على Vercel

1. اذهب إلى [Vercel.com](https://vercel.com)
2. Import Project من GitHub
3. سيتم النشر تلقائياً
4. حدّث رابط الـ API في `frontend/js/admin.js`:

```javascript
const baseUrl = 'https://your-render-app.onrender.com/api';
```

---

## معالجة المشاكل الشائعة

### ❌ "MongoDB Connection Error"
```
✅ الحل: تأكد من تشغيل: mongod
أو استخدم MongoDB Atlas بدلاً من Local
```

### ❌ "PORT 5000 already in use"
```
✅ الحل: غيّر PORT في .env إلى 5001 أو قتّل العملية:
lsof -ti:5000 | xargs kill -9
```

### ❌ "CORS Error"
```
✅ الحل: تأكد من أن Frontend و Backend يعملان على نفس أو متقارب
```

### ❌ "Image Upload Failed"
```
✅ الحل:
1. تأكد من وجود مجلد backend/uploads/
2. تحقق من صيغة الصورة (JPG, PNG, WEBP)
3. لا تتجاوز 5MB
```

---

## الخطوات التالية

### 📈 تحسينات مستقبلية:

- [ ] إضافة نظام الدفع (Stripe/Paymob)
- [ ] نظام إدارة الطلبات
- [ ] تطبيق Mobile (iOS/Android)
- [ ] تحليلات وإحصائيات
- [ ] نظام التقييمات والمراجعات
- [ ] دعم لغات متعددة

---

## 📞 الدعم والمساعدة

تم بناء هذا المشروع بمعايير عالية وجاهز للإنتاج:

✅ Code Structure - نظيف وواضح  
✅ Security - متقدم وموثوق  
✅ Scalability - قابل للنمو  
✅ Performance - محسّن  

---

## 📄 الترخيص

© 2026 IT GIRL PILATES. جميع الحقوق محفوظة.

---

**مستعد للإطلاق! 🚀**
