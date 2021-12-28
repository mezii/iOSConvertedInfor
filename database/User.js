const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: {
      default: false,
      type: Boolean

    },  
    isAuth: {
        default: false,
        type: Boolean
    },
    numberOfDevices:{
      type: Number,
      default: 0
    }

}) 

module.exports = mongoose.model('User',UserSchema);