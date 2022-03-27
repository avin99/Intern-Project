const express = require('express')

//writing here so that we can use it from anywhere
const colors = require('colors')
//It will allow us to have .env file with our variables in it.
//Environment variables are a fundamental part of developing with Node.js,
// allowing our app to behave differently based on the environment we want them to run in
const dotenv = require('dotenv').config()

//using our own errorHandler
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const {payments}= require('./cron')
//Its the port we want our server to run on
const port = process.env.PORT || 6000

connectDB()

//Initializes express
const app = express()

//middleware for handling body data through postman
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//i.e. if we hit this route we will we directed to these files and accordingly code will get executed
app.use('/api/trips',require('./routes/tripRoutes'))
app.use('/api/users',require('./routes/userRoutes'))

//after the routes writing this will overwrite the default errorhandler
app.use(errorHandler)
payments()
//with our app object we can call our listen method
// app.listen() function is used to bind and listen the connections on the specified host and port. 

app.listen(port, () => console.log(`server started on port ${port} `))
