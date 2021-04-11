const mongoose = require('mongoose');


const StoreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    email: String,
    repName: String,
    date: String,
    source: String,
    address: String,
    province: String,
    district: String,
    ward: String
   

})

module.exports = mongoose.model('Store',StoreSchema);