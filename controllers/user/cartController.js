import User from "../../model/User.js";
import { itemStock, checkCartQuantity } from "../../utils/checkStock.js";

export const getCart = async (req, res) => {
    const user = await User.findOne({ email: req.session.email }).populate(
      'cart.product'
    );
    const cart = user.cart;
    return res.render('user/cart', { user: user, cart: cart });
  };

  export const postAddToCart = async (req, res) => {
    try {
      const { product, quantity } = req.body;
      if (!(await itemStock(product, quantity))) {
        return res.status(409).json({ success: false });
      }
      const user = await User.findOne({ email: req.session.email }).populate(
        'cart.product'
      );
      const productIndex = user.cart.findIndex(
        item => item.product._id.toString() === product
      );
  
      if (productIndex === -1) {
        // Product not found, add it to the cart
        user.cart.push({ product, quantity });
      } else {
        // Product found in the cart, update quantity
        user.cart[productIndex].quantity += parseInt(quantity);
      }
      const inWishlist = user.wishList.findIndex(item => item.product.toString() === product);
      console.log(inWishlist)
      if(inWishlist !== -1){
        user.wishList.splice(inWishlist,1);
      }
  
      await user.save();
      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  };
  
  export const patchCartQuantity = async (req, res) => {
    try {
      const { product, newQuantity } = req.body;
      const user = await User.findOne({ email: req.session.email }).populate(
        'cart.product'
      );
      if (!(await itemStock(product, newQuantity))) {
        return res.status(409).json({ success: false });
      }
      const cartItem = user.cart.find(
        item => item.product._id.toString() === product
      );
      if (cartItem) {
        cartItem.quantity = newQuantity;
        await user.save();
        const cartItemSum = user.cart.reduce((acc, item) => {
          return acc + item.product.price * item.quantity;
        }, 0);
        res.json({ success: true, cartItemSum });
      } else {
        res.status(404).json({ error: 'Item not found in the cart' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const deleteCartItem = async (req, res) => {
    try {
      const { id } = req.body;
      console.log(id);
      const user = await User.findOneAndUpdate(
        { email: req.session.email },
        { $pull: { cart: { product: { _id: id } } } },
        { new: true }
      );
      console.log(user);
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export const getCartQuantity = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.session.email }).populate(
        'cart.product'
      );
      if (!checkCartQuantity(user.cart)) {
        return res.status(409).json({ success: false });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
    }
  };