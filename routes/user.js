const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

router.post('/requestOtp', userController.requestOtp);

router.post('/checkOtp', userController.checkOtp);

router.post('/signUp', userController.signUp);

router.post('/login', userController.login);

module.exports = router;