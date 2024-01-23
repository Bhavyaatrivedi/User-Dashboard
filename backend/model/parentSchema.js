const mongoose = require('mongoose');
const dealUnitChangesSchema = require('./dealSchema'); 
const parentSchema = new mongoose.Schema({
  name: { type: String },
  amount: { type: String },
  gst: { type: String },
  dealUnitChanges: [dealUnitChangesSchema] 
});



module.exports = mongoose.model('Parent', parentSchema);