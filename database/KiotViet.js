const mongoose = require('mongoose');


const KiotVietSchema = new mongoose.Schema({
    name : String,
    client_id: String,
    client_secret: String

   
})

module.exports = mongoose.model("KiotViet",KiotVietSchema);