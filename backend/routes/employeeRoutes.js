import express from "express";
import {
  registerEmployee,
  getAllAgents,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controller/employeeController.js";
import { authenticateToken, authorizeRole } from "../middlewares/authMiddleware.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// Employee registration (Admin only)
router.post("/register", authenticateToken, authorizeRole("admin"), registerEmployee);

// Get all employees (Admin only)
router.get("/", authenticateToken, authorizeRole("admin"), getAllEmployees);

// Get all agents (Admin only)
router.get("/agents", authenticateToken, authorizeRole("admin"), getAllAgents);

// Get all admins (Admin only)
router.get("/admins", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const admins = await Employee.find({ isAdmin: true });
    res.status(200).json({ message: "Admins fetched successfully", data: admins });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
});

// Get employee by ID (Admin only)
router.get("/:id", authenticateToken, authorizeRole("admin"), getEmployeeById);

// Update employee details (Admin only)
router.put("/:id", authenticateToken, authorizeRole("admin"), updateEmployee);

// Delete employee (Admin only)
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteEmployee);

export default router;
