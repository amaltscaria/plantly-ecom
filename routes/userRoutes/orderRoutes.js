import express from 'express';
import { isAuthenticated, isBlocked } from '../../middlewares/is-auth.js';
import { postOrder, getOrderCofirmation, getOrderDetails, patchOrder } from '../../controllers/user/orderController.js';

const router = express.Router();

router.post('/order', postOrder);

router.get(
  '/orderConfirmation',
  isAuthenticated,
  isBlocked,
  getOrderCofirmation
);

router.get('/orderDetails/:id', isAuthenticated, isBlocked, getOrderDetails);

router.patch('/patchOrder', isAuthenticated, isBlocked, patchOrder);

export default router;