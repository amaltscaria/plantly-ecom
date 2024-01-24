import express from 'express';
import {
  getHome,
  getLogin,
  postLogin,
  getVerify,
  postVerify,
  getSendOtp,
  getRegister,
  postRegister,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
  getLogout,
} from '../../controllers/user/authController.js';
import { isBlocked, isLoggedIn, isValid } from '../../middlewares/is-auth.js';

const router = express.Router();

// Route to get home page before login
router.get('/', isLoggedIn,  getHome);
// Route to handle GET register'
router.get('/signup', isLoggedIn, getRegister);
// Route to handle POST register'
router.post('/signup', postRegister);
// Route to handle GET login'
router.get('/login', isLoggedIn, getLogin);
// Route to handle POST login'
router.post('/login', postLogin);
// Route to handle GET verify'
router.get('/verify', isValid, getVerify);
// Route to handle POST verify'
router.post('/verify', isValid, postVerify);
//Route to get the resend Otp
router.get('/sendOtp', isValid, getSendOtp);
// Route to handle GET forgotPassword'
router.get('/forgotPassword', getForgotPassword);
// Route to handle POST forgotPassword'
router.post('/forgotPassword', postForgotPassword);
// Route to handle GET reset password'
router.get('/resetPassword/:token', getResetPassword);
// Route to handle POST reset password'
router.post('/resetPassword/:token', postResetPassword);
// Route to get the logout
router.get('/logout', getLogout);

export default router;
