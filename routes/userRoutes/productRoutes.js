import express from 'express';
import { isAuthenticated, isBlocked } from '../../middlewares/is-auth.js';
import {getProducts, getSingleProduct, getProductSearch} from '../../controllers/user/productController.js'

const router = express.Router();

router.get('/shop', isAuthenticated, isBlocked, getProducts);
router.get('/shop/:id', isAuthenticated, isBlocked, getSingleProduct);
router.get('/getProductSearch', isAuthenticated, isBlocked, getProductSearch);

export default router;