var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var User = new Schema({
	local : {
		email : {
			type : String,
			lowercase : true,
			unique : true,
			required : true
		},
		password : {
			type : String,
			required : true
		},
		token : {
			type : String
		}
	},
	facebook : {
		id : String,
		token : String,
		email : String
	}
});

User.methods.hashPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

User.methods.validatePassword = function(password){
	bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", User);