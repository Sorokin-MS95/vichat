var express = require('express');
var passport = require('passport'); 		// passport authentication
var logger = require('morgan');				// adding logger support
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');	// todo implement sessions

var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); 			// adding json web token

var app = express();

var appConfig = require('./config/app-config');

var authRoutes = require('./routes/auth');	// auth routes
var apiRoutes = require('./routes/api');	// api routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(cookieParser());
app.use(logger("dev"));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);					// adding auth routes to Express
app.use('/api', apiRoutes);					// adding api routes to Express

//connecting to database
mongoose.connect(appConfig.databaseConfig.url);

var port = 8080;

app.listen(port, function(){
	console.log('Listening on port', + port);
});



