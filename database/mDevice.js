const mongoose = require('mongoose');




const mDeviceSchema = new mongoose.Schema({
   serial: {
       type: String,
       required: true,
       unique: true
   },
   socketId: {
       type: String,
       default: "None"
   },
   isConnected: {
       type: Boolean,
       default: false
   },
   isActive: {
       type: Boolean,
       default: false
   },
   expiredDate: {
       type: Date, 
       default: Math.floor(new Date().getTime() / 1000)
   },
   email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
   },
}) 

module.exports = mongoose.model("mDevice",mDeviceSchema);