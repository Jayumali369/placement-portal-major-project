import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  minCgpa: { type: Number, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
