var mongoose = require('mongoose');

module.exports = mongoose.model('Identity', {
    phone_number: {
        type: String
    },
    name: {
        type: String,
        default: ''
    },
    otp: {
        type: String
    }
});