const mongoose = require('mongoose');

const ComboSchema = new mongoose.Schema({
    product_code: String,
    name : String,
    price: Number,
    weight: Number,
    products: [{
       name: String,
       price: Number,
       weight: Number,
       product_code: Number
    }]
})

module.exports = mongoose.model('Combo',ComboSchema);