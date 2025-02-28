import express from "express";
import { bookSlot, getAllSlots, updateSlotStatus } from "../controller/meetingController.js";

const router = express.Router();

router.get("/", getAllSlots); // Route to get all booked slots
router.post("/", bookSlot); // Route to book a new slot
router.put("/update-status", updateSlotStatus); // Route to update slot status ✅

export default router;
