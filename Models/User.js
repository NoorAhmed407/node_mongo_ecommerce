const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true ,
    },
    gender: {
        type: String,
        required: true,
        default: 'Male',
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    }
});

userSchema.set('timestamps', true);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
