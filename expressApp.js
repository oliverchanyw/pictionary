var express = require('express');
var app = express();

var loginRoutes = require('./routes/login');
var playRoutes = require('./routes/play');
var mainRoute = require('./routes/main');

var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');
var isAuthenticated = require('./middlewares/isAuthenticated');

var bodyParser = require('body-parser');
var session = require('express-session');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/client'));

// Middlewares for readability
app.use(session({secret: 'cheetos', resave: false, saveUninitialized: true}));
app.use(bodyParser.urlencoded({extended: false}));

// Display pages
app.get('/', mainRoute);
app.use('/play', isAuthenticated, playRoutes);
app.use('/login', loginRoutes);

app.use(handleError);
app.use(pageNotFound);

module.exports = app;
