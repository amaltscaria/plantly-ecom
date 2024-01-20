import User from '../../model/User.js';
import Coupon from '../../model/Coupon.js';

import { checkCartQuantity} from '../../utils/checkStock.js';
import { getEligibleCoupons } from '../../utils/getEligibleCoupons.js';
import Banner from '../../model/banner.js';

export const getHomeAfterLogin = async (req, res) => {
  const banners = await Banner.find({
    isListed: true,
    expiryDate: { $gt: new Date() },
  });
  console.log(banners);
 const user = await User.findOne({ email: req.session.email }).populate(
    'cart.product'
  );
  const cart = user.cart;
  req.session.userDetails = null;
  req.session.user = null;
  res.render('user/home', { cart: cart, user: user, banners });
};

export const getContact = async (req, res) => {
  try{
    res.render('user/contact');
  }
  catch(err){
    
  }
}

export const getCheckout = async (req, res) => {
  const user = await User.findOne({ email: req.session.email }).populate({
    path: 'cart.product',
    populate: {
      path: 'category',
    },
  });
  const cart = user.cart;
  if (cart.length === 0 || !checkCartQuantity(cart))
    return res.redirect('/cart');
  const coupons = await getEligibleCoupons(cart);
  const allCoupons = await Coupon.find({ isListed: true }).sort({
    expiresOn: -1,
  });
  return res.render('user/checkout', {
    user: user,
    cart: cart,
    coupons,
    allCoupons,
  });
};

export const getWishlist = async (req, res) => {
  const user = await User.findOne({ email: req.session.email })
    .populate('cart.product')
    .populate({
      path: 'wishList.product',
      populate: {
        path: 'category',
      },
    });
  const cart = user.cart;
  const wishList = user.wishList;
  res.render('user/wishlist', { user, cart, wishList });
};

export const postWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ email: req.session.email });
    const index = user.wishList.findIndex(
      item => item.product.toString() === id
    );
    if (index === -1) {
      const index = user.cart.findIndex(item => item.product.toString() === id);
      if (index === -1) {
        user.wishList.push({ product: id });
        await user.save();
        res.status(200).json({ success: true });
      } else {
        res.status(409).json({ message: 'item already there' });
      }
    } else {
      res.status(409).json({ message: 'item already there' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const patchWishList = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneAndUpdate(
      { email: req.session.email },
      { $pull: { wishList: { product: id } } },
      { new: true }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};