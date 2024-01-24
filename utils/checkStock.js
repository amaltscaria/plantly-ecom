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
    try{
    let isValid= true;
    const productAdd = await Product.findOne({_id:product});
    if(productAdd.stock<quantity){
    isValid = false;
   }
    return isValid;
}catch(err) {
    throw err;
}
} 

