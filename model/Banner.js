import mongoose from 'mongoose';

const bannerSchmea = new mongoose.Schema({
    bannerName:{
        type: String,
        required: true,
    },
    targetType:{
        type:String,
        required: true,
    },
    targetId:{
        type:String,
        required: true,
    },
    startDate:{
        type: Date,
        required: true,
    },
    expiryDate:{
        type: Date,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    bannerImage:{
        type:String,
        required:true,
    },
    isListed:{
        type:Boolean,
        default:true,
    }

},
{timestamps:true}
)

const Banner = mongoose.model('Banner',bannerSchmea);

export default Banner;