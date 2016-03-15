var databaseConfig = {
	"url" : "mongodb://root:root@ds015919.mlab.com:15919/vichat"
}

var jwtConfig = {
	"secret" : "IWillHackYou",
	"expiresInMinutes" : 2880
}

module.exports.databaseConfig = databaseConfig;
module.exports.jwtConfig = jwtConfig;

