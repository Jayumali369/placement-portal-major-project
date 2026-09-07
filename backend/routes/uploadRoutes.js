import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/upload/resume
 * @desc Upload a resume file
 * @access Private (Requires valid JWT token)
 * 
 * The 'protect' middleware ensures only authenticated users can upload.
 * The 'upload.single("resume")' middleware handles the multipart/form-data
 * expecting a single file in a field named 'resume'.
 */
router.post('/resume', protect, upload.single('resume'), (req, res) => {
  try {
    // If multer failed or no file was provided in the 'resume' field
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid file format' });
    }
    
    // Return the path to the successfully uploaded file
    // The frontend can use this path to display or download the file
    res.status(200).json({
      message: 'File uploaded successfully',
      filePath: `/${req.file.path}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

export default router;
