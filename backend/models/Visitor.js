// models/Visitor.js
import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Visitor", visitorSchema);