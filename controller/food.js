const User = require('../model/user');
const Food = require('../model/food');

/**
 * addFood
 */
exports.addFood = async (req, res, next) => {
    try {
        const foodCount = await Food.find().count();
        const newFood = new Food({
            foodList: req.body.foodList,
            philanthropist: req.body.clientId,
            foodCode: (foodCount + 1)
        });

        const savedFood = await newFood.save();
        const user = await User.findOne({_id: req.body.clientId});

        if (user) {
            user.foods.push(savedFood);
            await user.save();

            console.log('food added');
            return res.status(200).json({
                has_error: false,
                code: 100,
                foodCode: savedFood.foodCode
            });

        } else {
            console.log('addFood, user not found');
            return res.status(200).json({
                has_error: true,
                code: 5 // user not found
            });
        }
    } catch (e) {
        console.log(e);
        res.status(200).json({
            has_error: true,
            code: 500
        });
    }
};

/**
 * reserveFood
 * this method call by charity (userType == 0)
 */
exports.reserveFood = async (req, res, next) => {
    try {
        const food = await Food.findOne({_id: req.body.foodId});

        // check reservation
        if (food.charity) {
            console.log('food reserved by another charity');
            return res.status(200).json({
                has_error: true,
                code: 6 // food reserved by another charity
            });
        }

        food.charity = req.body.clientId;
        food.isReserved = true;
        food.reserveAt = new Date().getTime();

        const newFood = await food.save();
        const charity = await User.findOne({_id: req.body.clientId});

        charity.foods.push(newFood);

        const _ = await charity.save();

        console.log('food reserved');
        return res.status(200).json({
            has_error: false,
            code: 100,
            foodCode: newFood.foodCode
        });

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            has_error: true,
            code: 500
        });
    }
};

/**
 * homeList
 */
exports.philanthropistHomeList = (req, res, next) => {
    Food
        .find({philanthropist: req.body.clientId, isReserved: true})
        .select('charity _id createAt reserveAt foodCode')
        .populate('charity', 'userName phoneNumber address')
        .exec()
        .then(foods => {
            return res.status(200).json({
                has_error: false,
                code: 100,
                count: foods.length,
                charities: foods.map(food => {
                    return {
                        foodId: food._id,
                        createAt: food.createAt,
                        reserveAt: food.reserveAt,
                        charityId: food.charity._id,
                        phoneNumber: food.charity.phoneNumber,
                        userName: food.charity.userName,
                        address: food.charity.address,
                        foodCode: food.foodCode
                    }
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                has_error: true,
                code: 500
            });
        });
};

/**
 * charityHomeList
 */
exports.charityHomeList = (req, res, next) => {
    Food
        .find({charity: req.body.clientId, isReserved: true})
        .select('philanthropist _id createAt reserveAt foodCode')
        .populate('philanthropist', 'userName phoneNumber')
        .exec()
        .then(foods => {
            return res.status(200).json({
                has_error: false,
                code: 100,
                count: foods.length,
                charities: foods.map(food => {
                    return {
                        foodId: food._id,
                        createAt: food.createAt,
                        reserveAt: food.reserveAt,
                        philanthropistId: food.philanthropist._id,
                        phoneNumber: food.philanthropist.phoneNumber,
                        userName: food.philanthropist.userName,
                        foodCode: food.foodCode
                    }
                })
            });

        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                has_error: true,
                code: 500
            });
        });
};

/**
 * foodDetails
 */
exports.foodDetails = (req, res, next) => {
    Food
        .findOne({_id: req.body.foodId})
        .exec((err, food) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    has_error: true,
                    code: 500
                });
            } else {
                return res.status(200).json({
                    has_error: false,
                    code: 100,
                    foodList: food.foodList.map(food => {
                        return food
                    })
                });
            }
        });
};

/**
 * newFoodsList
 */
exports.newFoodsList = async (req, res, next) => {
    let foods;

    try {
        foods = await Food.find({isReserved: false})
            .select('philanthropist _id createAt foodCode')
            .populate('philanthropist', 'userName phoneNumber -_id');
    } catch (e) {
        console.log(e.message);
        return res.status(200).json({
            has_error: true,
            code: 500
        });
    }

    if (foods.length == 0) {
        return res.status(200).json({
            has_error: true,
            code: 9 // no new food
        });
    } else {
        return res.status(200).json({
            has_error: false,
            code: 100,
            charities: foods.map(food => {
                return {
                    createAt: food.createAt,
                    foodId: food._id,
                    phoneNumber: food.philanthropist.phoneNumber,
                    userName: food.philanthropist.userName,
                    foodCode: food.foodCode
                };
            })
        });
    }
};

