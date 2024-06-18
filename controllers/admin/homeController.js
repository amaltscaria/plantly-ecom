import User from '../../model/User.js';
import Orders from '../../model/Orders.js';
import { filterSales } from '../../utils/filerSales.js';

// admin dashboardhandler - GET
export const getDashboard = async (req, res, next) => {
  try{
  const orders = await Orders.find({status:'Delivered'});
  res.render('admin/dashboard', { user: req.session.admin ,orders});
  }catch (err) {
    next(err)
  }
};
// all customers handler - GET
export const getAllCustomers = async (req, res, next) => {
  try{
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash('success');
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  const users = await User.find();
  res.render('admin/customers/allCustomers', {
    user: req.session.admin,
    customers: users,
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
}catch(err){
  next(err)
}
};

// block unblock custoemr - PATCH
export const patchCustomer = async (req, res, next) => {
  try{
  const { id } = req.params;

  // Validate the user ID
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Update the user's status to blocked
  if (user.isBlocked) {
    user.isBlocked = false;
    req.flash('success', 'User Unblocked Successfully');
    await user.save();
  } else {
    user.isBlocked = true;
    req.session.isBlocked = true;
    req.flash('error', 'User Blocked Successfully');
    await user.save();
  }
  // Return a JSON response with status indicating success
  res.json({ status: 'success' });
}catch (err) {
  next(err);
}
};

// sales report - GET
export const getSales = async (req, res, next) => {
  try {
    const { filter } = req.query;
    let orders;
    if(filter && filter.length === 2){
     orders = await filterSales(filter);
    }else{
     orders = await filterSales(filter);
    }
    console.log(orders, filter)
    res.render('admin/sales', { user: req.session.admin, orders, filter });
  } catch (err) {
    next(err);
  }
};
 
// order data - GET
export const getOrderData = async (req, res, next) => {
  try{
  const orders = await Orders.find({status: 'Delivered'}).populate('products.product');
  res.status(200).json({orders});
  }catch(err){
    next(err)
  }
}