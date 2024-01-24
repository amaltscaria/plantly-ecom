import User from "../../model/User.js";
import Product from "../../model/Product.js";
import Category from "../../model/Category.js";
import { escapeRegex } from "../../services/escapeRegex.js";
import {relevanceFind,searchCategoryArrayRelevance, searchCategoryRelevance, categoryRelevance, categoryArrayRelevance, categoryArraySearch, categorySearch, categoryArray, categoryFind, searchFind, paginateFind} from "../../utils/searchFilterPaginate.js";

export const getProducts = async (req, res, next) => {
    try {
      const {category, search, relevance} = req.query;
      const itemsPerPage = 8;
      const page = +req.query.page || 1;
  
      // Fetch user information
      const user = await User.findOne({ email: req.session.email }).populate(
        'cart.product'
      );
      const cart = user.cart;
  
      //Fetch the listed categories
      const categories = await Category.find({ isListed: true });
  
      let productCount;
      let products;
      let regexPattern;
      if(search){
        regexPattern = new RegExp(escapeRegex(search), 'i');
      }
      if(search && category && typeof category !== 'string' && relevance){
        [productCount, products] = await searchCategoryArrayRelevance(page, itemsPerPage, search, category, relevance);
      }
      else if(search && category && typeof category === 'string' && relevance){
        [productCount, products] = await searchCategoryRelevance(page, itemsPerPage, search, category, relevance);
      }
      else if(category && typeof category!== 'string' && relevance && !search){
        [productCount, products] = await categoryArrayRelevance (page, itemsPerPage, category, relevance);
      }
      else if(category && typeof category ==='string' && relevance && !search){
        [productCount, products] = await categoryRelevance (page, itemsPerPage, category, relevance);
      }
      else if(category && typeof category!=='string' && search && !relevance){
        [productCount, products] = await categoryArraySearch (page, itemsPerPage, category, search);
        
      } else if (category && typeof category ==='string' && search && !relevance) {
        [productCount, products] = await categorySearch (page, itemsPerPage, category, search);
       
      } 
       else if(category && typeof category!=='string' && !search && !relevance){
        [productCount, products] = await categoryArray (page, itemsPerPage, category);
      }
 
      else if (category && typeof category==='string' && !search && !relevance) {
        [productCount, products] = await categoryFind(page, itemsPerPage, category);
      }
      else if(search && !category && !relevance){
        [productCount, products] = await searchFind(page, itemsPerPage, search);
      }
       else if(relevance && !search && !category){
        [productCount, products] = await relevanceFind(page, itemsPerPage,relevance);
       }
       else {
        [productCount, products] = await paginateFind(page, itemsPerPage,relevance);
      }
      const filter = category;
      res.render('user/products', {
        itemsPerPage,
        categories,
        user,
        cart,
        search,
        filter,
        relevance,
        productCount,
        products,
        currentPage: page,
        hasNextPage: itemsPerPage * page < productCount,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(productCount / itemsPerPage),
      });
    } catch (err) {
      next(err);
    }
  };
  
  export const getSingleProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ email: req.session.email }).populate(
        'cart.product'
      );
      const cart = user.cart;
      const itemPresentInCart = cart.filter(
        item => item.product._id.toString() === id
      );
      const product = await Product.findOne({ _id: id });
      if (product) {
        return res.render('user/singleProduct', {
          user: user,
          cart: cart,
          product: product,
          itemPresentInCart,
        });
      } else {
        next(404);
      }
    } catch (err) {
      next(err);
    }
  };

  export const getProductSearch = async (req, res, next) => {
    try{
    const products = await Product.find({isListed:true});
    res.status(200).json({products});
    }catch(err){
     next(err);
    }
  }