import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    MeetingID: { type: Number, required: true, unique: true },
    ClientID: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    ClientDetails: { type: Object, required: true },
    Date: { type: Date, required: true },
    Time: { type: String, required: true },
    Status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "None" },
    AdminID: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    AgentID: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  },{
    timestamps: true
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;