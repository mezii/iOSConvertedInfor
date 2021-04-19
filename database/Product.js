const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    product_code:{
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    value: Number,
    price: Number,
    weight: Number,
    height: Number,
    width: Number,
    long: Number,
    note: String

})

module.exports = mongoose.model('Product',ProductSchema);