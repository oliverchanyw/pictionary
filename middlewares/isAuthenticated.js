var isAuthenticated = function (req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    req.session.save(function(err) {
      res.redirect('/login');
    });
  }
};

module.exports = isAuthenticated;
