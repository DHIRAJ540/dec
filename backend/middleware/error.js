const ErrorHandler = require("../util/errorHandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error"

    //wrong mono id err
    if(err.name === "CastError"){
        const message = `Invalid ID ${err.path}`

        err = new ErrorHandler(message, 400)
    }

    //mogoose duplicate err
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)

    }
    
    //wrong jwt
    if(err.name === "JsonWebTokenError"){
        const message = `JSON web token is inalid try again`
        err = new ErrorHandler(message, 400)

    }

    //JWT expired error
    if(err.name === "TokenExpiredError"){
        const message = `JSON web token is expired`
        err = new ErrorHandler(message, 400)

    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}