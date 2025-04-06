{/* //models/Appointment.js */}
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  comment: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  meetingType: {
    type: String,
    enum: ["policy", "career"],
    default: "policy",
  },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", default: null },
  // Use a unified ownerId field to indicate the agent/admin whose slot is booked.
  ownerId: { type: String, required: true },
  // Appointment statuses for actual bookings.
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled"],
    default: "Scheduled",
  },
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);