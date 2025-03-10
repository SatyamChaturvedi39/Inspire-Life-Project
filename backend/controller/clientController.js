import Client from "../models/Client.js"; // Import the model

// Get all clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new client
export const createClient = async (req, res) => {
  try {
    const { name, email, phoneNumber, policyName } = req.body;
    const newClient = new Client({ name, email, phoneNumber, policyName });

    await newClient.save();
    res.status(201).json({ message: "Client created successfully!", newClient });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
