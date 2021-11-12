const mongoose = require('mongoose');


const RegionSchema = new mongoose.Schema({
    language : String,
    iso639: String,
    timezone: String
})

module.exports = mongoose.model("Region",RegionSchema);