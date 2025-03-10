import Agent from "../models/Agent.js";
import bcrypt from "bcrypt";

// Create a new agent (Admin power)
export const createAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("[CreateAgent] Attempting to create agent with email:", email);

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    // Check if the agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      console.error("[CreateAgent] Agent already exists with email:", email);
      return res.status(400).json({ success: false, message: "Agent already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newAgent = new Agent({ name, email, passwordHash });
    await newAgent.save();
    console.log("[CreateAgent] Agent created successfully:", newAgent);
    res.status(201).json({ success: true, data: newAgent });
  } catch (error) {
    console.error("[CreateAgent] Error creating agent:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get the list of all agents (Admin power)
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json({ success: true, data: agents });
  } catch (error) {
    console.error("[GetAgents] Error fetching agents:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update an agent (Admin power)
// Password update is optional. If provided and non-empty, it will be updated.
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.password && updateData.password.trim() !== "") {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(updateData.password, saltRounds);
    }
    // Remove password field from updateData to avoid accidentally setting it to empty string
    delete updateData.password;
    
    const updatedAgent = await Agent.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!updatedAgent) {
      console.error("[UpdateAgent] Agent not found for id:", id);
      return res.status(404).json({ success: false, message: "Agent not found" });
    }
    console.log("[UpdateAgent] Agent updated successfully:", updatedAgent);
    res.json({ success: true, data: updatedAgent });
  } catch (error) {
    console.error("[UpdateAgent] Error updating agent:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete an agent (Admin power)
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAgent = await Agent.findByIdAndDelete(id);
    if (!deletedAgent) {
      console.error("[DeleteAgent] Agent not found for id:", id);
      return res.status(404).json({ success: false, message: "Agent not found" });
    }
    console.log("[DeleteAgent] Agent deleted successfully:", deletedAgent);
    res.json({ success: true, message: "Agent deleted successfully", data: deletedAgent });
  } catch (error) {
    console.error("[DeleteAgent] Error deleting agent:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
