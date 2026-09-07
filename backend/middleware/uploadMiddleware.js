import multer from 'multer';
import path from 'path';

/**
 * Configure the storage engine for multer.
 * This determines where uploaded files are stored and how they are named.
 */
const storage = multer.diskStorage({
  // Specify the destination directory for uploaded files
  destination: function (req, file, cb) {
    // Files will be saved in the 'uploads/' directory in the backend
    cb(null, 'uploads/'); 
  },
  // Define the filename structure to avoid naming conflicts
  filename: function (req, file, cb) {
    // Append the current timestamp to the original filename to make it unique
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

/**
 * Create the multer upload instance.
 * It uses the storage configuration and applies file size limits and file type filtering.
 */
const upload = multer({
  storage: storage,
  limits: {
    // Limit file size to 5MB to prevent abuse and save storage space
    fileSize: 5 * 1024 * 1024 
  },
  // Add file filtering to ensure only certain file types (e.g., resumes) are uploaded
  fileFilter: function (req, file, cb) {
    // Define allowed file extensions using a regular expression
    const filetypes = /pdf|doc|docx/; 
    
    // Check if the uploaded file's extension matches the allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Check if the uploaded file's mimetype matches the allowed types
    const mimetype = filetypes.test(file.mimetype);

    // If both extension and mimetype are valid, accept the file
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      // Otherwise, reject the file with an error
      cb(new Error('Error: Only resumes (PDF, DOC, DOCX) are allowed!'));
    }
  }
});

export default upload;
