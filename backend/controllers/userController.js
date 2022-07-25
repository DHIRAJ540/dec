const ErrorHandler = require("../util/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../util/jwtToken");
const sendEmail = require("../util/sendEmail")
const crypto = require("crypto")
const cloudinary = require('cloudinary')

//Registration user
exports.registerUser = catchAsyncError(async (req, res, next) => {

    
    
   
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
    
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
  
    sendToken(user, 201, res);
  });
  
//login user

exports.loginUser = catchAsyncError(async(req, res, next) => {
    const{email, password} =  req.body

    //checking if user has given emila and password both
    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400))

    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
       return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
       return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 200, res)

})

//logout user
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
})

//forgot password
exports.forgotPassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("Email not registered", 404))
    }

    //get reset password token

   const resetToken = user.getResetPasswordToken();

   await user.save({validateBeforeSave: false})

   const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
    )}/password/reset/${resetToken}`;

   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please ignore it`

   try {

    await sendEmail({
        email:user.email,
        subject:`Ecommerce password recovery`,
        message
    })

    res.status(200).json({
        success:true,
        message:`email sent to ${user.email} successfully`
    })

       
   } catch (error) {
       user.resetPasswordToken = undefined
       user.resetPasswordExpire = undefined

       await user.save({validateBeforeSave: false})

       return next(new ErrorHandler(error.message, 500))

   }
})

//resetoassword
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    
    //creatin token hash
    const tokenCrypto = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const resetPasswordToken = tokenCrypto

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire:{$gt: Date.now()}})

    if(!user){
        return next(new ErrorHandler("reset password token is invalid or has been expired", 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password must be same in both fields", 400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)

})

//get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    
    
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})

//update user password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    
    
    const user = await User.findById(req.user.id).select("+password")

    

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    

    if(!isPasswordMatched){
       return next(new ErrorHandler("Old password is incorrect", 401))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("password must be same in both fields", 400))
    }

    user.password = req.body.newPassword

    await user.save()
    

    sendToken(user, 200, res)
})

//update profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email:req.body.email,

    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    

    res.status(200).json({
        success:true,
        user
    })
})

//get all users --admin
exports.getAllUsers = catchAsyncError(async(req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success:true,
        users
    })
})

//get single user --admin
exports.getSingleUser = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`user is not available with id ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//update user role --admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
        role : req.body.role
    }


    let user = User.findById(req.params.id)

    if(!user){
        return next(
            new ErrorHandler(`User doesn't exist with ID: ${req.params.id}`, 400)
        )
    }

     user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    

    res.status(200).json({
        success:true,
        user
    })
})

//Delete user --admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    




    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`user not exists with id ${req.params.id}`))
    }

    const imageId = user.avatar.public_id;
    
    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove()

    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })
})

