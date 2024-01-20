import bcrypt from 'bcryptjs';

import Admin from '../../model/admin.js';

//admin register handler - GET
export const getSignup = async (req, res) => {
    res.render('admin/auth/signup');
  };
  
  //admin register handler - POST
  export const postSignup = async (req, res) => {
    const { name, email, password } = req.body;
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
  
    await admin.save();
    res.redirect('/admin');
  };
  
  //admin login handler - GET
  export const getLogin = async (req, res) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0];
    } else {
      errorMessage = null;
    }
    res.render('admin/auth/login', { errorMessage: errorMessage });
  };
  
  //admin login handler - POST
  export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash('error', 'The given email does not belong to an admin account');
      return res.redirect('/admin');
    }
    const verified = await bcrypt.compare(password, admin.password);
    if (verified) {
      req.session.admin = email;
      return res.redirect('/admin/dashboard');
    }
    req.flash('error', 'Incorrect Password');
    return res.redirect('/admin');
  };
  
  //admin logout handler - GET
  export const getLogout = async (req, res) => {
    try {
      req.session.admin = null;
      res.redirect('/admin');
    } catch (err) {
      res.status(500).json({ error: 'Internal Sever Error' });
    }
  };