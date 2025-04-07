import express from "express";

const router = express.Router();

router.get('/dummy', (req,res) => {
    res.status(200).json({ message: "Backend warmed up"});
});

export default router