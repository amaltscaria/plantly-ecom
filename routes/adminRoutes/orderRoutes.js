import express from 'express';
import { isAuthenticated } from '../../middlewares/isAdmin.js';
import {
  getOrders,
  patchOrderStatus,
  patchOrderReturn,
} from '../../controllers/admin/orderController.js';
const router = express.Router();

//Route to get all orders
router.get('/orders', isAuthenticated, getOrders);

//Route to change order status
router.patch('/orderStatus', isAuthenticated, patchOrderStatus);

//Route to return the product
router.patch('/orderReturn', isAuthenticated, patchOrderReturn);

export default router;
