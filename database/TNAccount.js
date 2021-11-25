//cradikakelly2131974@mail.ru|Vn@12345n|client_id|4632055150|radikakelly2131974|connect.sid=s%3AUeq0LJ5wiK1F30YHtP7jNFBCMyIHTYqi.VJ2DEJGQ4UPF4DLATcN4uO%2BFV%2BKMl%2Frgr0kJ6226rV0


const mongoose = require('mongoose');


const TNAccountSchema = new mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    clientId: String,
    device:  mongoose.Schema.Types.ObjectId,
    numberPhone: String,
    cookie: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
   

})

module.exports = mongoose.model('TNAccount',TNAccountSchema);