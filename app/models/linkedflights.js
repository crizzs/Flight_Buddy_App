var mongoose = require('mongoose');

module.exports = mongoose.model('Linkedflight', {
    phone_number: {
        type: String
    },
    flight_no: {
        type: String
    },
    flying_date: {
        type: Date,
        default: '12/15/2017'
    },
    status:{
        type: String,
        default: 'Normal'
    }
});