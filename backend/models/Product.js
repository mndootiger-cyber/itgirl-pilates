import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['clothing', 'equipment'] },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    colors: {
        type: [String],
        default: [],
        enum: [
            'Black', 'White', 'Charcoal', 'Graphite', 'Ivory', 'Grey',
            'BrightRed', 'Burgundy', 'WineRed', 'CoralRed',
            'HotPink', 'BabyPink', 'OrchidPink', 'DustyMauve',
            'Beige', 'LightGray', 'CharcoalGray',
            'RoyalBlue', 'SkyBlue', 'NavyBlue', 'OliveGreen',
        ],
    },
    colorImages: {
        type: Object,
        default: {},
    },
    sizes: {
        type: [String],
        default: [],
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;