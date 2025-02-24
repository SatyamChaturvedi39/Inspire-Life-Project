import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String },
    comment: { type: String}
  },{
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
// mongoose will make it clients so always put singular and capitalised version i.e Client in the above line of code

export default Client;