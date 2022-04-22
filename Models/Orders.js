const mongoose = require('mongoose');


const orderDetailSchema = new mongoose.Schema({
    productId: mongoose.Types.ObjectId,
    quantity: Number,
})

const orderSchema = new mongoose.Schema({
    orderedBy: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
    },
    orderDetail: {
        type: [orderDetailSchema],
        required: true,
    }
});


orderSchema.set('timestamps', true);

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;