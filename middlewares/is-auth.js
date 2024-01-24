import {isUserBlocked} from '../utils/isBlocked.js'
export const isValid = (req,res,next) => {
  if (!req.session.user) {
        return res.redirect('/signup');
      } 
      next();
}
export const isLoggedIn = (req, res, next) => {
  if(!req.session.email){
    return next();
  }
    return res.redirect('/home');
}
export const isAuthenticated = (req, res, next) => {
  if(!req.session.email){
    return res.redirect('/login');
  }
    return next();
}
//If the user is blocked

export const isBlocked = async (req, res, next) => {
  try{
  const blocked = await isUserBlocked(req.session.email);
  if(blocked){
      req.flash('error', 'You have been blocked by the admin');
    return res.redirect('/logout');
  }
  next();
}catch(err) {
  next(err);
}
}
 
