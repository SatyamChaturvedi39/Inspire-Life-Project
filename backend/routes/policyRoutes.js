import express from 'express';
import { getPolicyBySlug, getPolicies, createPolicy, putPolicyBySlug } from '../controller/policyController.js';
const router = express.Router();

router.post("/", createPolicy); // Add a policy
router.get("/", getPolicies); // Fetch all policies
router.get("/:slug", getPolicyBySlug); // Fetch policy by slug
router.put("/:slug", putPolicyBySlug); // Fetch policy by slug

export default router;
