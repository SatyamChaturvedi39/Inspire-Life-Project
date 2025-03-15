import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// Register a new employee (admin or agent)
export const registerEmployee = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new employee
    const newEmployee = new Employee({ name, email, passwordHash, isAdmin });
    await newEmployee.save();

    res.status(201).json({ message: "Employee registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error registering employee.", error: error.message });
  }
};

// Get all agents (for admin)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Employee.find({ isAdmin: false });
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents.", error: error.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee.", error: error.message });
  }
};

// Update employee details
export const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json({ message: "Employee updated successfully.", updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee.", error: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee.", error: error.message });
  }
};
