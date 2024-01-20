import User from "../../model/User.js";
import Orders from "../../model/Orders.js";
import Coupon from "../../model/Coupon.js";

export const getProfile = async (req, res) => {
    const user = await User.findOne({ email: req.session.email }).populate(
      'cart.product'
    );
    const orders = await Orders.find({ customer: user._id });
    const cart = user.cart;
    const coupons = await Coupon.find({ isListed: true }).sort({ expiresOn: -1 });
    res.render('user/profile', {
      cart,
      user,
      orders,
      coupons,
    });
  };
  
  export const patchProfile = async (req, res) => {
    try {
      const { updatedFirstName, updatedLastName, updatedNumber } = req.body;
      const numberExists = await User.findOne({
        number: updatedNumber,
        email: { $ne: req.session.email },
      });
      console.log(numberExists);
      if (numberExists) {
        res.status(404).json({ error: 'Provided Number exists already' });
      } else {
        const user = await User.findOne({ email: req.session.email });
        if (user) {
          user.firstName = updatedFirstName;
          user.lastName = updatedLastName;
          user.number = updatedNumber;
          await user.save();
          res.status(200).json({ success: true });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const postAddAddress = async (req, res) => {
    console.log(req.body);
    try {
      const {
        fullName,
        addressLine1: address,
        city,
        state,
        postCode,
        country,
        mobileNumber: number,
        isDefault,
      } = req.body;
      const user = await User.findOne({ email: req.session.email });
      user.shippingAddress.push({
        name: fullName,
        address,
        city,
        number,
        postCode,
        state,
        country,
        isDefault,
      });
      await user.save();
      const addedId = user.shippingAddress[user.shippingAddress.length - 1]._id;
      res.status(200).json({ success: true, addedId });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export const patchEditAddress = async (req, res) => {
    try {
      const {
        id,
        addressName,
        addressValue,
        addressCity,
        addressState,
        addressPost,
        addressNumber,
      } = req.body;
      const user = await User.findOne({ email: req.session.email });
      const address = user.shippingAddress.find(
        address => address._id.toString() === id
      );
      address.name = addressName;
      address.address = addressValue;
      address.city = addressCity;
      address.state = addressState;
      address.postCode = addressPost;
      address.number = addressNumber;
      await user.save();
      res.status(200).json({ success: true });
      console.log(address);
    } catch (err) {
      console.log(err);
      res.status(404).json({ success: false });
    }
  };
  
  export const deleteAddress = async (req, res) => {
    try {
      const { id } = req.body;
      const user = await User.findOneAndUpdate(
        { email: req.session.email },
        { $pull: { shippingAddress: { _id: id } } },
        { new: true } // This option returns the modified document
      );
      // `user` now contains the updated document with the address removed
      res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false });
    }
  };

  export const patchPassword = async (req, res) => {
    try {
      console.log(req.body);
      const { currentPassword, newPassword } = req.body;
      // Find the user based on the session
      const user = await User.findOne({ email: req.session.email });
  
      // Check if the current password matches
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
  
      if (!isCurrentPasswordValid) {
        // If the current password is incorrect
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
  
      // Update the password with the new one
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
  
      // Respond with success
      res.status(200).json({ success: true });
    } catch (err) {
      // If an error occurs during the update
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };