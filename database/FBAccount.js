//100075240889198|Hthienngo!!060|c_user=100075240889198; xs=43:RBi-U7IAeln8TA:2:1638054333:-1:-1; fr=0DF56FqKMtSk8A3eG.AWVVgA0n2V6VxGVe17xJ0qI2kJc.Bhorm9.XK.AAA.0.0.Bhorm9.AWXCoG-8erw; datr=sbmiYWJFAFwv6y_LUB3Zg7BS; oo=|+13108113130|EAAAAUaZA8jlABABrDs5JW9khgZBhzDJQCnYyx2yunjuFFzcog8yz2l9InLO30GlL5PZCbwcxTGPZBqagW7RWTWFgTZAbBErJzQTbwRwA1qJ7kKsh79xIBS3xpbmk1MZAkYdpF3YLVYoolRGC1WKbXZA7DmaJYMC2eOZC4D0QFcnBcAaZBqju750NQ9Fxb7CgnFAMZD


const mongoose = require('mongoose');


const FBAccountSchema = new mongoose.Schema({
   
    uid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cookie: {
        type: String,
        required: true,
    },
    qrcode: {
        type: String
    },
    isExported:{
        type: Boolean,
        default: false
    },
    status:{
        type: String,
        default: "_",
        required: true
    },
    lastUpdated:{
        type: Date,
        default: new Date()
    },
    created:{
        type: Date, 
        default: new Date()
    }

})

module.exports = mongoose.model('FBAccount',FBAccountSchema);