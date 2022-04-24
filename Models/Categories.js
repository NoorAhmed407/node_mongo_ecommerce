const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    products: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Products'
        }
    ]
});

categorySchema.set('timestamps', true);

const Categories = mongoose.model('Categories', categorySchema);

module.exports = Categories;