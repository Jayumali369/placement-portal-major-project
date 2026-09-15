import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal');
    
    const existingAdmin = await User.findOne({ email: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin', 10);
    const admin = new User({
      name: 'System Admin',
      email: 'admin',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Default admin created successfully (username: admin, password: admin)');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

seedAdmin();
