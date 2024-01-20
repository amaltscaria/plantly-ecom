import Product from "../model/Product.js";

export const checkCartQuantity = cart =>{
    let isValid = true;
    cart.forEach(element => {
        if(element.product.stock<element.quantity){
            isValid = false;
        }
    });
    return isValid;
}
export const itemStock = async (product,quantity) => {
    let isValid= true;
    const productAdd = await Product.findOne({_id:product});
    console.log(productAdd);
    if(productAdd.stock<quantity){
    isValid = false;
   }
   console.log(isValid);
    return isValid;
} 

