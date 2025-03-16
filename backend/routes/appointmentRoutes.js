// routes/appointmentRoutes.js
import express from "express";
import { bookSlot, getAllSlots, updateSlotStatus } from "../controller/appointmentController.js";

const router = express.Router();

router.get("/", getAllSlots);
router.post("/", bookSlot);
router.put("/update-status", updateSlotStatus);

export default router;
