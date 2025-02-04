import mongoose from "mongoose";

const freeSlotSchema = new mongoose.Schema({
    agentID: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    adminID: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    available: { type: Boolean, default: true },
  },{
    timestamps: true
});

const Slot = mongoose.model('Slot', freeSlotSchema);

export default Slot;