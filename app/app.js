import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import nocache from 'nocache';


//adminRoutes
import adminAuthRoutes from '../routes/adminRoutes/authRoutes.js';
import bannerRoutes from '../routes/adminRoutes/bannerRoutes.js';
import categoryRoutes from '../routes/adminRoutes/categoryRoutes.js';
import couponRoutes from '../routes/adminRoutes/couponRoutes.js';
import adminHomeRoutes from '../routes/adminRoutes/homeRoutes.js';
import adminOrderRoutes from '../routes/adminRoutes/orderRoutes.js';
import adminProductRoutes from '../routes/adminRoutes/productRoutes.js';

//userRoutes
import userAuthRoutes from '../routes/userRoutes/authRoutes.js';
import cartRoutes from '../routes/userRoutes/cartRoutes.js';
import userHomeRoutes from '../routes/userRoutes/homeRoutes.js';
import userOrderRoutes from '../routes/userRoutes/orderRoutes.js';
import userProductRoutes from '../routes/userRoutes/productRoutes.js'
import profileRoutes from '../routes/userRoutes/profileRoutes.js'

//payment routes
import paymentRoutes from '../routes/paymentRoutes/paymentRoutes.js';

// dbConnect
import dbConnect from '../config/dbConnect.js';
dbConnect();

const app = express();

//regiestering the view engine as ejs;
app.set('view engine', 'ejs');
app.set('views', 'views');

//middlewares
app.use(cors());
app.use(nocache());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(morgan('dev'));

//admin routes
app.use('/admin', adminAuthRoutes);
app.use('/admin', bannerRoutes);
app.use('/admin', categoryRoutes);
app.use('/admin', couponRoutes);
app.use('/admin', adminHomeRoutes);
app.use('/admin', adminOrderRoutes);
app.use('/admin', adminProductRoutes);

//user routes
app.use('/', userAuthRoutes);
app.use('/', cartRoutes);
app.use('/', userHomeRoutes);
app.use('/', userOrderRoutes);
app.use('/', userProductRoutes);
app.use('/', profileRoutes);

//payment routes
app.use('/', paymentRoutes);

// Middleware to handle not found routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Custom error middleware
// app.use((err, req, res, next) => {
//   if (err.status === 404 || err === 404) {
//     res.status(404).render('error/404');
//   } else {
//     res.status(500).render('error/500');
//   }
// });
export default app;
