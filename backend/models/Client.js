import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    ClientID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    PhoneNumber: { type: String, required: true, unique: true },
    Email: { type: String },
    Age: { type: Number },
    DOB: { type: Date },
    Gender: { type: String },
    Price: { type: Number },
},{
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
// mongoose will make it clients so always put singular and capitalised version i.e Client in the above line of code

export default Client;