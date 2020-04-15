const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        maxLength: [10, 'name can not be more than 10'],
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        maxLength: [11, 'phone can not more than 11']
    },

    address: {
        type: String,
        required: false
    },

    userType: { // 0 for charity and 1 for philanthropist
        type: Number,
        required: true
    },

    foods: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
            required: false
        }
    ]
});

module.exports = mongoose.model('User', userSchema);