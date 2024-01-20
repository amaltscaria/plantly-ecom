import multer from 'multer';

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/admin/assets/uploads/productImages'); // Specify the destination folder for uploads
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    },
  });
  
export const upload = multer({ storage: storage }); 