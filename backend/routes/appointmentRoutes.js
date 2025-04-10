{/* //routes/appointmentRoutes.js */}

import express from "express";
import { bookSlot, getAllSlots, updateSlotStatus } from "../controller/appointmentController.js";

const router = express.Router(); //new router object to define endpoints like get, put, post

router.get("/", getAllSlots);
router.post("/", bookSlot);
router.put("/update-status", updateSlotStatus);

export default router;
