const express = require('express');
const router = express.Router();

const foodController = require('../controller/food');

router.post('/addFood', foodController.addFood);

router.post('/reserveFood', foodController.reserveFood);

router.post('/philanthropistHomeList', foodController.philanthropistHomeList);

router.post('/charityHomeList', foodController.charityHomeList);

router.post('/foodDetails', foodController.foodDetails);

router.get('/newFoodsList', foodController.newFoodsList);

module.exports = router;