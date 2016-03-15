var router = require('express').Router();
var authConfig = require('../config/auth-config');

router.get('/auth/facebook', authConfig.facebookLogin);

router.get('/profile', authConfig.facebookCallback);

module.exports = router;