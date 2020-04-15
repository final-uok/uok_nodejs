const express = require('express');
const router = express.Router();

const checkController = require('../controller/check');

router.post('/charity', checkController.charityPolling);

module.exports = router;
