var express = require('express');
var router = express.Router();
var auth = require('../control/auth')
var authMiddle = require('../middlewares/authMiddle') ;
var usersControl = require('../control/usersControl');

router.get('/login', auth.login);
router.post('/login/is', auth.isLogin);
router.get('/logout', authMiddle ,usersControl.logout);

module.exports = router;
