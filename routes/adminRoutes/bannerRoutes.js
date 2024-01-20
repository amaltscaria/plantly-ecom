import express from 'express';
import { isAuthenticated } from '../../middlewares/isAdmin.js';
import { getAddBanner, getAllBanners, postBanner, patchBanner, listUnlistBanner, getEditBanner } from '../../controllers/admin/bannerController.js';
import { upload } from '../../utils/multer.js';

const router = express.Router();

router.get('/banners',isAuthenticated, getAllBanners);

router.get('/addBanner', isAuthenticated, getAddBanner);

router.post('/addBanner', upload.single('croppedBanner', 1), isAuthenticated, postBanner);


router.get('/editBanner/:id', isAuthenticated, getEditBanner)
router.patch('/editBanner/:id',upload.single('croppedBanner', 1), isAuthenticated, patchBanner);

router.patch('/listUnlistBanner/:id', isAuthenticated, listUnlistBanner);



export default router;