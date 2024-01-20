import express from 'express';
import { isAuthenticated, isBlocked } from '../../middlewares/is-auth.js';
import { getProfile, patchProfile, postAddAddress, patchEditAddress, deleteAddress, patchPassword } from '../../controllers/user/profilecontroller.js';

const router = express.Router();

router.get('/profile', isAuthenticated, isBlocked, getProfile);

router.patch('/editProfile', isAuthenticated, isBlocked, patchProfile);

router.post('/addAddress', isAuthenticated, isBlocked, postAddAddress);

router.patch('/editAddress', isAuthenticated, isBlocked, patchEditAddress);

router.delete('/deleteAddress', isAuthenticated, isBlocked, deleteAddress);

router.patch('/resetPassword', isAuthenticated, isBlocked, patchPassword);


export default router;