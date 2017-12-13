var express = require('express');
var router = express.Router();
var db = require('../db/mongo');


router.get('/', function (req, res, next) {
  req.session.reload(function (err) {
    res.render('login', {initialName: req.session.user});
  });
});

router.post('/', function (req, res, next) {
  if (req.body.newUsername) {
    db.addNewUser(req.body.newUsername, req.body.newPassword, function () {
      res.send('Account created');
    }, function () {
      res.send("The username '" + req.body.newUsername + "' already exists, pick a new one!!");
    });
  } else {
    var failCB = function (req, res, next) {
      return function () {
        req.session.failedLogin = true;
        res.redirect('/login');
      };
    };

    var successCB = function (req, res, next) {
      return function () {
        req.session.failedLogin = false;
        req.session.isAuthenticated = true;
        req.session.user = req.body.username;
        req.session.save(function (err) {
          res.redirect('/play');
        });
      };
    };

    db.credentialsAreValid(req.body.username, req.body.password,
      successCB(req, res, next), failCB(req, res, next));
  }
});

module.exports = router;
