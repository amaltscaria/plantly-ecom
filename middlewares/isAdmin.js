export const isAuthenticated = (req, res, next) => {
    if(!req.session.admin){
        return res.redirect('/admin');
    }
    return next();
}

export const isLoggedIn = (req, res, next) => {
    if(!req.session.admin){
      return next();
    }
      return res.redirect('/admin/dashboard');
} 