const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    validate: [validator.isEmail, 'Please Enter a valid Email'],
  },
  password: {
    type: String,
    // required: [true, 'Password is Required'],
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile No is Required'],
    unique: true,
    validate: {
      validator: function (value) {
       
        return /^[789]\d{9}$/.test(value);
      },
    }
  },
  address: {
    type: String,
    required: [true, 'Address is Required'],
  },

  token:{
    type:String,
    // default:'',
  },
  company:{
    type: Schema.Types.ObjectId,
    ref:"Company"
  },
  name:{
    type:String,
    required:[ true, 'Name is required']
  },
  workExp:{
    type:String,
    required:[true, 'work experience is required']
  },
  linkedinUrl: {
    type: String,
    required:[true, 'linkedin url is required']
  },
  userImg: {
    type: String
  },

  project: {
    type: String,
   
  },
  references: {
    type: String,
   
  },
  skill: {
    type: String,
   
  },
  education: {
    type: String,
   
  },
  objective:{
    type: String,
  }


});

userSchema.plugin(uniqueValidator);

// userSchema.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's provided
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});


userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

module.exports = mongoose.model('Users', userSchema);
