import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    AdminID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    PasswordHash: { type: String, required: true },
    Policies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Policy" }],
 },{
    timestamps: true
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;