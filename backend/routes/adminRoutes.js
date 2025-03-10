import express from "express";
import {
  createAgent,
  getAgents,
  updateAgent,
  deleteAgent,
  
} from "../controller/adminController.js";

const router = express.Router();

router.get("/", getAgents);
router.post("/", createAgent);
router.put("/:id", updateAgent);
router.delete("/:id", deleteAgent);


export default router;
