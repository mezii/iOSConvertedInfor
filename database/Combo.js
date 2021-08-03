const mongoose = require('mongoose');

const ComboSchema = new mongoose.Schema({
    product_code: Number,
    name : String,
    price: Number,
    weight: Number,
    quantity: Number,
    products: [{
       name: String,
       price: Number,
       weight: Number,
       product_code: Number
    }],
    kiotvietId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KiotViet"
    }
})

module.exports = mongoose.model('Combo',ComboSchema);