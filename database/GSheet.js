const mongoose = require('mongoose');


const GSheetSchema = new mongoose.Schema({
    name : String,
    id: String,
   
})

module.exports = mongoose.model("GSheet",GSheetSchema);