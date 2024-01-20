import Coupon from "../model/Coupon.js";
import Orders from "../model/Orders.js";
export const totalAmountPay = async (cart, deliveryType, selectedCouponCode, user)=>{
   const totalCartAmount =  cart.reduce((acc, item)=>{
        return acc + item.product.price * item .quantity;
    }, 0);
    let totalAmount = totalCartAmount;
    if(selectedCouponCode){
        let couponDiscount = 0;
        const coupon = await Coupon.findOne({code:selectedCouponCode});
        if(coupon.isListed){
            if(coupon.availableCouponCount>0){
            if(coupon.eligibility === 'new-user'){
                const orderCount = await Orders.countDocuments();
                if(orderCount===0){
                   couponDiscount =  Math.floor(totalAmount * coupon.discountPercentage/100);
                   if(couponDiscount > coupon.maximumDiscount)couponDiscount = coupon.maximumDiscount;
                }
            }else if(coupon.eligibility === 'amount'){
                if(totalAmount>= coupon.criteriaValue){
                    couponDiscount = Math.floor(totalAmount * coupon.discountPercentage/100);
                    if(couponDiscount > coupon.maximumDiscount)couponDiscount = coupon.maximumDiscount;
                }
            }
            else if(coupon.eligibility === 'category'){
                const isValid = true;
                cart.forEach(element => {
                    if(element.product.category.name !== coupon.categorySelect)isValid = false;
                });
                if(isValid){
                    couponDiscount =  Math.floor(totalAmount * coupon.discountPercentage/100);
                    if(couponDiscount > coupon.maximumDiscount)couponDiscount = coupon.maximumDiscount;
                }

            }
        }
    }
        totalAmount -= couponDiscount;
    }
    const delivery = deliveryType === 'express' ? 300 : 100;
    totalAmount += delivery;
    return totalAmount;

}