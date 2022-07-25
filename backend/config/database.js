const mongoose = require("mongoose")



const connectDB = () => {



    mongoose.connect(process.env.MONGO_URI, {
        //userNewUrlParser:true,
        useUnifiedTopology:true,
        //useCreateIndex:true,
    }).then(
        (data) => {
            
            console.log(`Mongo DB is connected with server: ${data.connection.host}`);
        }
    )
}

module.exports = connectDB