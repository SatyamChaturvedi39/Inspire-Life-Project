{/* //routes/policyRoutes.js */}

import express from 'express';
import { getPolicyBySlug, getPolicies, createPolicy, putPolicyBySlug, deletePolicyBySlug } from '../controller/policyController.js';
import { authenticateToken, authorizeMultipleRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getPolicies); // Fetch all policies
router.get("/:slug", getPolicyBySlug); // Fetch policy by slug

//Agents & Admin only
router.post("/", authenticateToken, authorizeMultipleRoles(["agent", "admin"]), createPolicy);// Agents and Admins can create policies
router.put("/:slug", authenticateToken, authorizeMultipleRoles(["agent", "admin"]), putPolicyBySlug);// Agents and Admins can update policies
router.delete("/:slug", authenticateToken, authorizeMultipleRoles(["agent", "admin"]), deletePolicyBySlug);// Agents and Admins can delete policies

export default router;