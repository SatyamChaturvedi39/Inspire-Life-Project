{/* //routes/dummytRoutes.js */}

import express from "express";

const router = express.Router();

router.get('/', (req,res) => {
    res.status(200).json({ message: "Backend warmed up"});
});

export default router