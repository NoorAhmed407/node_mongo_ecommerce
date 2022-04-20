const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    categoryId: {
        type: mongoose.Types.ObjectId, 
    },
    images: {
        type: [String],
        required: true
    },
});

productSchema.set('timestamps', true);
const Product = mongoose.model('Products', productSchema)