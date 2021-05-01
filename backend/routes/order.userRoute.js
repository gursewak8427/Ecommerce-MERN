const router = require('express').Router();
const url = require('url');

// Load models
const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');

router.post('/add', async (req, res) => {
    const { userId, order } = req.body
    var user = await User.findOne({ _id: userId })
    user.orders.push(order)
    await user.save()
    
    var vendor = await Vendor.findOne({ _id: 1 })
    vendor.orders.push([userId, order])
    await vendor.save()
    
    res.json({
        message: "order placed successfully",
        orders: user.orders
    })
})


router.post('/get', async (req, res) => {
    const { userId } = req.body
    var user = await User.findOne({ _id: userId })
    res.json({
        orders: user.orders
    })
})

router.post('/set', async (req, res) => {
    const { userId, cart } = req.body
    var user = await User.findOne({ _id: userId })
    user.cart = cart
    await user.save()
    res.json({
        cart: user.cart
    })
})



module.exports = router
