import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String },
    comment: { type: String},
    age: { type: Number },
    dob: { type: Date },
    gender: { type: String },
    price: { type: Number },
  },{
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
// mongoose will make it clients so always put singular and capitalised version i.e Client in the above line of code

export default Client;