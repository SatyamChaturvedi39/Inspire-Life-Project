import mongoose from "mongoose";

const policyMeetingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["Scheduled", "Completed", "Cancelled", "Available", "Booked", "Unavailable"], 
      default: "Available" 
    },
    query: { type: String },
    policyName: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Explicitly set the collection name to "policy_meetings"
const PolicyMeeting = mongoose.model("PolicyMeeting", policyMeetingSchema, "policy_meetings");
export default PolicyMeeting;