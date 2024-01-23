const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const CheckListMasterSchema = new mongoose.Schema(
  {
    template_name: {
      type: String,
      required: true,
    },
    tasks: [],
    checklist_type:{
      type:String,
      enum:['deal','startup'],
      default:'deal'
    },
    checklist_period:{
      type:String,
      enum:['monthly','quarterly','onetime'],
      default:'onetime'
    },
    updated_by:{ type: mongoose.Types.ObjectId, ref: "Admin" },
    created_by:{ type: mongoose.Types.ObjectId, ref: "Admin" }
  },
  {
    timestamps: true,
  }
)

const CheckListMaster = mongoose.models.CheckListMaster || mongoose.model('checklist_masters', CheckListMasterSchema);
module.exports = CheckListMaster;
