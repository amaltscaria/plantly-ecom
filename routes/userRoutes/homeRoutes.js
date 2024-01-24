import express from 'express';
import {
  getHomeAfterLogin,
  getContact,
  getAboutUs,
  getCheckout,
  getWishlist,
  postWishlist,
  patchWishList,
} from '../../controllers/user/homeController.js';
import { isBlocked, isAuthenticated } from '../../middlewares/is-auth.js';

const router = express.Router();

router.get('/home', isAuthenticated, isBlocked, getHomeAfterLogin);

router.get('/contact',isAuthenticated, isBlocked, getContact);

router.get('/about-us', isAuthenticated, isBlocked, getAboutUs)

router.get('/checkout', isAuthenticated, isBlocked, getCheckout);

router.get('/wishlist', isAuthenticated, isBlocked, getWishlist);

router.post('/wishlist/:id', isAuthenticated, isBlocked, postWishlist);

router.delete('/deleteWishlist/:id', isAuthenticated, isBlocked, patchWishList);

export default router;
