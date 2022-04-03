const asyncHandler = require('express-async-handler')
const PR = require('./models/prModel')
const Trip = require('./models/goalModel')
const User = require('./models/userModel')
const Ledger = require('./models/ledgerModel')
const schedule = require('node-schedule')
// const { Socket } = require('socket.io')
// const io = require("socket.io")(3000,{
//     cors:['http://localhost:6000']
// })
//const io = require( './server' ); 
var ID_user
const payments = asyncHandler(async (req, res) => {
    schedule.scheduleJob('*/2 * * * * *',async()=>{
       // console.log(ID_user)
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
         // console.log(ID_user)
      }
      if(amt>=1000){
        const updatedStatus = await PR.findByIdAndUpdate(prs._id,{status:"success"}, {
            new: true,
          })
        //   const trip = await Trip.findOne({_id:prs.trip_id}) 
        //   //console.log(trip)
        //   const user = await User.findOne({ _id: trip.user })
          console.log(user)
          console.log(user._id.toString())
          await Ledger.create({
            amount:amt,
            user_id:user._id,
            type:'debit',
          })
          
      }else if (amt != 0){
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

    })
    // var wsserver = require( './server' ); 
    // wsserver.io.sockets.emit('this', { will: 'be received by everyone' });

module.exports={payments,ID_user}
