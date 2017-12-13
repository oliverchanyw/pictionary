var express = require('express');
var router = express.Router();
var db = require('../db/mongo');

// If isAuthenticated, play. Else login first
router.get('/', function (req, res, next) {
  res.render('play', {initialName: req.session.user});
});

module.exports = router;
