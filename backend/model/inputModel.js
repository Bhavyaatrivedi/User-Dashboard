const mongoose = require('mongoose');


const inputSchema = new mongoose.Schema({
  name: {
    type: String,
    unique:true,
    required: [true, 'name is Required'],
  },
  
  value: {
    type: String,
    required: [true, 'value is Required'],
    
  },
  
});

module.exports = mongoose.model('input', inputSchema);
