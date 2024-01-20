import express from 'express';
import { isAuthenticated, isBlocked } from '../../middlewares/is-auth.js';
import {
  createOrder,
  createWalletOrder,
  verifyOrder,
  verifyWalletOrder,
} from '../../controllers/payment/paymentController.js';

const router = express.Router();

router.post('/createOrder', isAuthenticated, isBlocked, createOrder);

router.post('/api/payment/verify', verifyOrder);

router.post(
  '/createWalletOrder',
  isAuthenticated,
  isBlocked,
  createWalletOrder
);

router.post(
  '/verifyWalletPayment',
  isAuthenticated,
  isBlocked,
  verifyWalletOrder
);

export default router;
