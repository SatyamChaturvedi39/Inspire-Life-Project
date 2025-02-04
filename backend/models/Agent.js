import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Policy" }],
 },{
    timestamps: true
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;