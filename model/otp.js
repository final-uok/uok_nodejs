const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },

    otp: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Otp', otpSchema);
