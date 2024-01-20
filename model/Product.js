import mongoose from 'mongoose';

const Products = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'please provide product name'],
        maxLength: [100, 'Name cannot be more than 100 characters'],
    },
    sku: {
        type : String,
        required: true,
    },
    price: {
        type: Number,
        required: [true, 'please provide product price'],
        default: true,
    },
    sizes:{
        type: [String],
        required: true,
    },
    weights: {
        type: Object,
        requried: true,
    }
    ,
    description: {
        type: String,
        required: [true, 'please provide product description'],
        maxLength: [1000, 'description cannot be more than 1000 characters'],
    },
    images: {
        type:[String],
        required: true,
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        required: [true, 'please provide category name'],

    },
    colors: {
        type: [String],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
        
    },
    stock: {
        type: Number,
        required: true,
        min:0,
    },
    vendor: {
        type: String,
        required: true,
    },
    tags:{
        type: String,
        required: true,
    },
    isListed:{
        type: Boolean,
        default: true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
},
{timestamps: true}
)

const Product = mongoose.model("Product", Products);

export default Product;