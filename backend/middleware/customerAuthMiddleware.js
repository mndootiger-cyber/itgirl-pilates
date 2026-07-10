import jwt from 'jsonwebtoken';

export const customerAuthMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'الرجاء تسجيل الدخول أولاً' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customerId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'انتهت صلاحية الرمز' });
    }
    res.status(401).json({ message: 'رمز غير صحيح' });
  }
};
