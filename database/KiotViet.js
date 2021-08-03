const mongoose = require('mongoose');

const KiotVietSchema = new mongoose.Schema({
    name : String,
    client_id: String,
    client_secret: String,
    accounts: [{
        id: Number,
        userName: String,
        givenName: String,
        retailerId: Number,
        createdDate: String

    }],
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    combos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Combo'}]

})

module.exports = mongoose.model("KiotViet",KiotVietSchema);