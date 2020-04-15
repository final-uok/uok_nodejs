const User = require('../model/user');
const Food = require('../model/food');

/**
 * charityPolling
 */
exports.charityPolling = async (req, res, next) => {
    let foods;

    try {
        foods = await Food.find({
            isReserved: false,
            receivedQueue: {$not: {$in: [req.body.charityId]}}
        });

        if (foods.length > 0) {
            foods.map(async food => {
                food.receivedQueue.push(req.body.charityId);
                const _ = await food.save();
            });

            return res.status(200).json({
                has_error: false,
                code: 100
            });

        } else {
            res.status(200).json({
                has_error: true,
                code: 8 // charity already received notification, do not send food to it (no new food)
            });
        }

    } catch (e) {
        console.log(e);
        return res.status(200).json({error: e});
    }
};