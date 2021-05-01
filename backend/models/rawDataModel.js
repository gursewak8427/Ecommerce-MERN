const mongoose = require('mongoose');

const RawDataSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    categories: [{
        _id: String,
        categoryName: String,
        categoryIndex: String,
        categoryImage: String
    }],
    subCategories: [{
        _id: String,
        subCategoryName: String,
        subCategoryIndex: String,
        subCategoryParent: String,
        subCategoryImage: String
    }]
});

module.exports = RawData = mongoose.model('rawdata', RawDataSchema);