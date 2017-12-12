var express = require('express');
var app = express();
var uuid = require('node-uuid');
var keyRoutes = require('./routes/keys');
var checkValidKey = require('./middlewares/checkValidKey');
var apiRoutes = require('./routes/api');
var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var loginRoutes = require('./routes/login');
var isAuthenticated = require('./middlewares/isAuthenticated');
var reviewRoutes = require('./routes/reviews');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

// Display index page
app.get('/', function (req, res) {
  res.render('index');
});

app.use('/', keyRoutes);
app.use('/api', checkValidKey, apiRoutes);

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

app.use(cookieSession({secret: generateCookieSecret()}));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', loginRoutes);
app.use('/reviews', isAuthenticated, reviewRoutes);


app.use(handleError);
app.use(pageNotFound);

module.exports = app;
