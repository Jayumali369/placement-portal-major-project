import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  cgpa: { type: Number, default: null }, // Only for students
  skills: [{ type: String }], // Extracted from resume
  resumeUrl: { type: String, default: null }, // Link to stored PDF
  isPlaced: { type: Boolean, default: false },
  placedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
