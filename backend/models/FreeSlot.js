import mongoose from "mongoose";

const freeSlotSchema = new mongoose.Schema({
    SlotID: { type: Number, required: true, unique: true },
    AgentID: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    AdminID: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    Date: { type: Date, required: true },
    Time: { type: String, required: true },
    Available: { type: Boolean, default: true },
  },{
    timestamps: true
});

const Slot = mongoose.model('Slot', freeSlotSchema);

export default Slot;