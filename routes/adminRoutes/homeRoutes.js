import express from 'express';

import {
  getDashboard,
  getAllCustomers,
  patchCustomer,
  getSales,
  getOrderData,
} from '../../controllers/admin/homeController.js';

import { isAuthenticated } from '../../middlewares/isAdmin.js';

const router = express.Router();

// Route to get the admin dashboard
router.get('/dashboard', isAuthenticated, getDashboard);

//Route to get all users
router.get('/customers', isAuthenticated, getAllCustomers);

//Route to block user
router.patch('/blockUnblock/:id', isAuthenticated, patchCustomer);

//Route to get sales
router.get('/sales', isAuthenticated, getSales);

router.get('/orderData', isAuthenticated, getOrderData);

export default router;
