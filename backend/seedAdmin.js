/**
 * سكريبت تشغيل لمرة واحدة لإنشاء حساب أدمن أول
 * الاستخدام: node seedAdmin.js
 */

import dotenv from 'dotenv';
import connectDatabase from './config/db.js';
import Admin from './models/Admin.js';

dotenv.config();

// ⚠️ غيّر البريد وكلمة المرور دول قبل التشغيل
const ADMIN_EMAIL = 'admin@amsport.com';
const ADMIN_PASSWORD = 'ChangeThisPassword123';

const run = async () => {
  await connectDatabase();

  const exists = await Admin.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    console.log('⚠️  الحساب ده موجود بالفعل بنفس البريد:', ADMIN_EMAIL);
    process.exit(0);
  }

  const admin = new Admin({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD, // هيتشفر أوتوماتيك عن طريق pre('save') في Admin.js
  });

  await admin.save();
  console.log('✅ تم إنشاء حساب الأدمن بنجاح!');
  console.log('البريد:', ADMIN_EMAIL);
  console.log('كلمة المرور:', ADMIN_PASSWORD);
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ حصل خطأ:', err);
  process.exit(1);
});
