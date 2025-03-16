// models/FreeSlot.js
import mongoose from "mongoose";

const freeSlotSchema = new mongoose.Schema({
  ownerId: { type: String, required: true },
  meetingType: { type: String, enum: ["policy", "career"], default: "policy" },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  // Slot statuses used for availability management.
  status: {
    type: String,
    enum: ["Available", "Booked", "Unavailable"],
    default: "Available",
  }
}, { timestamps: true, collection: "freeSlots" });

export default mongoose.model("FreeSlot", freeSlotSchema);