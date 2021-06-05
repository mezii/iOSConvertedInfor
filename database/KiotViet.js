const mongoose = require('mongoose');


// "id": 43742,
// "userName": "baotran",
// "givenName": "Lê Thị Bảo Trân",
// "retailerId": 946467,
// "createdDate": "2021-05-23T19:00:26.1100000"
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