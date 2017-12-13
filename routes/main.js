var express = require('express');
var router = express.Router();
var db = require('../db/mongo');

// If isAuthenticated, play. Else login first
router.get('/', function (req, res, next) {
  if (req.session.isAuthenticated) {
    req.session.save(function (err) {
      res.redirect('/play');
    });
  } else {
    req.session.save(function (err) {
      res.redirect('/login');
    });
  }
});

module.exports = router;
