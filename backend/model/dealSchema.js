const mongoose = require('mongoose')

const dealUnitChangesSchema = new mongoose.Schema({
    trancheName: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    investorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Investor" }],
    transactionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    updatedDate: { type: Date, default: Date.now },
    createdDate: { type: Date, default: Date.now },
    type: { type: String, required: false },
    comment: { type: String, required: false },
    unitValue: { type: String, required: false },
    trancheId: { type: String, required: false }
  });

  module.exports = dealUnitChangesSchema;