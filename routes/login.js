var express = require('express');
var router = express.Router();
var userDb = require('../db/user');


router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {
  if (userDb.credentalsAreValid(req.body.username, req.body.password)) {
    res.session.failedLogin = false;
    req.session.isAuthenticated = true;
    res.redirect('/lobby');
  } else {
    res.session.failedLogin = true;
    res.redirect('/login');
  }
});

module.exports = router;
