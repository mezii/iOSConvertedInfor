const mongoose = require('mongoose');

const ScriptSchema = new mongoose.Schema({
   name: String,
   group: String,
   type: String,
   content: {
       data: Buffer,
       contentType: String
   }
})

module.exports = mongoose.model("Script",ScriptSchema);




