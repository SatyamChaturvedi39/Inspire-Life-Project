import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";

// Register a new employee (Admin or Agent)
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

    res.status(201).json({ message: "Employee registered successfully!", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error registering employee.", error: error.message });
  }
};

// Get all agents (Admin only)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Employee.find({ isAdmin: false });
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents.", error: error.message });
  }
};

// Get all employees (Admin only)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees.", error: error.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Employee ID format." });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee.", error: error.message });
  }
};


// Update employee details (Admin only)
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If updating password, hash it
    if (updateData.password && updateData.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
    }
    delete updateData.password; // Prevent accidental password reset

    const updatedEmployee = await Employee.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee updated successfully.", updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee.", error: error.message });
  }
};

// Delete an employee (Admin only)
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee.", error: error.message });
  }
};
