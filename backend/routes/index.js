import express from 'express';
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to Inspire Life API!");
});

export default router;