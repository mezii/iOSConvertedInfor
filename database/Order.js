const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
     orderId: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
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
       
        use_return_address: 0,

    }, status: String,
    date: String,
    source: String,
    ghtk_id: String,
    shopToken: String,
    shopName: String,
    note: String,
    kiotvietId: String,
    endUserName: String

})

module.exports = mongoose.model("Order",OrderSchema);
