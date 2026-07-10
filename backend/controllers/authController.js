import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// توليد توكن JWT صالح لمدة 30 يوم
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    تسجيل دخول الأدمن
// @route   POST /api/auth/login
// @access  Public
export const authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    }

    res.json({
      token: generateToken(admin._id),
      admin: {
        _id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('[Auth] authAdmin error:', error);
    res.status(500).json({ message: 'حدث خطأ في السيرفر' });
  }
};
