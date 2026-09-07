import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placement_portal';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

// Serve the uploads directory as static files so they can be accessed via URL
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
