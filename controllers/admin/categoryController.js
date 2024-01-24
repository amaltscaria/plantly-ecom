import Category from "../../model/Category.js";
// add categoryhandler - GET
export const getAddCategory = async (req, res, next) => {
  try{
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
    res.render('admin/categories/addCategory', {
      user: req.session.admin,
      errorMessage: errorMessage,
      successMessage: successMessage,
    });
  }catch(err){
    next(err);
  }
  };
  
  // add category handler - POST
  export const postAddCategory = async (req, res, next) => {
    try{
    const { categoryName, description } = req.body;
    const ifExists = await Category.findOne({
      name: new RegExp('^' + categoryName + '$', 'i'),
    });
    if (ifExists) {
      req.flash('error', 'Category with the same name already exists');
      return res.redirect('/admin/addCategory');
    }
    const category = new Category({
      name: categoryName,
      description,
    });
    await category.save();
    req.flash('success', 'Category Addeed Successfully');
    return res.redirect('/admin/addCategory');
  }catch (err) {
    next(err);
  }
  };
  
  // get all categories handler - GET
  export const getAllCategories = async (req, res, next) => {
    try{
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
    res.render('admin/categories/allCategories', {
      user: req.session.admin,
      categories: categories,
      errorMessage: errorMessage,
      successMessage: successMessage,
    });
  }catch(err){
    next(err);
  }
  };
  
  // edit category handler - PATCH
  export const patchEditCategory = async (req, res, next) => {
    try {
      const id = req.params.id;
      const updatedName = req.body.updatedCategoryName;
      const category = await Category.findOne({ _id: id });
  
      if (category.name === updatedName) {
        // Category names are the same, show a message
        req.flash('error', 'You did not make any change');
        return res
          .status(400)
          .json({ message: 'Category with the same name already exists.' });
      }
  
      // Check if a category with the updated name already exists
      const existingCategory = await Category.findOne({
        name: new RegExp('^' + updatedName + '$', 'i'),
      });
      if (existingCategory) {
        req.flash('error', 'Category with the same name already exists');
        return res
          .status(400)
          .json({ message: 'Category with the same name already exists.' });
      }
  
      // Update the category name
      category.name = updatedName;
      await category.save();
      req.flash('success', 'Category Edited Successfully');
      // Send a success response
      res.status(200).json({ message: 'Category updated successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
  // list category handler - PATCH
  export const patchListCategory = async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await Category.findOne({ _id: id });
  
      if (category) {
        if (category.isListed) {
          category.isListed = false;
          await category.save();
          req.flash('error', 'Category unListed Successfully');
          return res.status(200).json({ message: 'Success' });
        }
        category.isListed = true;
        await category.save();
        req.flash('success', 'Category Listed Successfully');
        return res.status(200).json({ message: 'Success' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  };