var express = require('express');
var router = express.Router();
var roomsDb = require('../db/room');

// If isAuthenticated, go to lobby. Else login first
router.get('/', function (req, res, next) {
  if (req.session.isAuthenticated) {
    res.redirect('/lobby');
  } else {
    res.redirect('/login');
  }
});

// If you go to lobby, you should see a lobby
router.get('/lobby', function (req, res, next) {
  res.render('lobby');
});

// If you request for a room in the lobby, go to that room
router.post('/lobby', function (req, res, next) {
  if (req.body.newRoom) {
    res.redirect('/lobby/newRoom');
  } else {
    roomsDb.activeRoom(req.body.roomID, res.redirect('/play/' + req.body.roomID));
  }
});

// Landing page to make new room
router.get('/lobby/newRoom', function (req, res, next) {
  res.render('hostNewRoom');
});

// If you make a new room, go to it and start playing
router.post('/lobby/newRoom', function (req, res, next) {
  roomsDb.addNewRoom(req.body.roomID, function () {
    res.render('hostNewRoom');
  });
});







// GET all
router.get('/all', function (req, res, next) {
  reviewsDb.getAllReviews(function (error, reviews) {
    if (error) {
      next(error);
    } else {
      res.send(reviews);
    }
  });
});

// GET search/:className
router.get('/search/:className', function (req, res, next) {
  reviewsDb.getReviewsByClassName(req.params.className, function (error, reviews) {
    if (error) {
      next(error);
    } else {
      res.send(reviews);
    }
  });
});



module.exports = router;
