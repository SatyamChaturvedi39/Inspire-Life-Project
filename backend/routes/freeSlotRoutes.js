{/* //routes/freeSlotRoutes.js */}

import express from "express";
import { getFreeSlots, updateFreeSlot, initializeFreeSlots } from "../controller/freeSlotController.js";

const router = express.Router();

router.get("/", getFreeSlots);
router.put("/update", updateFreeSlot);
router.post("/initialize", initializeFreeSlots);

export default router;