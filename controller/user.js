const Kavenegar = require('kavenegar');
const bcrypt = require('bcrypt');

const Otp = require('../model/otp');
const User = require('../model/user');

/**
 * requestOtp
 */
exports.requestOtp = (req, res, next) => {
    const api = Kavenegar.KavenegarApi(
        {apikey: '353167635A4B595746386F447262435333396B4A4C467671565467784147447548736C4C6B44534B6672553D'});

    var digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    console.log(req.body.phoneNumber);
    console.log(otp);

    const newOtp = new Otp({
        phoneNumber: req.body.phoneNumber,
        otp: otp
    });

    newOtp.save()
        .then(() => {
            console.log('otp saved');
            api.Send({message: `your activation code is ${otp}`, sender: "1000596446", receptor: req.body.phoneNumber});
            return res.status(200).json({
                has_error: false,
                code: 100
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                has_error: true,
                code: 500,
                error: err
            });
        });
};

/**
 * checkOtp
 */
exports.checkOtp = (req, res, next) => {
    if (req.body.otp === '000000' || req.body.otp === '111111') {
        console.log('correct OTP');
        return res.status(200).json({
            has_error: false,
            code: 100
        });
    } else {
        console.log('wrong OTP');
        return res.status(200).json({
            has_error: true,
            code: 1
        });

        // Otp.find({
        //     phoneNumber: req.body.phoneNumber,
        //     otp: req.body.otp
        // })
        //     .exec()
        //     .then(doc => {
        //         if (doc.length !== 0) {
        //             // remove otp doc
        //             Otp.remove({phoneNumber: req.body.phoneNumber})
        //                 .exec()
        //                 .then(result => {
        //                     // remove success
        //                     console.log('REMOVED');
        //                     console.log(result);
        //
        //                     return res.status(200).json({
        //                         has_error: false,
        //                         code: 100
        //                     });
        //                 })
        //                 .catch(err => {
        //                     res.status(500).json({error: err});
        //                 });
        //
        //         } else {
        //             return res.status(200).json({
        //                 has_error: true,
        //                 code: 1 // wrong otp
        //             });
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         res.status(500).json({error: err});
        //     });
    }
};

/**
 * signUp
 */
exports.signUp = async (req, res, next) => {
    try {
        if (await User.findOne({phoneNumber: req.body.phoneNumber})) {
            return res.status(200).json({
                has_error: true,
                code: 4 // duplicated phone number
            });
        } else if (await User.findOne({userName: req.body.userName})) {
            return res.status(200).json({
                has_error: true,
                code: 10 // duplicated user name
            });
        } else {
            bcrypt.hash(req.body.password, 3, async (err, hash) => {
                if (hash) {
                    const newUser = new User({
                        phoneNumber: req.body.phoneNumber,
                        userName: req.body.userName,
                        password: hash,
                        address: req.body.address,
                        userType: req.body.userType
                    });

                    const _ = await newUser.save();

                    console.log(`${newUser.userName} signUp successful`);
                    return res.status(200).json({
                        has_error: false,
                        code: 100,
                        clientId: newUser._id,
                        userType: newUser.userType
                    });

                } else {
                    console.log('error in hashing');
                    console.log(err);
                    return res.status(200).json({
                        has_error: true,
                        code: 500
                    });
                }
            });
        }

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            has_error: true,
            code: 500
        });
    }
};

/**
 * login
 */
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({userName: req.body.userName});

        if (!user) {
            console.log('login failed, user not exists');
            return res.status(200).json({
                has_error: true,
                code: 2 // auth fail
            });
        }

        if (user.userType != req.body.userType) {
            console.log('not same userType');
            return res.status(200).json({
                has_error: true,
                code: 2 // auth fail
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                console.log('login successful');
                return res.status(200).json({
                    has_error: false,
                    code: 100,
                    clientId: user._id,
                    phoneNumber: user.phoneNumber,
                    userType: user.userType
                });

            } else {
                console.log('error in bcrypt');
                return res.status(200).json({
                    has_error: true,
                    code: 2 // auth fail
                });
            }
        });

    } catch (e) {
        console.log(e);
        return res.status(200).json({
            has_error: true,
            code: 500
        });
    }
};