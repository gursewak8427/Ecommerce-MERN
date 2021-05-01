const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    cart: [mongoose.Schema.Types.Mixed],
    orders: [mongoose.Schema.Types.Mixed],
});

module.exports = User = mongoose.model('user', UserSchema);