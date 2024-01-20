import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    expiresOn:{
        type:Date,
        required: true,
    },
     discountPercentage:{
        type: Number,
        required: true,
        min:1,
        max:100,
     },
     eligibility:{
        type:String,
        required:true
     },
     criteriaValue:{
        type:Number,
     },
     categorySelect:{
        type:String,
     },
     maximumDiscount :{
        type: Number,
        required: true,
     },
     availableCouponCount: {
        type: Number,
        required: true,
     },
     isListed: {
      type: Boolean,
      default: true,
     }
})

const Coupon = mongoose.model('coupon', CouponSchema);

export default Coupon;