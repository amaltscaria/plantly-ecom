import Category from "../model/Category.js";
import Product from "../model/Product.js";
import { escapeRegex } from "../services/escapeRegex.js";


export const searchCategoryRelevance = async (page, itemsPerPage, search, category, relevance)=>{
    console.log(category);
    let productCount, products, regexPattern;
    regexPattern = new RegExp(escapeRegex(search), 'i');
    const ifCategory = await Category.findOne({name:category});
    console.log(ifCategory);
    if(relevance === '2'){
        productCount = await Product.find({
          isListed:true,
          name: regexPattern,
          category: ifCategory,
        })
        .sort({name:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category: ifCategory,
        })
        .sort({name:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '3'){
        productCount = await Product.find({
          isListed:true,
          category:ifCategory, 
          name:regexPattern,
        })
        .sort({name:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category:ifCategory,
        })
        .sort({name:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '4'){
        productCount = await Product.find({
          isListed:true,
          name:regexPattern,
          category: ifCategory,
        })
        .sort({price:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category:ifCategory,
        })
        .sort({price:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '5'){
        productCount = await Product.find({
          isListed:true,
          name:regexPattern,
          category: ifCategory,
        })
        .sort({price:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category: ifCategory,
        })
        .sort({price:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
       
      }
      console.log(products);
      return [productCount, products];
} 

export const categoryRelevance = async (page, itemsPerPage, category, relevance)=>{
    let productCount, products;
    const ifCategory = await Category.findOne({name:category});
    if(relevance === '2'){
        productCount = await Product.find({
          isListed:true,
          category:ifCategory,
        })
        .sort({name:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:ifCategory,
        })
        .sort({name:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '3'){
        productCount = await Product.find({
          isListed:true,
          category:ifCategory,
        })
        .sort({name:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:ifCategory,
        })
        .sort({name:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '4'){
        productCount = await Product.find({
          isListed:true,
          category:ifCategory,
        })
        .sort({price:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:ifCategory,
        })
        .sort({price:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '5'){
        console.log(category)
        console.log('hifksdfksjkl');
        productCount = await Product.find({
          isListed:true,
          category:ifCategory,
        })
        .sort({price:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:ifCategory,
        })
        .sort({price:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
       
      }
      return [productCount, products];
}

export const categoryArrayRelevance = async (page, itemsPerPage, category, relevance)=>{
    let productCount, products, val;
    const categories = await Category.find({isListed:true});
    const categoryArray = category.map((item)=>{
        categories.forEach(element=>{
          if(element.name===item)
          val = element._id;
        });return val;
      })
    if(relevance === '2'){
        productCount = await Product.find({
          isListed:true,
          category:{$in:categoryArray},
        })
        .sort({name:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:{$in:categoryArray},
        })
        .sort({name:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '3'){
        productCount = await Product.find({
          isListed:true,
          category:{$in:categoryArray},
        })
        .sort({name:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:{$in:categoryArray},
        })
        .sort({name:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '4'){
        productCount = await Product.find({
          isListed:true,
          category:{$in:categoryArray},
        })
        .sort({price:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:{$in:categoryArray},
        })
        .sort({price:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '5'){
        console.log(category)
        console.log('hifksdfksjkl');
        productCount = await Product.find({
          isListed:true,
          category:{$in:categoryArray},
        })
        .sort({price:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          category:{$in:categoryArray},
        })
        .sort({price:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
       
      }
      return [productCount, products];
}

export const searchCategoryArrayRelevance = async (page, itemsPerPage, search, category, relevance)=>{
    console.log(category);
    let productCount, products, regexPattern, val;
    regexPattern = new RegExp(escapeRegex(search), 'i');
    const categories = await Category.find({isListed:true});
    const categoryArray = category.map((item)=>{
        categories.forEach(element=>{
          if(element.name===item)
          val = element._id;
        });return val;
      })
    if(relevance === '2'){
        productCount = await Product.find({
          isListed:true,
          name: regexPattern,
          category: {$in:categoryArray},
        })
        .sort({name:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category: {$in:categoryArray},
        })
        .sort({name:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '3'){
        productCount = await Product.find({
          isListed:true,
          category:{$in:categoryArray}, 
          name:regexPattern,
        })
        .sort({name:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category:{$in:categoryArray},
        })
        .sort({name:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '4'){
        productCount = await Product.find({
          isListed:true,
          name:regexPattern,
          category: {$in:categoryArray},
        })
        .sort({price:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category:{$in:categoryArray},
        })
        .sort({price:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '5'){
        productCount = await Product.find({
          isListed:true,
          name:regexPattern,
          category: {$in:categoryArray},
        })
        .sort({price:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
          name:regexPattern,
          category: {$in:categoryArray},
        })
        .sort({price:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
       
      }
      console.log(products);
      return [productCount, products];
}

export const categoryArraySearch = async (page, itemsPerPage, category, search)=>{
    let val , regexPattern, products, productCount;
    const categories = await Category.find({isListed:true});
    const categoryArray = category.map((item)=>{
      categories.forEach(element=>{
        if(element.name===item)
        val = element._id;
      });return val;
    })
    regexPattern = new RegExp(escapeRegex(search), 'i');

    productCount = await Product.find({
      category:{$in:categoryArray},
      name:regexPattern,
      isListed: true,
    }).countDocuments();

    products = await Product.find({
      category: {$in:categoryArray},
      name:regexPattern,
      isListed: true,
    })
      .populate('category')
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

      return [productCount, products];
}

export const categorySearch = async (page, itemsPerPage, category, search)=>{
    let  regexPattern, products, productCount;
    regexPattern = new RegExp(escapeRegex(search), 'i');
    const ifCategory = await Category.findOne({name:category});
    // Fetch products based on the specified category
    productCount = await Product.find({
      category:ifCategory,
      name: regexPattern,
      isListed: true,
    }).countDocuments();

    products = await Product.find({
      name: regexPattern,
      category: ifCategory,
      isListed: true,
    })
      .populate('category')
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

      return [productCount, products];
}

export const categoryArray = async (page, itemsPerPage, category) => {
    let productCount, products;
    let val;
    const categories = await Category.find({isListed:true})
    const categoryArray = category.map((item)=>{
      categories.forEach(element=>{
        if(element.name===item)
        val = element._id;
      });return val;
    })

    productCount = await Product.find({
      category:{$in:categoryArray},
      isListed: true,
    }).countDocuments();

    products = await Product.find({
      category: {$in:categoryArray},
      isListed: true,
    })
      .populate('category')
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
    
      return [productCount, products];
}

export const categoryFind = async (page, itemsPerPage, category) => {
    let productCount, products;
    const ifCategory = await Category.findOne({name:category});
    // Fetch products based on the specified category
    productCount = await Product.find({
      category:ifCategory,
      isListed: true,
    }).countDocuments();

    products = await Product.find({
      category: ifCategory,
      isListed: true,
    })
      .populate('category')
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

      return [productCount, products];
}

export const searchFind = async (page, itemsPerPage, search) => {
    let productCount, products;
    const regexPattern = new RegExp(escapeRegex(search), 'i');
    productCount = await Product.find({
        name:regexPattern,
        isListed: true,
      }).countDocuments();

      products = await Product.find({
        name: regexPattern,
        isListed: true,
      })
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
        return [productCount, products];
}

export const relevanceFind = async (page, itemsPerPage,relevance) =>{
    let productCount, products;
    if(relevance === '2'){
        productCount = await Product.find({
          isListed:true,
        })
        .sort({name:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
        })
        .sort({name:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '3'){
        productCount = await Product.find({
          isListed:true,
        })
        .sort({name:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
        })
        .sort({name:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '4'){
        productCount = await Product.find({
          isListed:true,
        })
        .sort({price:1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
        })
        .sort({price:1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
      }
      else if(relevance === '5'){
        console.log('hifksdfksjkl');
        productCount = await Product.find({
          isListed:true,
        })
        .sort({price:-1})
        .countDocuments();

        products = await Product.find({
          isListed: true,
        })
        .sort({price:-1})
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);
       
      }
      return [productCount, products];
}  

export const paginateFind = async (page, itemsPerPage) => {
    let products, productCount;
     // Fetch the id of listed categories
    const listedCategories = await Category.find({ isListed: true }).distinct(
    '_id'
    );
    // Fetch products based on the listed categories
    productCount = await Product.find({
        category: { $in: listedCategories },
        isListed: true,
      }).countDocuments();

      products = await Product.find({
        category: { $in: listedCategories },
        isListed: true,
      })
        .populate('category')
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage);

        return [productCount, products];
}