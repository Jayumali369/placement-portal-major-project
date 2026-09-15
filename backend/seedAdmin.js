import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal');
    
    const existingAdmin = await User.findOne({ email: 'admin' });
    // Delete old admin if exists
    await User.findOneAndDelete({ email: "admin" });

    // Check if new admin exists
    const adminExists = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      const adminUser = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
      console.log("Admin user seeded successfully with email admin@gmail.com.");
    } else {
      console.log("Admin user already exists.");
    }
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

seedAdmin();
