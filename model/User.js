import mongoose from 'mongoose';

// import validator from 'validator'
const  Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:{
        type: String,
        required: [true, 'Please tell us your first name'],
    },
    lastName:{
        type: String,
        required: [true, 'Please tell us your last name'],
    },
    email: {
        type: String, 
        required: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        // validate: [validator.isEmail, 'Please Provide a valid email']
    },
    number: {
        type: String,
        required: [true, 'Please tell us your mobile number'],
    },
    password: {
        type: String,
        required : [true, 'Please provide a password'],
        minlength: 8
    },
    isBlocked: {
        type: Boolean,
        default : false,
    },
    cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min:1,
                },

            }
        ],
    // confirmPassword: {
    //     type: String,
    //     required : [true, 'Please confirm your password'],
        // This works only on create and save
        // validate: {
        //     validator: function (val) {
        //         return val === this.password;
        //     },
        //     message: 'Passwords are not the same'
        // }
    // },
    wishList: [
        {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
      }
], 
    shippingAddress:[ {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postCode: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        }
    },
],
wallet: {
    balance: { type: Number, default: 0 },
    transactionHistory: [
      {
        type: {
          type: String,  // 'Deposit' or 'Received' or 'Sent'
          enum: ['Deposit','Refund', 'Paid', 'Referred Signup', 'Referral'],
        },
        amount: Number,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  usedCoupons :[ 
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Coupon',
    },   
],
referralCode:{
    type:String,
    required: true,
},
referredBy:{
    type: String,
    default:'',
}
},
{
    timestamps: true,
}
);

// compile the schema to model

const User = mongoose.model('User', UserSchema);

export default User;
