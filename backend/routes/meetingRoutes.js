import express from "express";
import { bookSlot, getAllSlots } from "../controller/meetingController.js";

const router = express.Router();

router.post("/", bookSlot); // Route to book a new slot
router.get("/", getAllSlots); // Route to get all booked slots

export default router;
