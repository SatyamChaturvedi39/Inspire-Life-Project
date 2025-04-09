{/* //controller/leadController.js */}

import Lead from "../models/Lead.js";

export const getLead = async (req, res) =>{
    try {
        const leadss = await Lead.find({});
        res.status(200).json({success:true, data:leads});
        } catch (error) {
            console.log("Error fetching Lead details");
            res.status(500).json({success:false, message: "Server error" });
    }
};

export const createLead = async (req, res) => {
    const data = req.body; // Store all request data in a single variable

    if (!data.name || !data.phoneNumber) {
        return res.status(400).json({ success: false, message: "Name and Phone Number are required." });
    }
    if (!/^\d{10}$|^\d{13}$/.test(data.phoneNumber)) {
        return res.status(400).json({ success: false, message: "Phone number must be exactly 10 or 13 digits." });
    }

    try {
        const newLead = new Lead(data);
        await newLead.save();
        res.status(201).json({ success: true, data: newLead });
    } catch (error) {
        console.error("Error creating Lead:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getRecentLeads = async (req, res) => {
    try {
      // Calculate the date 7 days ago
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
      // Find leads with createdAt greater than or equal to oneWeekAgo, sorted by newest first.
      const leads = await Lead.find({ createdAt: { $gte: oneWeekAgo } }).sort({ createdAt: -1 });
      res.json({ success: true, data: leads });
    } catch (error) {
      console.error("[GetRecentLeads] Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
