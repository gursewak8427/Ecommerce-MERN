const router = require('express').Router();
const url = require('url');

// Load models
const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');


router.post('/get', async (req, res) => {
    const { userId } = req.body
    var vendor = await Vendor.findOne({ _id: userId })
    res.json({
        orders: vendor.orders
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

router.post('/changeStatus', async (req, res) => {
    const { userId, orders } = req.body

    var vendor = await Vendor.findOne({ _id: 1 })
    vendor.orders = orders
    await vendor.save()

    var user = await User.findOne({ _id: userId })
    res.json({
        usserOrders: user.orders,
        message: 'Status Change Successfully'
    })
})


router.post('/changeStatus/user', async (req, res) => {
    const { userId, orders } = req.body
    var user = await User.findOne({ _id: userId })
    user.orders = orders
    user.save()
    res.json({
        message: 'All Status Change Successfully'
    })
})

module.exports = router
