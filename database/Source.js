const mongoose = require('mongoose');


const SourceSchema = new mongoose.Schema({
    name : String,
    source: String

})

module.exports = mongoose.model("Source",SourceSchema);