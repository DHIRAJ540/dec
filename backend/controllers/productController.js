const Product = require("../models/productModel")
const ErrorHandler = require("../util/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../util/apiFeatures");
const cloudinary = require("cloudinary")

// Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {

    let images = []

    if( typeof req.body.images === "string"){
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    const imagesLink = []

    for(let i = 0; i < images.length; i++){
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder:"products"
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLink
    req.body.user = req.user.id
  
    const product = await Product.create(req.body);
  
    res.status(201).json({
      success: true,
      product,
    });
  });

//get all products
exports.getaAllProducts = catchAsyncError(async (req, res) => {

    const resultPerPage = 8;

    const productsCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)

    
    const products = await apiFeature.query

    res.status(200).json({
        
        success:true,
        products,
        productsCount,
        resultPerPage
        
    })
})

//get all products --admin
exports.getaAdminProducts = catchAsyncError(async (req, res) => {

    const products = await Product.find()

    res.status(200).json({
        
        success:true,
        products,
        
        
    })
})

//update product --admin
exports.updateProduct = catchAsyncError(async (req, res) => {



    
    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("product not found", 404))
    }

    let images = []

    if( typeof req.body.images === "string"){
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if(images !== undefined){
        for(let i = 0; i < product.images.length; i++){
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id) 
         }

         const imagesLink = []

         for(let i = 0; i < images.length; i++){
             const result = await cloudinary.v2.uploader.upload(images[i], {
                 folder:"products"
             })
     
             imagesLink.push({
                 public_id: result.public_id,
                 url: result.secure_url
             })
         }

         req.body.images = imagesLink
    }




    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    } )

    res.status(200).json({
        success:true,
        product:product
    })
})

//delete product

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    //deleting images from cloudinary
    for(let i = 0; i < product.images.length; i++){
       const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id) 
    }

    if(!product){
        return next(new ErrorHandler("product not found", 404))
    }


    await product.remove();

    res.status(200).json({
        success:true,
        message:"product deleted successfully",
        product:product,
    })
})

//get single product
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      product,
    });
  });

//create new review and update previous review
exports.createProductReview = catchAsyncError(async (req, res, next) => {

    const {rating, comment, productId} = req.body

    const review = {
        user: req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product =  await Product.findById(productId)

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating = rating,
                rev.comment = comment

            }

        })
    }
    else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    let avg = 0
    
    product.reviews.forEach(rev => {
        avg+=rev.rating

    })

    product.ratings = avg/product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success: true
    })


})

//get all reviews

exports.getAllReviews = catchAsyncError(async (req, res, next) => {


    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("product not found", 404))
    }

    res.status(200).json({
        success:true,
        review : product.reviews
    })

})

//delete review
exports.deleteReview = catchAsyncError(async (req, res, next) => {


    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("product not found", 404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0
    
    reviews.forEach(rev => {
        avg+=rev.rating

    })

    let ratings = 0

    if(reviews.length === 0){
        ratings = 0
    } else {
       ratings = avg/reviews.length
    }

    

    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
       reviews,  numOfReviews,  ratings,
    }, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })


    res.status(200).json({
        success:true,
        
    })

})