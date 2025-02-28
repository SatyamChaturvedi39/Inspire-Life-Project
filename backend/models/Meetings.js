import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Removed unique: true
    email: { type: String },
    comment: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["Scheduled", "Completed", "Cancelled", "Available", "Booked", "Unavailable"], 
        default: "Available" 
    },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
}, {
    timestamps: true
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;