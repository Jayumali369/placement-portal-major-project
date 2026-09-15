import mongoose from 'mongoose';

const interviewSlotSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  interviewer: {
    type: String,
    default: "TBD"
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  }
}, { timestamps: true });

const InterviewSlot = mongoose.model('InterviewSlot', interviewSlotSchema);
export default InterviewSlot;
