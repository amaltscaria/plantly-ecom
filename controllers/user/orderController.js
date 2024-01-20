
import User from "../../model/User.js";
import Order from "../../model/Orders.js";
import Product from "../../model/Product.js";
import { checkCartQuantity } from "../../utils/checkStock.js";
import { createOrder } from "../payment/paymentController.js";
import { addMoneyToWallet } from "../payment/paymentController.js";
import {totalAmountPay} from "../../utils/totalAmoutPay.js";                             

export const postOrder = async (req, res) => {
    try {
      console.log(req.body);
      const { address, deliveryType, paymentMethod, selectedCouponCode, split } =
        req.body;
  
      const user = await User.findOne({ email: req.session.email }).populate(
        {path:'cart.product',
        populate:{
          path:'category'
        }}
      );
  
      const cart = user.cart;
  
      if (!checkCartQuantity(cart)) {
        return res.status(409).json({ success: false });
      }
      // Get the current number of documents in the Order collection
      const currentOrderCount = await Order.countDocuments();
      // Calculate the next order ID
      const nextOrderId = currentOrderCount + 1001;
  
      const userAddress = user.shippingAddress.find(val => {
        return val._id.toString() === address.toString();
      });
      const totalAmount = await totalAmountPay(
        cart,
        deliveryType,
        selectedCouponCode,
        req.session.email
      );
      let walletBalance = user.wallet.balance;
  
      const status =
        paymentMethod === 'Cash On Delivery' ||
        paymentMethod === 'Wallet' ||
        split === 'walletCod'
          ? 'Placed'
          : 'Pending';
      let cod = 0,
        wallet = 0,
        online = 0;
  
      if (paymentMethod === 'Partial' && split === 'walletCod') {
        wallet = walletBalance;
        cod = totalAmount - walletBalance;
      }
      if (paymentMethod === 'Partial' && split === 'walletOnline') {
        wallet = walletBalance;
        online = totalAmount - walletBalance;
      }
      if (paymentMethod === 'Wallet') wallet = walletBalance;
      if (paymentMethod === 'Cash On Delivery') cod = totalAmount;
      if (paymentMethod === 'Online Payment') online = totalAmount;
  
      if (paymentMethod === 'Wallet'){
        if(walletBalance < totalAmount)
        res.status(409).json({ walletBalance: 'Insufficient' });
        else walletBalance -= totalAmount;
      }else if(split){
        if(walletBalance<=0){
          res.status(409).json({ walletBalance: 'Insufficient' });
        }if(split === 'walletCod')walletBalance = 0;
      }
      user.wallet.balance = walletBalance;
      await user.save();
  
      const order = new Order({
        orderId: nextOrderId,
        customer: user._id,
        products: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
          status,
        })),
        paymentStatus: paymentMethod === 'Wallet' ? 'Paid' : 'Unpaid',
        breakup: {
          cod,
          wallet,
          online,
        },
        address: {
          name: userAddress.name,
          address: userAddress.address,
          city: userAddress.city,
          state: userAddress.state,
          country: userAddress.country,
          postCode: userAddress.postCode,
          number: userAddress.number,
        },
        paymentMethod,
        deliveryCharge: deliveryType === 'express' ? 300 : 100,
        totalPrice:
          deliveryType === 'express' ? totalAmount - 300 : totalAmount - 100,
        totalAmount,
        deliveryType,
        status,
        couponUsed:selectedCouponCode,
      });
      await order.save();
      for (const item of cart) {
        const product = await Product.findOne({ _id: item.product._id });
        product.stock -= item.quantity;
        await product.save();
      }
      if(paymentMethod === 'Cash On Delivery' || split === 'walletCod'){
        user.cart = [];
        await user.save();
      }
  
      let orderId = '';
      if (paymentMethod === 'Online Payment') {
        orderId = await createOrder(totalAmount);
        return res.status(200).json({ orderId, totalAmount, nextOrderId, paymentMethod});
      } else if (paymentMethod === 'Partial') {
        if (split === 'walletOnline') {
          console.log(paymentMethod, split);
          orderId = await  createOrder(online);
         return res.status(200).json({ orderId, online , nextOrderId, paymentMethod});
        }
      }
     return  res.status(200).json({success:true, nextOrderId});
    } catch (err) {
      console.log(err);
    }
  };
  
  export const placeOrder = async (orderId,email, paymentMethod)=>{
    try{
  const order = await Order.findOne({orderId})
  order.paymentStatus = 'Paid';
  order.status = 'Placed';
  order.products.forEach((item)=>{
    item.status = 'Placed';
  })
  await order.save();
  const user = await User.findOne({email}).populate('cart.product');
  if(paymentMethod === 'Partial')user.wallet.balance = 0;
  user.cart = [];
  await user.save();}
  catch(err){
    console.log(err);
  }
  }
  
  export const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ email: req.session.email });
    const orders = await Order.find({ customer: user._id }).populate(
      'products.product'
    );
    const order = orders.find(item => item._id.toString() === id);
    const products = order.products;
    res.render('user/orderDetails', { order: order, products: products });
  };
  
  export const getOrderCofirmation = async (req, res) => {
    const {order} = req.query;
    const myOrder = await Order.findOne({orderId:order});
    res.render('user/orderConfirmation', {myOrder});
  };
  
  export const patchOrder = async (req, res) => {
    try {
      const { action, orderId, productId } = req.body;
      const order = await Order.findOne({ orderId: orderId });
      const product = order.products.find(item => {
        return item._id.toString() === productId;
      });
      if (action === 'Cancel') {
        if (order.paymentMethod === 'Online Payment' || 'Wallet') {
          const type = 'Refund';
          await addMoneyToWallet(req.session.email, product.price * product.quantity, type);
        }else if(order.paymentMethod === 'Partial'){
          const type = 'Refund';
          if(order.breakup.online>0 && order.breakup.wallet> 0)
          await addMoneyToWallet(req.session.email, product.price * product.quantity, type);
          else {
            const amount = product.price * quantity >= order.breakup.wallet ? order.breakup.wallet : product.price * quantity;
            await addMoneyToWallet(req.session.email, amount, type);
          }
        }
        const quantity = product.quantity;
        const originalProduct = await Product.findOne({
          _id: product.product._id,
        });
        originalProduct.stock += quantity;
        originalProduct.save();
        product.status = 'Cancelled';
        await order.save();
      } else if (action === 'Return') {
        product.status = 'Return Requested';
        await order.save();
      }
      res.status(200).json({
        success: 'true',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: 'Internal Sever Error',
      });
    }
  };