import Orders from '../../model/Orders.js';
import Product from '../../model/Product.js';
import { addMoneyToWallet } from '../payment/paymentController.js';


export const getOrders = async (req, res, next) => {
  try{
    const page = +req.query.page || 1;
    const itemsPerPage = 3;
    const orderCount = await Orders.countDocuments();
    const orders = await Orders.find({status:{$ne:'Pending'}})
      .populate('products.product')
      .populate('customer')
      .sort({orderId:-1})
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    res.render('admin/orders/allOrders', {
      orders,
      user: req.session.admin,
      itemsPerPage,
      orderCount,
      currentPage: page,
      hasNextPage: itemsPerPage * page < orderCount,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(orderCount / itemsPerPage),
    });
  }catch(err){
    console.log(err);
    next(err);
  }
  };
  
  export const patchOrderStatus = async (req, res, next) => {
    try{
    const { orderId, productId } = req.body;
    const order = await Orders.findOne({ orderId: orderId });
    const product = order.products.find(item => {
      return item._id.toString() === productId;
    });
    if (product.status === 'Placed') product.status = 'Shipped';
    else if (product.status === 'Shipped') product.status = 'Out For Delivery';
    else if (product.status === 'Out For Delivery') product.status = 'Delivered';
  
    let isValid = true;
    const item = order.products.find(item => item.status !== 'Delivered');
    if (item) isValid = false;
    if (isValid) order.status = 'Delivered';
    await order.save();
    res.json({
      success: true,
    });
  }catch(err){
    next(err)
  }
  };
  
  export const patchOrderReturn = async (req, res) => {
    try {
      const { status, orderId, productId } = req.body;
      const order = await Orders.findOne({ orderId: orderId });
      const product = order.products.find(item => {
        return item._id.toString() === productId;
      });
      if (status === 'success') {
        const quantity = product.quantity;
        const originalProduct = await Product.findOne({
          _id: product.product._id,
        });
        originalProduct.stock += quantity;
        originalProduct.save();
        const type = 'Refund';
        await addMoneyToWallet(
          req.session.email,
          product.price * product.quantity,
          type
        );
        product.status = 'Returned';
        await order.save();
      } else if (status === 'rejected') {
        product.status = 'Return Rejected';
        await order.save();
      }
      res.status(200).json({
        success: 'true',
      });
    } catch (err) {
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  };