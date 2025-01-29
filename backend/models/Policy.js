import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
    PolicyID: {type: Number, required:true, unique:true },
    PolicyName: {type: String, required:true},
    PolicyDescription: {type: String, required:true},
    AgentID: {type: mongoose.Schema.Types.ObjectId, ref: "Agent"}
  },{
    timestamps: true
});

const Policy = mongoose.model('Meeting', meetingSchema);

export default Policy;