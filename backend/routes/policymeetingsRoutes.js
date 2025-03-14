import express from "express";
import { scheduleAppointment, getPolicies } from "../controller/policymeetingsController.js";

const router = express.Router();

// Route to get policies
router.get("/", getPolicies);

// Route to schedule an appointment
router.post("/appointments", scheduleAppointment);

export default router;