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
//const {payments,ID_user}= require('./cron')







const asyncHandler = require('express-async-handler')
const PR = require('./models/prModel')
const Trip = require('./models/goalModel')
const User = require('./models/userModel')
const Ledger = require('./models/ledgerModel')
const schedule = require('node-schedule')


var ID_user = null
var flag
schedule.scheduleJob('*/5 * * * * *',async()=>{
     //console.log(ID_user)
   const prs = await PR.findOne({"status" : "created"})
   //console.log(prs)
   //console.log(prs.amount)
   var amt = 0
   if(prs){
       amt = prs.amount
       var trip = await Trip.findOne({_id:prs.trip_id}) 
       //console.log(trip)
       var user = await User.findOne({ _id: trip.user })
       ID_user = user._id.toString()
       console.log(user)
      // console.log(ID_user)
   }
   if(amt>=1000){
       flag=1
     const updatedStatus = await PR.findByIdAndUpdate(prs._id,{status:"success"}, {
         new: true,
       })
     //   const trip = await Trip.findOne({_id:prs.trip_id}) 
     //   //console.log(trip)
     //   const user = await User.findOne({ _id: trip.user })
       //console.log(user)
       console.log(user._id.toString())
       await Ledger.create({
         amount:amt,
         user_id:user._id,
         type:'debit',
       })
       
   }else if (amt != 0){
       flag = 2
     const updatedStatus = await PR.findByIdAndUpdate(prs._id,{status:"failed"}, {
         new: true,
       })
     //   const trip = await Trip.findOne({_id:prs.trip_id}) 
     //   console.log(trip)
     //   const user = await User.findOne({ _id: trip.user })
     //   console.log(user)
   }
   
   //console.log(ID_user+"hellooo")
 //   io.on('connection',(socket)=>{
 //     console.log("User Connected"); 
 //     console.log(socket.id)
     
 //     socket.on("message",(data) =>{
 //         console.log(data)
 //         // console.log(ID_user + "hello")
 //         // socket.broadcast.to(ID_user).emit("message",data)
 //         //io.emit('receive',data)
 //         io.emit('custom-event',data) 
 //     })
 //     socket.on('join', function (data) {
 //         console.log(data)
 //       });
 
 //       //io.emit('receive',"hello")
       
 // })
 
 })













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

const server = app.listen(port, () => console.log(`server started on port ${port} `))

const {Server} = require('socket.io')
const io = new Server(server,{
    cors:{
        origin:true,
    }
})
//require('./cron')(io)

io.on('connection',(socket)=>{
    console.log("User Connected"); 
    //console.log(socket.id)
    //console.log(ID_user+"hello")
    socket.on('login', function(data){
        console.log('a user ' + data.userID + ' connected');
        // saving userId to object with socket ID
        //users[socket.id] = data.userId;
        //console.log(flag)
        if(data.userID == ID_user)
            if(flag == 1)    
            io.emit('custom-event',"Payment Processed")
            else if(flag == 2)
              io.emit('custom-event',"Payment Failed")
          else 
             io.emit('custom-event',"Unprocessed")
          
      });
    
    socket.on("message",(data) =>{
        console.log(data)
        // console.log(ID_user + "hello")
        // socket.broadcast.to(ID_user).emit("message",data)
        //io.emit('receive',data)
        io.emit('custom-event',data) 
    })
    socket.on('join', function (data) {
        console.log(data)
      });
      //io.emit('custom-event',"hello") 
      
      //io.emit('receive',"hello")    
})


// var consumer = require('./cron.js');
// consumer.start(io);

// function message (userId, event, data) {
//     io.sockets.to(userId).emit(event, data);
// }
