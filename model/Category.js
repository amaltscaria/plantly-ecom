import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
    },
    description: {
        type: String,
        required: true,
        maxLength: [1000, 'description cannot be more than 1000 characters'],
    },
    isListed: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true}
)

const Category = mongoose.model("Category", CategorySchema);

export default Category;