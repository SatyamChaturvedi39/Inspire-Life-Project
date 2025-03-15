import express from "express";
import { registerEmployee, getAllAgents, getEmployeeById, updateEmployee, deleteEmployee } from "../controller/employeeController.js";
import Employee from "../models/Employee.js"; // Import Employee model

const router = express.Router();

// Employee registration
router.post("/register", registerEmployee);

// Get all admins (includes a list of all agents)
router.get("/admins", async (req, res) => {
  try {
    // Fetch all admins
    const admins = await Employee.find({ isAdmin: true });

    // Fetch all agents
    const agents = await Employee.find({ isAdmin: false });

    // Attach agents only for admins
    const updatedAdmins = admins.map((admin) => ({
      ...admin.toObject(),
      agents, // Add an "agents" field containing all agents
    }));

    res.status(200).json({
      message: "Admins fetched successfully",
      data: updatedAdmins,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
});

// Get all agents (only admins can do this)
router.get("/agents", getAllAgents);

// Get employee by ID
router.get("/:id", getEmployeeById);

// Update employee
router.put("/:id", updateEmployee);

// Delete employee
router.delete("/:id", deleteEmployee);

export default router;
