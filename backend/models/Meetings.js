import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  meetingType: { type: String, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // Ensure this field is correct
  query: { type: String, required: true },
  policyName: { type: String },
  agentId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Meeting", MeetingSchema);