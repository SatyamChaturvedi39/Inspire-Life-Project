import Meeting from "../models/Meetings.js";

// Create a new meeting
export const createMeeting = async (req, res) => {
  try {
    const { meetingType, name, phoneNumber, email, date, timeSlot, query, policyName, agentId } = req.body;
    console.log("Request Body:", req.body);
    const newMeeting = new Meeting({ meetingType, name, phoneNumber, email, date, timeSlot, query, policyName, agentId });
    await newMeeting.save();

    res.status(201).json({ message: "Meeting scheduled successfully!", meetingId: newMeeting._id });
  } catch (error) {
    res.status(500).json({ message: "Error scheduling meeting.", error:error.message });
  }
};

// Fetch all meetings
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings.", error });
  }
};