import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    AdminID: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    PasswordHash: { type: String, required: true },
 },{
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;