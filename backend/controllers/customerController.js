import Customer from '../models/Customer.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'الرجاء ملء جميع الحقول المطلوبة' });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }

    // Create new customer
    const customer = await Customer.create({
      fullName,
      email,
      phone,
      password,
    });

    // Generate token
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح',
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطأ في التسجيل',
    });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
    }

    // Find customer and include password field
    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    // Generate token
    const token = generateToken(customer._id);

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الملف الشخصي',
    });
  }
};
