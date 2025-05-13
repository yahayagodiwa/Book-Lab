const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectSring = process.env.DATABASE_URL

const connectDb = async ()=>{
    try {
        await mongoose.connect(connectSring)
        // console.log(connectSring);
        
        console.log('Database connected');
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = connectDb