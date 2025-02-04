import Client from "../models/Client.js";

export const getClient = async (req, res) =>{
    try {
        const clients = await Client.find({});
        res.status(200).json({success:true, data:clients});
        } catch (error) {
            console.log("Error fetching Client details");
            res.status(500).json({success:false, message: "Server error" });
    }
}

export const createClient = async (req, res) => {
    const data = req.body; // Store all request data in a single variable

    if (!data.name || !data.phoneNumber) {
        return res.status(400).json({ success: false, message: "Name and Phone Number are required." });
    }
    if (!/^\d{10}$|^\d{13}$/.test(data.phoneNumber)) {
        return res.status(400).json({ success: false, message: "Phone number must be exactly 10 or 13 digits." });
    }

    try {
        const newClient = new Client(data);
        await newClient.save();
        res.status(201).json({ success: true, data: newClient });
    } catch (error) {
        console.error("Error creating client:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
