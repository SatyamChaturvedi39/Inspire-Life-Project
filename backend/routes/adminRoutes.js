{/* //routes/adminRoutes.js */}

import express from "express";
import {createAgent,getAgents,updateAgent,deleteAgent,} from "../controller/adminController.js";
import { authenticateToken, authorizeRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, authorizeRole("admin"), getAgents);
router.post("/", authenticateToken, authorizeRole("admin"), createAgent);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateAgent);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteAgent);


export default router;
