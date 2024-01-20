import express from 'express';
import { isAuthenticated } from '../../middlewares/isAdmin.js';
import {
  getAddCategory,
  postAddCategory,
  patchEditCategory,
  patchListCategory,
  getAllCategories,
} from '../../controllers/admin/categoryController.js';

const router = express.Router();

//Route to get the add category
router.get('/addCategory', isAuthenticated, getAddCategory);

//Route to post to the category
router.post('/addCategory', isAuthenticated, postAddCategory);

//Route to edit category
router.patch('/editCategory/:id', isAuthenticated, patchEditCategory);

//Route to list category
router.patch('/listUnlistCategory/:id', isAuthenticated, patchListCategory);

//Route to get all categories
router.get('/categories', isAuthenticated, getAllCategories);

export default router;
