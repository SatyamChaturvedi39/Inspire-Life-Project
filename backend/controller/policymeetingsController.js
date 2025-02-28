import PolicyMeeting from "../models/PolicyMeetings.js";

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