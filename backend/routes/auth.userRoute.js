const router = require('express').Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const url = require('url');

// Load models
const User = require('../models/userModel');


router.post('/userSignup', async (req, res) => {
    const { name, number, password } = req.body
    var user = await User.findOne({ phone: req.body.number })
    if (user) {
        res.status(400).json({
            error: "Number Already exist. Please Login"
        })
    } else {

        let new_id = await User.countDocuments()
        new_id += 1

        user = new User({
            _id: new_id,
            name,
            phone: number,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = jwt.sign(
            { id: user._id, name: user.name, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone
            }
        });
    }
})



router.post('/userSignin', async (req, res) => {
    const { phone, password } = req.body
    var user = await User.findOne({ phone: req.body.phone })
    if (!user) {
        res.status(400).json({
            error: "This number is not exist. Please Register First"
        })
    } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: 'Something went wrong in password hashing'
                })
            } else if (result) {
                const token = jwt.sign(
                    { id: user._id, name: user.name, phone: user.phone },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                res.json({
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        phone: user.phone
                    }
                });
            }
            else {
                return res.status(400).json({
                    error: 'Passwords don\'t match'
                })
            }
        })
    }
})


module.exports = router
