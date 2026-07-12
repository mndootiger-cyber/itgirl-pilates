import Product from '../models/Product.js';

// Get all products inside collection
export const fetchAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ order: 1, createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error handling data fetch request.' });
    }
};

// Insert new luxury unit
export const createProductUnit = async (req, res) => {
    try {
        const { name, category, price, image, description, colors, colorImages, sizes } = req.body;
        // المنتج الجديد يظهر آخر الترتيب بشكل افتراضي
        const lastProduct = await Product.findOne({}).sort({ order: -1 });
        const nextOrder = lastProduct ? (lastProduct.order || 0) + 1 : 0;
        const newProduct = await Product.create({ name, category, price, image, description, colors, colorImages, sizes, order: nextOrder });
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data provided.' });
    }
};

// Update existing luxury unit
export const updateProductUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, image, description, colors, colorImages, sizes, order } = req.body;
        const updateData = { name, category, price, image, description, colors, colorImages, sizes };
        if (order !== undefined) updateData.order = order;
        const updated = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Item not found inside database.' });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data provided.' });
    }
};

// Delete luxury product unit
export const deleteProductUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await Product.findByIdAndDelete(id);
        if(!target) return res.status(404).json({ message: 'Item not found inside database.' });
        res.status(200).json({ success: true, message: 'Deleted successfully from collection.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error.' });
    }
};