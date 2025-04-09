{/* //controller/freeSlotController.js */}

import FreeSlot from "../models/FreeSlot.js";
import Appointment from "../models/Appointment.js";
import dayjs from "dayjs";

export const getFreeSlots = async (req, res) => {
  try {
    const { ownerId, date } = req.query;
    let query = {};
    if (ownerId) query.ownerId = ownerId;
    if (date) {
      const normalizedDate = dayjs(date).startOf("day").toDate();
      query.date = normalizedDate;
    }
    // Ignore meetingType and policyId for filtering.
    const freeSlots = await FreeSlot.find(query);
    res.status(200).json({ success: true, data: freeSlots });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};


export const updateFreeSlot = async (req, res) => {
  try {
    const { ownerId, date, time, status, meetingType } = req.body;
    if (!ownerId || !date || !time || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Normalize the date to the start of the day.
    const normalizedDate = dayjs(date).startOf("day").toDate();

    // Find existing free slot record by ownerId, normalized date, and time.
    let freeSlot = await FreeSlot.findOne({ ownerId, date: normalizedDate, time });
    
    if (!freeSlot) {
      // If none exists, create one.
      freeSlot = new FreeSlot({
        ownerId,
        date: normalizedDate,
        time,
        status,
        meetingType: meetingType || "career",
      });
      await freeSlot.save();
    } else {
      // Otherwise, update its status (and meetingType if provided).
      freeSlot.status = status;
      if (meetingType) {
        freeSlot.meetingType = meetingType;
      }
      await freeSlot.save();
    }
    
    // If the new status is not "Booked", then cancel any active (Scheduled) appointment for that slot.
    if (status !== "Booked") {
      await Appointment.updateOne(
        { ownerId, date: normalizedDate, time, status: "Scheduled" },
        { status: "Cancelled" }
      );
    }
    
    return res.status(200).json({ success: true, data: freeSlot });
  } catch (error) {
    console.error("Error updating free slot:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Initialize free slots for a new owner (agent/admin) without duplicating existing slots.
export const initializeFreeSlots = async (req, res) => {
  try {
    const { ownerId, meetingType } = req.body;
    const defaultTimes = [
      "09:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 01:00 PM",
      "01:00 PM - 02:00 PM",
      "02:00 PM - 03:00 PM",
      "03:00 PM - 04:00 PM",
      "04:00 PM - 05:00 PM",
    ];

    const today = new Date();
    const slots = [];

    // Generate slots for the next 30 days.
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      for (const time of defaultTimes) {
        // Check if the slot already exists.
        const existing = await FreeSlot.findOne({ ownerId, meetingType, date, time });
        if (!existing) {
          slots.push({
            ownerId,
            meetingType,
            date,
            time,
            status: "Available",
          });
        }
      }
    }

    if (slots.length > 0) {
      await FreeSlot.insertMany(slots);
      res.status(201).json({ success: true, message: "Free slots initialized" });
    } else {
      res.status(200).json({ success: true, message: "Free slots already initialized" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error initializing slots", error: error.message });
  }
};