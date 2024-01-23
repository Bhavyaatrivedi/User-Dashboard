const mongoose = require('mongoose');



const startupDealSchema = new mongoose.Schema(
  {
    
    startup_id: { type: mongoose.Types.ObjectId, ref: "Startup" },
    


 
    logs: [{
        task_ids: [{
            type: mongoose.Types.ObjectId
        }],
        drive_ids: [{
            type: mongoose.Types.ObjectId
        }],
        activity_type: {
            type: String,
            enum: ['Deleted', 'Used', 'Created', 'Removed'],
            default: "Created"
        },
        type: {
            type: String,
            enum: ['Deal', 'StartUp', 'Checklist'],
            default:"Checklist"
        },
        document_date: {
            type: String,
            required:false
        },
        created_by: [{ type: mongoose.Types.ObjectId, ref: "Admin" }],
        updated_by: [{ type: mongoose.Types.ObjectId, ref: "Admin" }],
        created_date: { type: Date, default: new Date() },
        updated_date: { type: Date, default: new Date() }
    }],
    created_by:[{ type: mongoose.Types.ObjectId, ref: "Admin" }],
    updated_by:[{ type: mongoose.Types.ObjectId, ref: "Admin" }]
  },
  {
    timestamps: true,
  }
);




const StartupDeal = mongoose.models.StartupDeal || mongoose.model('Startup_deal', startupDealSchema);

module.exports = StartupDeal;
