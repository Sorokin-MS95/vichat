var passport = require('passport');
var jwt = require('jsonwebtoken');



var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var User = require('../models/user');
var appConfig = require('./app-config');

var localRegisterInit = function(req,email, password, callback){

	User.findOne({ "local.email" : email}, function(err, user){
		if (err){
			return callback(err);
		}

		if (user){
			var message = {
				success : false,
				message : "Such user registered"
			}
			return req.res.json(message);
			/*return callback(null, false);*/
		}

		var newUser = new User();
		newUser.local.email = email;
		newUser.local.password = newUser.hashPassword(password);
		var token = jwt.sign(user, appConfig.jwtConfig.secret, {
			expiresInMinutes: appConfig.jwtConfig.expiresInMinutes
		});
		newUser.local.token = token;
		newUser.save(function(err){
			if (err){
				throw err;
			}
			var message = {
				success: true,
				message: "You have been successfully registered",
				token : token
			}
			return req.res.json(message);
			/*return callback(null, newUser); */
		})
	})
}

var localLoginInit = function(req,email, password, callback){
	User.findOne({ "local.email" : email}, function(err, user){
		if (err){
			return callback(err);
		}

		if (!user || !user.validatePassword(password)){
			var message = {
				success : false,
				message : "No such user found"
			}

			return req.res.json(message);
			/*return callback(null, false);*/
		}
		return callback(null, user);
	})
}

var facebookInit = function(token, refreshToken, profile, callback){
	User.findOne( { "facebook.id" : profile.id}, function(err,user){
		if (err){
			return callback(err);
		}
		if (user){
			return callback(null, user);
		}
		var newUser = new User();
		newUser.facebook.id = profile.id;
		newUser.facebook.token = token;
		newUser.facebook.email = profile.email[0].value;
		newUser.save(function(err){
			if (err){
				throw err;
			}

			return callback(null, newUser);
		})
	})
}


var jwtInit = function(jwtPayload, callback){
	User.findOne( { id : jwtPayload.id}, function(err, user){
		if (err){
			return callback(err, false);
		}
		if (user){
			callback(null, user);
		} else {
			callback(null, false);
		}
	})
}

var localOptions = {
	usernameField : "emailAdress",
	passReqToCallback : true
}

var facebookConfig = {
	clientID : 549375151899230,
	clientSecret : "a1a3b11e3005352484ff5fdac02940c4",
	callbackURL : "http://localhost:8080/daashboard"
}

var jwtOptions = {
	jwtFromRequest : ExtractJwt.fromAuthHeader(),
	secretOrKey : appConfig.jwtConfig.secret
}

//register strategies

passport.use("local-register", new LocalStrategy(localOptions, localRegisterInit));
passport.use("local-login", new LocalStrategy(localOptions, localLoginInit));
passport.use(new FacebookStrategy(facebookConfig, facebookInit));
passport.use(new JwtStrategy(jwtOptions, jwtInit));

// user serializer
passport.serializeUser(function(user, callback){
	callback(null, user.id);
});

//	user deserializer
passport.deserializeUser(function(id, callback){
	User.findById(id, function(err, user){
		callback(err,user);
	})
});

module.exports = {
	localRegister : passport.authenticate("local-register", {
		successRedirect : '/dashboard',
		failureRedirect : '/register'
	}),
	localLogin : passport.authenticate("local-login", {
		failWithError : true
	}),
	facebookLogin : passport.authenticate("facebook", {scope : "email"}),
	facebookCallback: passport.authenticate("facebook", {
		successRoute : '/dashboard',
		failureRoute : "/"
	})
}