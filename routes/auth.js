var router = require('express').Router();
var authConfig = require('../config/auth-config');

router.get('/', function(req,res){
	res.send('viChat API is working!');
});

router.post('/login', authConfig.localLogin);

router.post('/register', authConfig.localRegister);

module.exports = router;