import Category from '../../model/Category.js';
import Coupon from '../../model/Coupon.js'

// add coupon handler - GET
export const getAddCoupons = async (req, res) =>{
    const listedCategories = await Category.find({isListed:true});
    res.render('admin/coupons/addCoupon',{user:req.session.admin, listedCategories})
} 

// add coupon handler - POST
export const postAddCoupons = async (req, res) =>{
    try{
    const {couponCode, discountPercentage, expiryDate,couponDescription, eligibilityCriteria, criteriaValue, categorySelect, maximumDiscount, availableCouponCount} = req.body;
    const ifExists = await Coupon.findOne({code:new RegExp('^' + couponCode + '$', 'i')});
    console.log(ifExists);
    if(ifExists) return res.status(409).json({success:false});
    const coupon = new Coupon({
        code:couponCode,
        discountPercentage,
        description: couponDescription,
        expiresOn: new Date(expiryDate),
        eligibility: eligibilityCriteria,
        criteriaValue,
        categorySelect,
        maximumDiscount,
        availableCouponCount,

    })
    coupon.save();
    res.status(200).json({success:true})
} catch(err){
    console.log(err)
    res.status(500).json({message:'Internal Server Error'})
}
}

// all coupons handler - GET
export const getAllcoupons = async (req, res) =>{
    const coupons = await Coupon.find();
    const listedCategories = await Category.find({isListed:true});
    res.render('admin/coupons/allcoupons',{user: req.session.admin, coupons,listedCategories})
}

// list/unlist coupon handler - PATCH
export const listCoupons = async (req, res)=> {
    try{
    const {id} = req.body;
    const coupon = await Coupon.findOne({_id:id});
    if(coupon.isListed === false){
        coupon.isListed = true;
    }else{
        coupon.isListed = false;
    }
    await coupon.save();
    res.status(200).json({success:true});
}catch(err){
    console.log(err);
    res.status(500).json({error: "internal Server Error"})
}
}

// editCoupn handler = PATCH
export const patchCoupon = async (req, res) => {
    try{
    const {couponId, code, discountPercentage, expiresOn,description, eligibility, criteriaValue, categorySelect, maximumDiscount, availableCouponCount} = req.body;
    const ifExists = await Coupon.findOne({code:new RegExp('^' + code + '$', 'i'),_id:{$ne:couponId}});
    if(ifExists) return res.status(409).json({success:false});
    const coupon = await Coupon.findOne({_id:couponId});
    coupon.code = code;
    coupon.discountPercentage = discountPercentage;
    coupon.description = description;
    coupon.expiresOn = new Date(expiresOn);
    coupon.eligibility = eligibility;
    coupon.criteriaValue = criteriaValue;
    coupon.categorySelect = categorySelect;
    coupon.maximumDiscount = maximumDiscount;
    coupon.availableCouponCount = availableCouponCount;
    await coupon.save();
    res.status(200).json({success:true});
    }catch(err){
        console.log(err);
        res.status(500).json({success:false})
    }
    
}