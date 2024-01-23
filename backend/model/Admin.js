const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');


const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin_image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    syndicate_name: {
      type: String,
      required: false,
    },
    syndicate_fees: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
    },
    share_url:{
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    //   default: bcrypt.hashSync('12345678'),
    },
    role:{
      type:String,
      enum:['admin','sub_admin','syndicate'],
      default:'admin'
    },
    joiningData: {
      type: Date,
      required: false,
    },
    // permission_id:[{ type: mongoose.Types.ObjectId, ref: "Permission" }],
    // permission:[]
    permission_id:[{ type: mongoose.Types.ObjectId, ref: "Permission" }],
    syndicate_id:[{ type: mongoose.Types.ObjectId, ref: "Admin" }],
    investor_partner_id:[{ type: mongoose.Types.ObjectId, ref: "Investor" }],
    created_by:[{ type: mongoose.Types.ObjectId, ref: "Admin" }],
    updated_by:[{ type: mongoose.Types.ObjectId, ref: "Admin" }],
    is_email_sent:{
      type:String,
      enum:['Yes','No'],
      default:'No'
    },
    permission:[],
    is_super_admin:{
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);


const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

module.exports = Admin;
