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
  const blocked = await isUserBlocked(req.session.email);
  if(blocked){
    return res.redirect('/logout');
  }
  next();
}
 
