const mongoose = require('mongoose');
const Product = require('./Product').schema;
const OrderSchema = new mongoose.Schema({
    orderId: String,
    products: [Product],
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    order:{
        id: String,
        pick_name: String,
        pick_money: Number,
        pick_address: String,
        pick_district: String,
        pick_province: String,
        pick_ward: String,
        pick_tel: String,
        pick_email: String,
        tel: String,
        name: String,
        address:String,
        province: String,
        ward: String,
        district: String,
        street: String,
        email: String,
        is_freeship: String,
        note: String,
        value: Number,
        transport: String,
        use_return_address: 0,
<<<<<<< HEAD

    }, 
    status: String,
    date: String,
    source: String,
    endUserName:String
    
=======
        weight_option: String,
        hamlet: String
    },
    status: String,
    date: String,
    source: String,
    ghtk_id: String,
    shopToken: String,
    shopName: String,
    note: String,
    kiotvietId: Number,
    endUserName: String,
    lastUpdatedGHTK: String,
    chietkhau: Number,
    datcoc: Number,
    tongtien: Number,
    tienship: Number
>>>>>>> c27b447220de599699b48f20e93e54ee46213a9b

})

module.exports = mongoose.model("Order",OrderSchema);
