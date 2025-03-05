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
// mongoose will make it leads so always put singular and capitalised version i.e Lead in the above line of code

export default Lead;