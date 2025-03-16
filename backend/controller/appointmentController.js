// models/Appointment.js, models/Policy.js, models/FreeSlot.js remain unchanged

import dayjs from "dayjs";
import Appointment from "../models/Appointment.js";
import Policy from "../models/Policy.js";
import FreeSlot from "../models/FreeSlot.js";

export const bookSlot = async (req, res) => {
  try {
    const { name, phoneNumber, email, comment, date, time, policyId, meetingType, ownerId } = req.body;
    
    // Determine finalOwnerId. For policy meetings, if not provided, derive from policy.
    let finalOwnerId = ownerId;
    if (!finalOwnerId && meetingType === "policy" && policyId) {
      const policy = await Policy.findById(policyId);
      if (!policy) {
        return res.status(400).json({ message: "Invalid policy id" });
      }
      finalOwnerId = policy.createdBy.toString();
    }
    
    if (!finalOwnerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }
    
    // Normalize the date to the start of the day.
    const normalizedDate = dayjs(date).startOf("day").toDate();
    
    // Check if an appointment already exists.
    const existingAppointment = await Appointment.findOne({
      date: normalizedDate,
      time,
      policyId,
      ownerId: finalOwnerId,
    });
    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked!" });
    }
    
    // Create the appointment.
    const newAppointment = new Appointment({
      name,
      phoneNumber,
      email,
      comment,
      date: normalizedDate,
      time,
      policyId: policyId || null,
      meetingType: meetingType || "policy",
      ownerId: finalOwnerId,
      status: "Scheduled",
    });
    
    await newAppointment.save();
    
    // Update or create the free slot record to "Booked".
    let freeSlot = await FreeSlot.findOne({
      ownerId: finalOwnerId,
      date: normalizedDate,
      time,
    });
    if (freeSlot) {
      freeSlot.status = "Booked";
      await freeSlot.save();
    } else {
      const newFreeSlot = new FreeSlot({
        ownerId: finalOwnerId,
        date: normalizedDate,
        time,
        status: "Booked",
        meetingType: meetingType || "policy", // stored for telegram differentiation if needed
      });
      await newFreeSlot.save();
    }
    
    res.status(201).json({ message: "Slot booked successfully!", newAppointment });
  } catch (error) {
    console.error("Error in bookSlot:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateSlotStatus = async (req, res) => {
  try {
    const { date, time, status, meetingType, policyId } = req.body;
    
    if (!date || !time || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Build the filter based on date, time, and optionally policyId.
    const filter = { date, time };
    if (policyId) {
      filter.policyId = policyId;
    }
    
    // Ensure that req.user exists (set by your auth middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No authenticated user" });
    }
    
    // Apply owner filtering: if admin then filter by adminId, if agent then by agentId.
    if (req.user.role === "admin") {
      filter.adminId = req.user.id;
    } else if (req.user.role === "agent") {
      filter.agentId = req.user.id;
    }
    
    // Default meetingType to "policy" if not provided.
    const mType = meetingType || "policy";
    
    // Try to find an existing appointment that matches the filter.
    let appointment = await Appointment.findOne(filter);
    
    // If an appointment exists and is booked, prevent marking it available.
    if (appointment && appointment.status === "Booked" && status === "Available") {
      return res.status(400).json({ 
        message: "Cannot mark a booked slot as available. Cancel the booking first." 
      });
    }
    
    if (!appointment) {
      // Create a new appointment if none exists.
      appointment = new Appointment({
        date,
        time,
        status,
        meetingType: mType,
        policyId: policyId || null,
        adminId: req.user.role === "admin" ? req.user.id : null,
        agentId: req.user.role === "agent" ? req.user.id : null,
        // Provide default values for required fields
        name: "System Block", 
        phoneNumber: "N/A",
        email: "system@example.com",
      });
    } else {
      // Update the existing appointment.
      appointment.status = status;
      appointment.phoneNumber = "N/A";
    }
    
    await appointment.save();
    res.status(200).json({ message: "Slot status updated successfully!", appointment });
  } catch (error) {
    console.error("Error in updateSlotStatus:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllSlots = async (req, res) => {
  try {
    const { date, policyId } = req.query;
    let query = { status: "Scheduled" }; // Only fetch booked slots
  
    if (date) {
      query.date = date;
    }
    if (policyId && policyId !== "all") {
      query.policyId = policyId;
    }
  
    const appointments = await Appointment.find(query);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error in getAllSlots:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
