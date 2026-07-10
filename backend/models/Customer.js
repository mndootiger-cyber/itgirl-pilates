import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'الرجاء إدخال الاسم الكامل'],
      trim: true,
      minlength: [3, 'الاسم يجب أن يكون 3 أحرف على الأقل'],
    },
    email: {
      type: String,
      required: [true, 'الرجاء إدخال البريد الإلكتروني'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'الرجاء إدخال بريد إلكتروني صحيح'],
    },
    phone: {
      type: String,
      required: [true, 'الرجاء إدخال رقم الهاتف'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'الرجاء إدخال كلمة المرور'],
      minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Customer', customerSchema);
