const mongoose = require('mongoose');


const {Schema } = mongoose;


const DeviceSchema = new Schema({
    deviceToken: String,
    date: { type: Date, default: Date.now },
    isActive: Boolean,
    userToken: String
}) 

module.exports = mongoose.model("Device",DeviceSchema);