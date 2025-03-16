import express from "express";
import { createMeeting, getMeetings, updateMeetingStatus } from "../controller/meetingController.js"; // Ensure this path is correct

const router = express.Router();

// Define the routes
router.post("/", createMeeting); // POST /api/meetings
router.get("/", getMeetings); // GET /api/meetings
router.put("/", updateMeetingStatus); // PUT /api/meetings (Update slot status)

export default router;
