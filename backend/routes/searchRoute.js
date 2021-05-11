const router = require('express').Router();
const url = require('url');

// Load models
const Product = require('../models/productModel');
const Attribute = require('../models/attributeModel');
const RawData = require('../models/rawDataModel');
const General = require('../models/generalModel');

router.post('/search', async (req, res) => {
    let data
    let item = req.body.item
    let count = req.body.count
    let limit = req.body.limit
    let skip = count * limit - limit

    let sortingMethod = req.body.sortingMethod
    let priceSort
    if (sortingMethod == 3) {
        priceSortMethod = 'productOverallMinPrice'
        priceSort = 1
    }
    if (sortingMethod == 4) {
        priceSortMethod = 'productOverallMaxPrice'
        priceSort = -1
    }

    let priceRange = req.body.priceRange
    let minPrice = priceRange[0] == -1 ? 0 : parseInt(priceRange[0])
    let maxPrice = priceRange[1] == -1 ? 100000000000 : parseInt(priceRange[1])

    let filterCategory = req.body.filterCategory

    console.log(req.body)

    if (filterCategory == -1) {
        if (sortingMethod == 1) {
            data = await Product.find(
                {
                    'productName': { $regex: item, $options: 'i' },
                    $or: [{ 'productOverallMinPrice': { $gte: minPrice, $lte: maxPrice } }, { 'productOverallMaxPrice': { $gte: minPrice, $lte: maxPrice } }]
                }
            ).skip(skip).limit(limit)
        } else {
            data = await Product.find(
                {
                    'productName': { $regex: item, $options: 'i' },
                    $or: [{ 'productOverallMinPrice': { $gte: minPrice, $lte: maxPrice } }, { 'productOverallMaxPrice': { $gte: minPrice, $lte: maxPrice } }]
                }
            ).skip(skip).limit(limit).sort([[priceSortMethod, priceSort]])
        }
    } else {
        if (sortingMethod == 1) {
            data = await Product.find(
                {
                    'productName': { $regex: item, $options: 'i' },
                    $or: [{ 'productOverallMinPrice': { $gte: minPrice, $lte: maxPrice } }, { 'productOverallMaxPrice': { $gte: minPrice, $lte: maxPrice } }]
                }
            ).where('productParents.category').equals([filterCategory]).skip(skip).limit(limit)
        } else {
            data = await Product.find(
                {
                    'productName': { $regex: item, $options: 'i' },
                    $or: [{ 'productOverallMinPrice': { $gte: minPrice, $lte: maxPrice } }, { 'productOverallMaxPrice': { $gte: minPrice, $lte: maxPrice } }]
                }
            ).skip(skip).where('productParents.category').equals([filterCategory]).limit(limit).sort([[priceSortMethod, priceSort]])
        }
    }
    console.log(data.length)
    res.json({
        items: data
    })
})

module.exports = router;

