import express from 'express';

import { getSignup, postSignup, getLogin, postLogin, getLogout } from "../../controllers/admin/authController.js";
import { isLoggedIn } from "../../middlewares/isAdmin.js";

const router = express.Router();

//Route to get the admin signup page
router.get('/signup', getSignup);

//Route to post to the admin signup page
router.post('/signup', postSignup);

// Route to get the admin login page
router.get('/', isLoggedIn, getLogin);

// Route to get the admin register page
router.post('/', postLogin);

// Route to logout the admin

router.get('/logout', getLogout);

export default router;