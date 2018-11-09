var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({        // Schema Property
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    userEmail: {type: String, required: true},
    paymentId: {type: String, required: true},                   // Stripe payment Id
    createdAt: {type: Date},
    completedOrder: {type: Boolean, required: true, default: false},
    completedAt: {type: Date}
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = {Order};