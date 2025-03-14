import PolicyMeeting from "../models/PolicyMeetings.js";

// Fetch all policies
export const getPolicies = async (req, res) => {
  try {
    // Fetch all policies from the database
    const policies = await PolicyMeeting.find();
    res.status(200).json(policies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ message: "Error fetching policies" });
  }
};

// Schedule a new appointment
export const scheduleAppointment = async (req, res) => {
  try {
    const { name, phoneNumber, email, date, timeSlot, query, policyName } = req.body;

    // Create a new appointment
    const newAppointment = new PolicyMeeting({
      name,
      phoneNumber,
      email,
      date,
      timeSlot,
      query,
      policyName,
    });

    // Save the appointment to the database
    await newAppointment.save();

    // Send success response
    res.status(201).json({ message: "Appointment scheduled successfully" });
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    res.status(500).json({ message: "Error scheduling appointment" });
  }
};