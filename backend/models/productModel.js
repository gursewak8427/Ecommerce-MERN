const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    productName: {
        type: String,
    },
    productBrand: {
        type: String,
    },
    productParents: {
        category: {
            type: String,
        },
        subCategory: {
            type: String,
        },
    },
    ProductShortDisc: {
        type: String,
    },
    productDisc: {
        type: String,
    },
    productKeywords: {
        type: String,
    },
    productImages: [String],
    productStatus: {
        type: String,
    },
    productPricing: {
        price : String,
        mrp: String
    },
    CoverImages: [String],
    productType: {
        type: String,
        default: 0
    },
    productVarients: [{
        _id: String,
        varienteAttributes: [
            {
                attr_id: String,
                value: String,
            }
        ],
        general: {
            images: [String],
            price: String
        }
    }],
});

module.exports = Product = mongoose.model('product', ProductSchema);