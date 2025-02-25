import express from "express";
import { bookSlot, getAllSlots } from "../controller/meetingController.js";

const router = express.Router();

router.get("/", getAllSlots); // Route to get all booked slots
router.post("/", bookSlot); // Route to book a new slot

export default router;
