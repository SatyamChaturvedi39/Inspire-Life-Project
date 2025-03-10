import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  policyName: { type: String, required: true },
}, { timestamps: true });

const Client = mongoose.model("Client", ClientSchema);

export default Client;
