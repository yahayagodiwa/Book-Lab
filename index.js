const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDb = require('./Db/connection')
const dotenv = require('dotenv')
dotenv.config()
const userRoutes = require('./routes/userRoutes')

const app = express()
const port = process.env.PORT
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.use('/user', userRoutes)


app.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`);
    connectDb()
    
})