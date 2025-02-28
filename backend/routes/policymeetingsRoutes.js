import express from "express";
import { scheduleAppointment } from "../controller/policymeetingsController.js";

const router = express.Router();

// Route to schedule an appointment
router.post("/appointments", scheduleAppointment);

export default router;