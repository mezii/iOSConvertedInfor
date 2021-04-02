const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name : String,
    code: String,
    device: String,
    source: String,
    seller: String,
    customer: String,
    status: String,
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    }

})

module.exports = mongoose.model("Order",OrderSchema);
