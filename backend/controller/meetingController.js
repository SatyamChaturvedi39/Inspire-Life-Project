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
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  //get all slots
  export const getAllSlots = async (req, res) => {
    try {
      const { date } = req.query; // Get the date from query params
      let query = {};

      if (date) {
        query.date = date; // Only fetch meetings for the selected date
      }

      const meetings = await Meeting.find(query);
      res.status(200).json(meetings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

  