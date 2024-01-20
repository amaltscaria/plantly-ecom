import Coupon from "../model/Coupon.js";
import Order from "../model/Orders.js";

export const getEligibleCoupons = async cart => {
    try{
    const totalCartAmount =  cart.reduce((acc, item)=>{
        return acc + item.product.price * item .quantity;
    }, 0);
    const coupons = [];

    //Find all the eligible coupons - criteria minimum purchase amount
    const amountCoupons = await Coupon.find({isListed:true, expiresOn:{$gt: new Date()}, eligibility:'amount'});
    if(amountCoupons){
    amountCoupons.forEach(element => {
        if(totalCartAmount>=element.criteriaValue){
            coupons.push(element);
        }
    })
    }

    //Find all the eligible coupons - criteria (new user - first order)
    const orderCount = await Order.countDocuments();
    if(orderCount === 0){
    const newCoupons = await Coupon.find({isListed:true, expiresOn:{$gt: new Date()}, eligibility:'new-user'});
    if(newCoupons){
    newCoupons.forEach(element => {
        coupons.push(element);
    });
    }

    }
    //Find all the eligible coupons - criteria (category - if all the cart items belong to a the eligible category);

    const categoryCoupons = await Coupon.find({isListed: true, expiresOn:{$gt: new Date()}, eligibility:'category' });
    if(categoryCoupons.length>0){
        categoryCoupons.forEach(item=>{
            let isValid = true;
            cart.forEach(element=>{
             console.log(   element.product.category.name , item.categorySelect)
                if(element.product.category.name !== item.categorySelect)isValid = false;
            })
            if(isValid === true)coupons.push(item);
        })
    }else{
        console.log('god');
    }

    return coupons;
}catch(err){
    console.log(err);
}

}