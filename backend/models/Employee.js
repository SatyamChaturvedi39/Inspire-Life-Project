import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // True for admin, false for agent
  policies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Policy" }], // Policies managed by agents
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Employee", EmployeeSchema);
