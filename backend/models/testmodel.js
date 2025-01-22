import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{ 
        type: String, 
        required: true 
    },
    email:{ 
        type: String, 
        required: true, 
        unique: true 
    },
    phone:{ 
        type: String, 
        required: true 
    },
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);
// mongoose will make it user so always put singular and capitalised version i.e User in the above line of code

export default User;