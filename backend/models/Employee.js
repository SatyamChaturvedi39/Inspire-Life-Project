import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Differentiates Admin & Agents
    policies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Policy" }], // Policies uploaded by the employee
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
