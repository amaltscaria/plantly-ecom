import express from 'express';

import { getAddCoupons, postAddCoupons, getAllcoupons, listCoupons, patchCoupon} from '../../controllers/admin/couponController.js';
import { isAuthenticated } from '../../middlewares/isAdmin.js';
const router = express.Router();

//Route to add coupons - get
router.get('/addCoupons', isAuthenticated, getAddCoupons);

//Route to post coupons - post
router.post('/addCoupons', isAuthenticated, postAddCoupons);

//Route to get all coupons - get
router.get('/coupons', isAuthenticated, getAllcoupons);

//Route to list/unlist coupons - patch
router.patch('/listCoupons', isAuthenticated, listCoupons);

//Route to edit couon - patch
router.patch('/editCoupon', isAuthenticated, patchCoupon);

export default router;