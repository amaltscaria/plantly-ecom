import express from 'express';

//import the multer configuration from utils/multer.js
import { upload } from '../../utils/multer.js';

import {getEditProduct, patchEditProduct, getAddProduct, postAddProduct, getAllProducts, patchListUnlistProduct} from  '../../controllers/admin/productController.js';
import { isAuthenticated } from '../../middlewares/isAdmin.js';
const router = express.Router();

//Route to get add product
router.get('/addProduct', isAuthenticated, getAddProduct);

//Route to post to add product
router.post(
  '/addProduct',
  upload.array('croppedImage', 5),
  isAuthenticated,
  postAddProduct
);

//Route to list product
router.patch('/listUnlistProduct/:id', isAuthenticated, patchListUnlistProduct);

//Route to get all products
router.get('/Products', isAuthenticated, getAllProducts);

//Route to edit product get
router.get('/editProduct/:id', isAuthenticated, getEditProduct)

//Route to edit product patch
router.patch('/editProduct/:id',
 upload.array('croppedImage', 5),
 isAuthenticated, patchEditProduct);

export default router;