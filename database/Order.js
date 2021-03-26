const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    name : String

})

const ShopSchema = new mongoose.Schema({
    name : String,
    token: String,
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }]

})

module.exports = mongoose.model("Order",OrderSchema);
module.exports = mongoose.model("Shop",ShopSchema);