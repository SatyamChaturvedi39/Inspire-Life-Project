import mongoose from "mongoose";

const policyMeetingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    query: { type: String },
    policyName: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Explicitly set the collection name to "policy_meetings"
const PolicyMeeting = mongoose.model("PolicyMeeting", policyMeetingSchema, "policy_meetings");
export default PolicyMeeting;