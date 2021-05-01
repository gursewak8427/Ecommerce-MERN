const router = require('express').Router();
const url = require('url');

// Load models
const Product = require('../models/productModel');
const Attribute = require('../models/attributeModel');
const RawData = require('../models/rawDataModel');

router.post('/insertProduct', async (req, res) => {
  let new_id = await Product.countDocuments()
  new_id += 1
  new_product = new Product({
    _id: new_id,
    productName: req.body.productName,
    productBrand: req.body.productBrand,
    productParents: req.body.parents,
    ProductShortDisc: req.body.productShortDisc,
    productDisc: req.body.productDisc,
    productKeywords: req.body.productkeywords,
    productStatus: req.body.productStatus,
  });

  var product = await new_product.save()
  console.log(product)
  res.status(201).send({
    message: 'Successfully Created Product',
    productId: product._id
  });
})

router.post('/insertProductVarient/', async (req, res) => {
  const adr = req.url
  const q = url.parse(adr, true)
  var qdata = q.query;
  const type = qdata.type
  const productId = qdata.p_id

  var myProduct = await Product.findOne({
    _id: productId
  })

  let new_varient = req.body.varients

  let new_id = myProduct.productVarients.length + 1
  const newVareint = {
    _id: new_id,
    varienteAttributes: new_varient,
    general: {
      price: 0,
      images: [],
    }
  }
  myProduct.productVarients.push(newVareint);
  let updateProduct = await myProduct.save()
  console.log(updateProduct)
  res.json({
    message: 'varient added successfully',
    'myVarients': updateProduct.productVarients
  })
})

// @ get Product varients

router.post('/getProduct/', async (req, res) => {
  const adr = req.url
  const q = url.parse(adr, true)
  var qdata = q.query;
  const type = qdata.type
  const productId = qdata.p_id

  var myProduct = await Product.findOne({
    _id: productId
  })
  res.json({ myProduct })
})

router.post('/updateProductType/', async (req, res) => {
  const adr = req.url
  const q = url.parse(adr, true)
  var qdata = q.query;
  const type = qdata.type
  const productId = qdata.p_id
  const pt = req.body.pt
  var myProduct = await Product.findOne({
    _id: productId
  })
  myProduct.productType = pt
  let updateProduct = await myProduct.save()
  res.json({
    message: 'product saved successfully',
    'myProduct': updateProduct
  })

})

router.post('/updateCoverImages/', async (req, res) => {
  const adr = req.url
  const q = url.parse(adr, true)
  var qdata = q.query;
  const type = qdata.type
  const productId = qdata.p_id

  var myProduct = await Product.findOne({
    _id: productId
  })
  const new_images = req.body.images
  new_images.map(img => {
    myProduct.CoverImages = [img]
  })
  let updateProduct = await myProduct.save()
  res.json({
    message: 'product saved successfully',
    'myProduct': updateProduct
  })

})

router.post('/deleteVarImage/', async (req, res) => {
  const { pId, varId, imgId } = req.body
  var myProduct = await Product.findOne({ _id: pId })
  myProduct.productVarients.map(varient => (
    varient._id == varId ? (
      varient.general.images.splice(imgId, 1)
    ) : null
  ))
  let updateProduct = await myProduct.save()
  res.json({
    message: 'product saved successfully',
    myProduct: updateProduct
  })
})


router.post('/deleteSimpleImage/', async (req, res) => {
  const { pId, imgId } = req.body
  var myProduct = await Product.findOne({ _id: pId })
  myProduct.productImages.splice(imgId, 1)
  let updateProduct = await myProduct.save()
  res.json({
    message: 'product saved successfully',
    myProduct: updateProduct
  })
})

router.post('/updateProductVarient/', async (req, res) => {
  const adr = req.url
  const q = url.parse(adr, true)
  var qdata = q.query;
  const type = qdata.type
  const productId = qdata.p_id

  var myProduct = await Product.findOne({
    _id: productId
  })

  const pt = req.body.pt
  if (pt == 0) {
    const pricing = {
      'price': req.body.price,
      'mrp': req.body.mrp
    }
    req.body.images.map(img => (
      myProduct.productImages.push(img)
    ))
    myProduct.productPricing = pricing
    myProduct.productType = pt
    console.log('myProduct')
    let updateProduct = await myProduct.save()
    res.json({
      message: 'product saved successfully',
      'myProduct': updateProduct
    })
  }

  if (pt == 1) {
    const var_id = qdata.var_id
    const new_price = req.body.price
    const new_images = req.body.images
    myProduct.productVarients.map(obj => {
      if (obj._id == var_id) {
        console.log(obj)
        obj.general.price = new_price
        new_images.map(img => {
          obj.general.images.push(img)
        })
      }
    })
    let updateProduct = await myProduct.save()
    res.json({
      message: 'varient added successfully',
      'myVarients': updateProduct.productVarients
    })
  }
})


// get product
// @ with categories
router.post('/product/get/category', async (req, res) => {
  let catId = req.body.category._id
  let myProducts = await Product.find({ "productParents.category": catId })
  let myCollection = {
    'category': req.body.category,
    'myProducts': myProducts
  }
  res.json({
    myCollection
  })
})

// @ with categories
router.post('/product/get/categoryAndSubCategory', async (req, res) => {
  let catId = req.body.category._id
  let subCatId = req.body.subCategory._id
  console.log(catId)
  console.log(subCatId)
  let myProducts = await Product.find({ "productParents.category": catId, "productParents.subCategory": subCatId })
  res.json({ myProducts })

})


// @ get-product
router.post('/updateProduct', async (req, res) => {
  let product = await Product.findOne({ _id: req.body.myProduct._id })
  product.productName = req.body.myProduct.productName
  product.productBrand = req.body.myProduct.productBrand
  product.productParents = req.body.myProduct.parents
  product.ProductShortDisc = req.body.myProduct.productShortDisc
  product.productDisc = req.body.myProduct.productDisc
  product.productStatus = req.body.myProduct.productStatus
  product.productKeywords = req.body.myProduct.productKeywords

  product = await product.save()
  res.json({
    product
  })
})


// @ with id
router.post('/getProductWithId', async (req, res) => {
  let id = req.body.id
  let myProduct = await Product.findOne({ _id: id })
  if (myProduct) {
    let myCollection = myProduct
    res.json({ myCollection })
  } else {
    res.json({ myCollection: null })
  }
})

// attrubute querries
// @ insert 
router.post('/insertAttribute/', async (req, res) => {
  let new_id = await Attribute.findOne().limit(1).sort({ $natural: -1 })
  if (new_id) {
    new_id = new_id._id + 1
  } else {
    new_id = 1
  }
  // let new_id = await Attribute.countDocuments()
  // new_id += 1
  let new_values = req.body.values.split(',')
  let i = 0
  while (i < new_values.length) {
    new_values[i] = new_values[i].trim()
    i += 1
  }
  const newAttr = {
    _id: new_id,
    attribute: req.body.attribute,
    values: new_values,
  }
  await Attribute.create(newAttr)
  let myAttributes = await Attribute.find()
  res.json({
    message: 'Attribute added successfully',
    myAttributes
  })
})
// @ get 
router.get('/getAttribute/', async (req, res) => {
  let myAttributes = await Attribute.find()
  res.json({
    message: 'Attribute added successfully',
    myAttributes
  })
})

// @ delete 
router.post('/deleteAttribute/', async (req, res) => {
  let myAttributes = await Attribute.findByIdAndRemove(req.body.id)
  let data = await Attribute.find()
  res.json({
    message: 'Attribute deleted successfully',
    myAttributes: data
  })
})


// category management
// @ add category

router.post('/insertCategory/', async (req, res) => {
  let myRawData = await RawData.findOne({ _id: 1 })
  var indexing = 0
  if (myRawData) {
    let newCatId = myRawData.categories.length + 1
    indexing = myRawData.categories[0].categoryIndex
    myRawData.categories.map(cat => (
      cat.categoryIndex > indexing ? indexing = cat.categoryIndex : null
    ))
    indexing = parseInt(indexing)
    indexing += 1
    const newCat = {
      _id: newCatId,
      categoryName: req.body.newCategoryName,
      categoryIndex: indexing,
      categoryImage: req.body.images[0]
    }
    myRawData.categories.push(newCat)
    let updateRawData = await myRawData.save()
    res.json({
      message: 'Categories Updated successfully added successfully',
      myCategories: updateRawData.categories
    })
  }
  else {
    indexing += 1
    const newCat = {
      _id: 1,
      categories: [{
        _id: 1,
        categoryName: req.body.newCategoryName,
        categoryIndex: indexing,
        categoryImage: req.body.images[0]
      }],
      subCategories: []
    }
    let updateRawData = await RawData.create(newCat)
    res.json({
      message: 'Category added successfully added successfully',
      myCategories: updateRawData.categories
    })
  }
})

router.get('/getCategories/', async (req, res) => {
  let myRawData = await RawData.findOne({ _id: 1 })
  if (myRawData) {
    let myCategories = myRawData.categories
    res.json({
      myCategories
    })
  } else {
    res.json({
      myCategories: []
    })
  }
})

router.get('/getRawData/', async (req, res) => {
  let myRawData = await RawData.findOne({ _id: 1 })
  if (myRawData) {
    res.json({
      myRawData
    })
  } else {
    res.json({
      myRawData: []
    })
  }
})

router.post('/setCategoryIndex', async (req, res) => {
  let categories = req.body.categories
  let myRawData = await RawData.findOne({ _id: 1 })
  myRawData.categories = categories
  let updateRawData = await myRawData.save()
  res.json({
    myCategories: updateRawData.categories
  })
})

router.post('/setSubCategoryIndex', async (req, res) => {
  let subCategories = req.body.subCategories
  let myRawData = await RawData.findOne({ _id: 1 })
  myRawData.subCategories = subCategories
  let updateRawData = await myRawData.save()
  res.json({
    mySubCategories: updateRawData.subCategories
  })
})
router.post('/insertSubCategory/', async (req, res) => {
  let myRawData = await RawData.findOne({ _id: 1 })
  let newSubCatId = myRawData.subCategories.length + 1

  var indexing = 0
  myRawData.subCategories.map(subCat => (
    subCat.subCategoryParent == req.body.parent ? (
      subCat.subCategoryIndex > indexing ? indexing = subCat.subCategoryIndex : null
    ) : null
  ))
  indexing = parseInt(indexing)
  indexing += 1

  const newCat = {
    _id: newSubCatId,
    subCategoryParent: req.body.parent,
    subCategoryName: req.body.newSubCategoryName,
    subCategoryIndex: indexing,
    subCategoryImage: req.body.images[0]
  }

  myRawData.subCategories.push(newCat)
  await myRawData.save()

  let mySubCategories = []
  myRawData.subCategories.map(subCat => subCat.subCategoryParent == req.body.parent ? mySubCategories.push(subCat) : null)

  res.json({
    message: 'Sub Categories Updated successfully added successfully',
    mySubCategories
  })
})


router.get('/getSubCategories/', async (req, res) => {
  const adr = req.url
  const q = url.parse(adr, true)
  var qdata = q.query;
  const parent = qdata.parent

  let myRawData = await RawData.findOne({ _id: 1 })
  if (myRawData) {
    let mySubCategories = []
    myRawData.subCategories.map(subCat => subCat.subCategoryParent == parent ? mySubCategories.push(subCat) : null)
    res.json({
      mySubCategories
    })
  } else {
    res.json({
      mySubCategories: []
    })
  }
})

module.exports = router;
