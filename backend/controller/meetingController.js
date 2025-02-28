import Meeting from "../models/Meetings.js";

export const bookSlot = async (req, res) => {
    try {
        const { name, phoneNumber, email, comment, date, time } = req.body;
        
        // Check if the slot is already booked
        const existingMeeting = await Meeting.findOne({ date, time });
        if (existingMeeting) {
            return res.status(400).json({ message: "Slot already booked!" });
        }
        
        // Create a new meeting
        const newMeeting = new Meeting({
            name,
            phoneNumber,
            email,
            comment,
            date,
            time,
            status: "Scheduled",
        });
        
        await newMeeting.save();
        res.status(201).json({ message: "Slot booked successfully!", newMeeting });
    } catch (error) {
        console.error("Error in bookSlot:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Updated Slot Status controller
export const updateSlotStatus = async (req, res) => {
    try {
        const { date, time, status } = req.body;
        
        if (!date || !time || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        // Find existing meeting
        let meeting = await Meeting.findOne({ date, time });
        
        // If status is "Available" and meeting exists and is "Booked", 
        // we should not allow changing booked slots to available
        if (meeting && meeting.status === "Booked" && status === "Available") {
            return res.status(400).json({ 
                message: "Cannot mark a booked slot as available. Cancel the booking first." 
            });
        }
        
        // If slot doesn't exist, create a new document
        if (!meeting) {
            meeting = new Meeting({ 
                date, 
                time, 
                status,
                // Add default values for required fields if your schema needs them
                name: "System Block", 
                phoneNumber: "N/A", // Set phoneNumber to "N/A" for agent changes
                email: "system@example.com"
            });
        } else {
            // Update existing meeting status
            meeting.status = status;
            // Ensure phoneNumber is set to "N/A" for agent changes
            meeting.phoneNumber = "N/A";
        }
        
        await meeting.save();
        
        res.status(200).json({ 
            message: "Slot status updated successfully!", 
            meeting 
        });
    } catch (error) {
        console.error("Error in updateSlotStatus:", error);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

export const getAllSlots = async (req, res) => {
    try {
        const { date } = req.query;
        let query = {};
        
        if (date) {
            query.date = date;
        }
        
        const meetings = await Meeting.find(query);
        res.status(200).json(meetings);
    } catch (error) {
        console.error("Error in getAllSlots:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};