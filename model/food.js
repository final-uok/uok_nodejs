const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    philanthropist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    charity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

    isReserved: {
        type: Boolean,
        default: false,
        required: true
    },

    createAt: {
        type: String,
        default: new Date().getTime()
    },

    reserveAt: {
        type: String,
        required: false
    },

    receivedQueue: {
        type: [String],
        required: false
    },

    foodCode: {
        type: Number,
        required: true
    },

    foodList: [
        {
            name: {type: String, required: true},
            count: {type: Number, required: true}
        }
    ]
});

module.exports = mongoose.model('Food', foodSchema);