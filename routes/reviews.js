var express = require('express');
var router = express.Router();
var reviewsDb = require('../db/reviews');

// Implement the routes.
// Note: the rating will be passed as a string (req.body.rating).
// Use Number() to transform it to a number before adding it to the database.

router.get('/new', function (req, res, next) {
  res.render('addreview');
});

router.post('/new', function (req, res, next) {
  if (req.body.className.length != '' && req.body.semester != '') {
    var reviewData = {className: req.body.className,
                      semester: req.body.semester,
                      rating: Number(req.body.rating),
                      text: req.body.text};
    reviewsDb.addReview(reviewData, function (err) {
      if (err) {
        next(err);
      } else {
        res.send('It worked!');
      }
    });
  } else {
    res.redirect('/reviews/new');
  }
});

module.exports = router;
