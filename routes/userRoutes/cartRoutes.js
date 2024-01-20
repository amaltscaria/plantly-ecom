import express from 'express';
import { isAuthenticated, isBlocked } from '../../middlewares/is-auth.js';
import { getCart,postAddToCart, patchCartQuantity, deleteCartItem, getCartQuantity } from '../../controllers/user/cartController.js';

const router = express.Router();

router.get('/cart', isAuthenticated, isBlocked, getCart);

router.post('/addToCart', isAuthenticated, isBlocked, postAddToCart);

router.patch(
  '/updateCartQuantity',
  isAuthenticated,
  isBlocked,
  patchCartQuantity
);

router.delete('/deleteCartItem', isAuthenticated, isBlocked, deleteCartItem);

router.get('/checkCartQuantity', isAuthenticated, isBlocked, getCartQuantity);

export default router;