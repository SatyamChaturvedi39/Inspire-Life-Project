{/* //models/Lead.js */}
import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String },
    comment: { type: String}
  },{
    timestamps: true
});

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;