const asyncHandler = require('express-async-handler')
const PR = require('./models/prModel')
const Trip = require('./models/goalModel')
const User = require('./models/userModel')
const Ledger = require('./models/ledgerModel')
const schedule = require('node-schedule')

const payments = asyncHandler(async (req, res) => {
  
    schedule.scheduleJob('*/20 * * * * *',async()=>{
      const prs = await PR.findOne({"status" : "created"})
      //console.log(prs)
      //console.log(prs.amount)
      var amt = 0
      if(prs){
          amt = prs.amount
      }
      if(amt>=1000){
        const updatedStatus = await PR.findByIdAndUpdate(prs._id,{status:"success"}, {
            new: true,
          })
          const trip = await Trip.findOne({_id:prs.trip_id}) 
          console.log(trip)
          const user = await User.findOne({ _id: trip.user })
          console.log(user)
          await Ledger.create({
            amount:amt,
            user_id:user._id,
            type:'debit',
          })
      }else if (amt != 0){
        const updatedStatus = await PR.findByIdAndUpdate(prs._id,{status:"failed"}, {
            new: true,
          })
      }
    })

    })

module.exports={payments}