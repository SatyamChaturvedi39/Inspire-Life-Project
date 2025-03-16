import Meeting from "../models/Meetings.js";

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const { meetingType, name, phoneNumber, email, date, timeSlot, query, policyName, employeeId, status } = req.body;
    console.log("Request Body:", req.body);

    // Ensure 'status' has a default value if not provided
    const newMeeting = new Meeting({ 
      meetingType, 
      name, 
      phoneNumber, 
      email, 
      date, 
      timeSlot, 
      query, 
      policyName, 
      employeeId, 
      status: status || "Available" // Default to "Available" if not provided
    });

    await newMeeting.save();
    res.status(201).json({ message: "Meeting scheduled successfully!", meetingId: newMeeting._id });
  } catch (error) {
    res.status(500).json({ message: "Error scheduling meeting.", error: error.message });
  }
};

// Fetch all meetings (with optional filtering by status, employeeId, or date)
export const getMeetings = async (req, res) => {
  try {
    const { status, employeeId, date } = req.query; // Read filters from query params
    let filter = {};

    if (status) filter.status = status;
    if (employeeId) filter.employeeId = employeeId;
    if (date) filter.date = date;

    const meetings = await Meeting.find(filter);
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings.", error: error.message });
  }
};

// Update slot status (Ensures slot exists before updating)
export const updateMeetingStatus = async (req, res) => {
  try {
    const { employeeId, date, timeSlot, status } = req.body;

    // Find the existing slot
    const existingSlot = await Meeting.findOne({ employeeId, date, timeSlot });

    if (!existingSlot) {
      return res.status(404).json({ message: "Slot not found. Check employeeId, date, and timeSlot." });
    }

    // Update the status
    existingSlot.status = status;
    await existingSlot.save();

    res.status(200).json({ message: "Slot updated successfully", updatedSlot: existingSlot });
  } catch (error) {
    res.status(500).json({ message: "Error updating slot", error: error.message });
  }
};
