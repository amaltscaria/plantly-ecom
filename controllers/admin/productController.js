import Category from '../../model/Category.js';
import Product from '../../model/Product.js';

export const getAddProduct = async (req, res) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash('success');
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  const categories = await Category.find();
  res.render('admin/products/addProduct', {
    user: req.session.admin,
    categories: categories,
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
};

export const postAddProduct = async (req, res) => {
  let imgArr = [];
  for (let i = 0; i < req.files.length; i++) {
    imgArr.push(req.files[i].filename);
  }
  const {
    productName,
    SKU,
    priceName,
    category,
    stock,
    vendor,
    description,
    tags,
    sizes,
    colors,
    weights,
  } = req.body;
  const categoryId = await Category.findOne({name:category});
  const product = await Product.findOne({ name: productName });
  if (product) {
    req.flash('error', 'product with same name already exits');
    res.json({ success: 'no' });
  } else {
    const newProduct = new Product({
      name: productName,
      sku: SKU,
      price: priceName,
      sizes: sizes,
      weights,
      colors,
      category: categoryId._id,
      stock,
      vendor,
      description,
      images: imgArr,
      tags,
    });
    await newProduct.save();
    req.flash('success', 'New Product Added Successfully');
    res.json({ success: 'yes' });
  }
};

export const getAllProducts = async (req, res) => {
  const page = +req.query.page || 1;
  const itemsPerPage = 8;
  let errorMessage = req.flash('error');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  let successMessage = req.flash('success');
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }
  const productCount = await Product.find().countDocuments();
  const products = await Product.find()
    .populate('category')
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);
    
  res.render('admin/products/allProducts', {
    itemsPerPage,
    user: req.session.admin,
    products: products,
    errorMessage: errorMessage,
    successMessage: successMessage,
    productCount,
    currentPage: page,
    hasNextPage: itemsPerPage * page < productCount,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: Math.ceil(productCount / itemsPerPage),
  });
};

export const patchListUnlistProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });

    if (product) {
      if (product.isListed) {
        product.isListed = false;
        await product.save();
        req.flash('error', 'Product unListed Successfully');
        return res.status(200).json({ message: 'Success' });
      }
      product.isListed = true;
      await product.save();
      req.flash('success', 'Product Listed Successfully');
      return res.status(200).json({ message: 'Success' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getEditProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id }).populate('category');
    if(product){
      const categories = await Category.find({ isListed: true });
    res.render('admin/products/editProduct', {
      categories,
      user: req.session.admin,
      product,
    });
    }else {
      next(404);
    }
    
  } catch (err) {
     next(500);
  }
};

export const patchEditProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    if(product){
      let imgArr = [];
    for (let i = 0; i < req.files.length; i++) {
      imgArr.push(req.files[i].filename);
    }
    const {
      productName,
      SKU,
      priceName,
      category,
      stock,
      vendor,
      description,
      tags,
      sizes,
      colors,
      weights,
    } = req.body;
    
    const categoryId = await Category.findOne({name:category});
      (product.name = productName);
      (product.sku = SKU);
      (product.price = priceName);
      (product.sizes = sizes),
      (product.weights = weights),
      (product.colors = colors),
      (product.category = categoryId._id),
      (product.stock = stock),
      (product.vendor = vendor),
      (product.description = description),
      (product.images = imgArr),
      (product.tags = tags),

      await product.save();
    res.status(200).json({ success: 'yes' });
    } else{
      res.status(404).json({success: 'no'})
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Internal Sever Error'});
  }
};
