import express from 'express';
import Job from '../models/Job.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all jobs (public/student)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST a new job (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, company, description, requiredCgpa, requiredSkills } = req.body;
    
    const newJob = new Job({
      title,
      company,
      description,
      requiredCgpa,
      requiredSkills
    });

    const createdJob = await newJob.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
