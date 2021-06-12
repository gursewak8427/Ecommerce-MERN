const router = require('express').Router();
const url = require('url');

// Load models
const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');


router.post('/get', async (req, res) => {
    const { userId, count } = req.body
    let limit = 5
    let skip = (count * limit) - limit
    var vendor = await Vendor.findOne({ _id: userId }, { orders: { $slice: [skip, limit] } })
    res.json({
        orders: vendor.orders
    })
})

// router.post('/set', async (req, res) => {
//     const { userId, cart } = req.body
//     var user = await User.findOne({ _id: userId })
//     user.cart = cart
//     await user.save()
//     res.json({
//         cart: user.cart
//     })
// })

router.post('/changeStatus', async (req, res) => {
    const { userId, orders, time } = req.body

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
    const { userId, orders, notify } = req.body
    var user = await User.findOne({ _id: userId })
    user.orders = orders
    if (user?.notifications) {
        user.notifications = [notify, ...user.notifications]
    } else {
        user.notifications = [notify]
    }
    user.newNotification = user.newNotification + 1
    user.save()

    res.json({
        message: 'All Status Change Successfully'
    })
})


router.post('/setNewNotify', async (req, res) => {
    var vendor = await Vendor.findOne({ _id: 1 })
    vendor.newNotification = 0
    vendor.save()
    res.json({
        newNotify: vendor.newNotification
    })
})

router.post('/getNewNotify', async (req, res) => {
    let vendor = await Vendor.findOne({ _id: 1 })
    res.json({
        newNotify: vendor.newNotification
    })
})

module.exports = router
