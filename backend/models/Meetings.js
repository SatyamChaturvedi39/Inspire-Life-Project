import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    clientDetails: { type: Object, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "None" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  },{
    timestamps: true
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;