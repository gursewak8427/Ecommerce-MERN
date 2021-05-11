const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    orders: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
});

module.exports = Vendor = mongoose.model('vendor', VendorSchema);