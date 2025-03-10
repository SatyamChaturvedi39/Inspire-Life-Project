import express from "express";
import { getClients, createClient } from "../controllers/clientController.js";

const router = express.Router();

router.get("/clients", getClients);  // Fetch all clients
router.post("/clients", createClient);  // Add a new client

export default router;
