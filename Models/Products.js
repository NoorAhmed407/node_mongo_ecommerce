const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Categories"
    },
    images: {
        type: [String],
        required: true
    },
});

productSchema.set('timestamps', true);
const Product = mongoose.model('Products', productSchema);

module.exports = Product;
