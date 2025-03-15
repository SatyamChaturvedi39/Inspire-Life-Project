import express from "express";
import { createMeeting, getMeetings } from "../controller/meetingController.js"; // Ensure this path is correct

const router = express.Router();

// Define the routes
router.post("/", createMeeting); // POST /api/meetings
router.get("/", getMeetings); // GET /api/meetings

export default router;