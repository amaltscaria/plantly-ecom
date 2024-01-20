import dotenv from 'dotenv';
dotenv.config();
import { instance } from '../../utils/razorpay.js';
import crypto from 'crypto';
import User from '../../model/User.js';
import { placeOrder } from '../user/orderController.js';

export const createWalletOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const orderId = await createOrder(amount);
    req.session.walletAmount = amount;
    res.status(200).json({ success: true, orderId });
  } catch (err) {
    console.log(err);
  }
};

export const verifyWalletOrder = async (req, res) => {
  try {
    const { type } = req.body;
    // STEP 7: Receive Payment Data
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body.response;

    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    // Pass yours key_secret here
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // STEP 8: Verification & Send Response to User

    // Creating hmac object
    let hmac = crypto.createHmac('sha256', key_secret);

    // Passing the data to be hashed
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

    // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
    console.log(razorpay_signature);
    console.log(generated_signature);

    if (razorpay_signature === generated_signature) {
      if (type === 'Deposit')
        addMoneyToWallet(req.session.email, req.session.walletAmount, type);
      res
        .status(200)
        .json({ success: true, message: 'Payment has been verified' });
    } else res.json({ success: false, message: 'Payment verification failed' });
  } catch (err) {
    console.log(err);
  }
};

export const createOrder = async amount => {
  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'order1',
    };

    const order = await instance.orders.create(options);
    console.log(order);
    return order.id;
  } catch (err) {
    console.log(err);
  }
};

export const addMoneyToWallet = async (email, amount, type) => {
  try {
    const user = await User.findOne({ email });
    user.wallet.balance += +amount;
    user.wallet.transactionHistory.push({ type, amount: amount });
    await user.save();
    console.log(user);
  } catch (err) {
    console.log(err);
  }
};

export const verifyOrder = async (req, res) => {
  console.log(req.body);
  try {
    const { type, nextOrderId, paymentMethod } = req.body;
    // STEP 7: Receive Payment Data
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body.response;

    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    // Pass yours key_secret here
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // STEP 8: Verification & Send Response to User

    // Creating hmac object
    let hmac = crypto.createHmac('sha256', key_secret);

    // Passing the data to be hashed
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);

    // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');
    console.log(razorpay_signature);
    console.log(generated_signature);

    if (razorpay_signature === generated_signature) {
      placeOrder(nextOrderId, req.session.email, paymentMethod);

      res
        .status(200)
        .json({ success: true, message: 'Payment has been verified' });
    } else res.json({ success: false, message: 'Payment verification failed' });
  } catch (err) {
    console.log(err);
  }
};
