const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema


const companySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Company Name is Required'],
    unique: true,
    
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    validate: [validator.isEmail, 'Please Enter a valid Email'],
  },
  aadhar: {
    type: String,
    required: [true, 'aadhar number is Required'],
  },
  gst: {
    type: String,
    required: [true, 'gst number is Required'],
  },
  pan: {
    type: String,
    required: [true, 'pan No is Required'],
  },
  address: {
    type: String,
    required: [true, 'Address is Required'],
  },
  token:{
    type:String,
    // default:'',
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: "Users"
  }],
});



module.exports = mongoose.model('Company', companySchema);
