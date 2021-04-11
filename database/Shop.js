const mongoose = require('mongoose');


const ShopSchema = new mongoose.Schema({
    name : String,
    token: String,
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]

})

module.exports = mongoose.model("Shop",ShopSchema);