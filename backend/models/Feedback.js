import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  interviewQuestions: [{ type: String }],
  advice: { type: String },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
