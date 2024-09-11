const mongoose = require('mongoose');

const tokenModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresIn: {
        type: Date,
        required: true
    },
});

module.exports = mongoose.model('Token', tokenModel);