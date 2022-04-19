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

    password: {
        type: String,
        required: true,
        minlength: 8,
    }, 

    gender: {
        type: String,
        required: true,
        default: 'Male',
    },
    
    role: {
        type: Number,
        required: true,
        default: 2,
    }
});

userSchema.set('timestamps', true);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
