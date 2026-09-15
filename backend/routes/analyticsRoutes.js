import express from 'express';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route GET /api/analytics
 * @desc Get placement analytics data
 * @access Private/Admin
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const placedStudents = await User.countDocuments({ role: 'student', isPlaced: true });
    
    // Top companies by job posts
    const jobs = await Job.find();
    let companyCounts = {};
    jobs.forEach(job => {
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });

    const topCompanies = Object.keys(companyCounts)
      .map(company => ({ company, count: companyCounts[company] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Applications status counts
    const applications = await Application.find();
    let statusCounts = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    res.json({
      placementRate: totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0,
      totalStudents,
      placedStudents,
      topCompanies,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
