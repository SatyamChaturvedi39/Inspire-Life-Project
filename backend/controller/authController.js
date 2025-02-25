// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Agent from '../models/Agent.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    let role;

    // First, check the Admin collection
    user = await Admin.findOne({ email });
    if (user) {
      role = "admin";
    } else {
      // Check the Agent collection
      user = await Agent.findOne({ email });
      if (user) {
        role = "agent";
      }
    }

    if (!user) {
      console.error("User not found!");
      return res.status(401).json({ message: "User does not exist" });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.error(` Invalid password for email: ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create the token payload
    const tokenPayload = { id: user._id, role };
    // Sign the JWT token (expires in 1 day)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log(` Login successful for email: ${email}. Token generated.`);

    return res.json({ token, role });
  } catch (error) {
    console.error(` Error during login: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
