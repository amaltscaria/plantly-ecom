import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    orderId: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 1,
        },
        status: {
          type: String,
          enum: ['Pending','Placed', 'Shipped', 'Delivered', 'Cancelled', 'Return Rejected', 'Return Requested', 'Out For Delivery','Returned'],
          default: 'Placed',
        },
      },
    ],
    address: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postCode: { type: String, required: true },
      number: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    breakup: {
      wallet:{
          type: Number,
      },
      online:{
        type: Number,
      },
      cod:{
        type: Number,
      }
    },
    paymentStatus:{
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryType: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending','Placed', 'Shipped', 'Delivered', 'Cancelled', 'Return Rejected', 'Return Requested', 'Out For Delivery','Returned'],
      default: 'Placed',
    },
    couponUsed:{
      type:String,
      // required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
