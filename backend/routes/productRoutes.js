import express from 'express';
import { fetchAllProducts, createProductUnit, deleteProductUnit } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(fetchAllProducts)
    .post(protect, createProductUnit);

router.route('/:id')
    .delete(protect, deleteProductUnit);

// مسار رفع الصور (مستقل لسرعة الاستجابة)
router.post('/upload', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'لم يتم استلام أي صورة' });
    }
    const imagePath = `/${req.file.path.replace(/\\/g, "/")}`;
    res.json({ path: imagePath });
});

export default router;