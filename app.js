var express = require('express');
var app = express();
var uuid = require('node-uuid');

var homeRoutes = require('./routes/home');
var loginRoutes = require('./routes/login');
var playRoutes = require('./routes/play');

var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');
var isAuthenticated = require('./middlewares/isAuthenticated');

var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

// Middlewares for readability
app.use(cookieSession({secret: generateCookieSecret()}));
app.use(bodyParser.urlencoded({extended: false}));

// Display pages
app.use('/', homeRoutes);
app.use('/login', loginRoutes);
app.use('/play', isAuthenticated, playRoutes);

app.use(handleError);
app.use(pageNotFound);

module.exports = app;
