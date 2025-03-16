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
  employeeId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Scheduled", "Available", "Unavailable"],  
    default: "Available" 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Meeting", MeetingSchema);