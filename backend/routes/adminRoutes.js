import express from "express";
import { createAgent, getAgents, updateAgent, deleteAgent } from "../controller/adminController.js";
import { authenticateToken, authorizeRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes below; only accessible by admin
router.use(authenticateToken);
router.use(authorizeRole("admin"));

router.post("/agents", createAgent);
router.get("/agents", getAgents);
router.put("/agents/:id", updateAgent);
router.delete("/agents/:id", deleteAgent);

export default router;