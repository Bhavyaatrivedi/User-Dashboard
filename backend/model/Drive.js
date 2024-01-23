const mongoose = require('mongoose');


const driveSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    parent_id:{ type: mongoose.Types.ObjectId, ref: "Drive" },
    document_date:{ type: Date, default: ''},
    uploaded_by:{ type: mongoose.Types.ObjectId, ref: "Admin" },
    startup_deal_id: [{ type: mongoose.Types.ObjectId, ref: "StartupDeal" }],
    shared_users_id:[{ type: mongoose.Types.ObjectId, ref: "Admin" }],
    tags:[{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    is_file:{
      type:String,
      enum:['true','false'],
      default:'false'
    },
  },
  {
    timestamps: true,
  }
);



const Drive = mongoose.models.Drive || mongoose.model('drives', driveSchema);

module.exports = Drive;
