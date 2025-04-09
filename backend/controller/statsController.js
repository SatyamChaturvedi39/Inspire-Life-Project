{/* //controller/statsController.js */}

import Visitor from "../models/Visitor.js";

export const trackVisitor = async (req, res) => {
    try {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const recentVisitor = await Visitor.findOne({
            ip,
            timestamp: { $gt: fiveMinutesAgo },
        });

        // Only count if no recent visit
        if (!recentVisitor) {
            await Visitor.create({ ip, userAgent });
        }

        res.status(200).json({ success: true });
        } catch (err) {
        res.status(500).json({ message: "Failed to track visitor" });
        }
};

export const getVisitors = async (req, res) => {
    try {
        const count = await Visitor.countDocuments();
        res.json({ count });
      } catch (err) {
        res.status(500).json({ message: "Failed to get visitor count" });
      }
};