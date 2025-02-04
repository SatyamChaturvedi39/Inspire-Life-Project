import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
    policyName: {type: String, required:true},
    policyDescription: {type: String, required:true},
    agentId: {type: mongoose.Schema.Types.ObjectId, ref: "Agent"}
  },{
    timestamps: true
});

const Policy = mongoose.model('Meeting', meetingSchema);

export default Policy;