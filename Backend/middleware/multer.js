// import multer from "multer";

// const storage = multer.memoryStorage();
// export const singleUpload = multer({ storage }).single("file");

import multer from 'multer'; // ✅ Make sure this import exists

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow both images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Export both the configured multer instance and single upload
export { upload };
export const singleUpload = upload.single('file');