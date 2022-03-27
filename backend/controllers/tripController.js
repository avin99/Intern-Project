//package so that we dont have to use try catch and then wrape it with each of the functions
const asyncHandler = require('express-async-handler')
//const multer = require('multer')
//bringing in our models
const Goal = require('../models/goalModel')
const User = require('../models/userModel')
const POD = require('../models/podModel')
const Ledger = require('../models/ledgerModel')
const PR = require('../models/prModel')
const schedule = require('node-schedule')
const { default: mongoose } = require('mongoose')

// const schedule = require('node-schedule')

// schedule.scheduleJob('*/20 * * * * *',()=>{
//     console.log("Running")
//   })
// @desc    Get goals 
// @route   GET /api/goals
// @access  Private
const gettrips = asyncHandler(async (req, res) => {
  
  const goals = await Goal.find({ user: req.user.id })
  //const goals = await Goal.find({ text: "text by nirbhay 2" })
  //console.log(goals)
  res.status(200).json(goals)
})

const getMsg = asyncHandler(async (req, res) => {
  
  const goals = await Ledger.find({ user_id: req.user.id })
  //const goals = await Goal.find({ text: "text by nirbhay 2" })
  //console.log(goals)
  res.status(200).json(goals)
})

const startTrip = asyncHandler(async (req, res) => {
  //console.log(req.user)
  

  const trip = await Goal.findById(req.params.id)

  if (!trip) {
    res.status(400)
    throw new Error('Trip is not assigned yet')
  }
  //console.log(trip)
  const currentUser = await User.findOne({_id:trip.user}) 
  //console.log(currentUser)
  res.send({
    success:true,
    message:`Trip by ${currentUser.name} with name ${trip.text} has been processed!`
  })
})

const endTrip = asyncHandler(async (req, res) => {
  //console.log(req.file)
  //const goals = await Goal.find({ user: req.user.id })
  
  
  const trip = await Goal.findById(req.params.id)

  if (!trip) {
    res.status(400)
    throw new Error('Trip is not assigned yet')
  }
  
   const Pod = await POD.create({
     trip_id:trip._id,
     pod:req.file.path,
     status:req.body.status,

   })
   
   const currentUser = await User.findOne({_id:trip.user}) 
   //console.log(currentUser)
   res.send({
     success:true,
     message:`Trip by ${currentUser.name} with name ${trip.text} has been ended!`,
     Pod
   })
})

const uploads = asyncHandler(async (req, res) => {
  
  
  const upload = await POD.find()
  //const goals = await Goal.find({ text: "text by nirbhay 2" })
  //console.log(goals)
  res.status(200).json(upload)
})

const ledgers = asyncHandler(async (req, res) => {
  
  
  const ledger = await Ledger.find()
  res.status(200).json(ledger)
})
const paymentReq = asyncHandler(async (req, res) => {
  
  
  const prs = await PR.find()
  res.status(200).json(prs)
})
const payments = asyncHandler(async (req, res) => {
  

schedule.scheduleJob('*/2 * * * * *',async()=>{
  const prs = await PR.find({"status" : "created"})
  //console.log(prs)
})


})

const podStatus = asyncHandler(async (req, res) => {
  //const pod = await POD.findById(req.params.id)
  const { status,amount } = req.body;
  //console.log(status)
if(status != "approved" && status != "rejected"){
  throw new Error('Please add a valid status')
}
const pods = await POD.findById(req.params.id)
//console.log(pods)
const trip = await Goal.findOne({_id:pods.trip_id}) 
//console.log(trip.user)
//console.log(trip._id)
// const check = await User.find({ _id: trip.user })
// console.log(check)

  if(status!= "rejected"){
  var paymentRequest = await PR.create({
    trip_id:trip._id,
    amount:amount,
  })}

  const updatedStatus = await POD.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if(status!="rejected")
  res.send({
    success:true,
    updatedStatus,
    paymentRequest,
  })
  else 
  res.send({
    success:true,
    updatedStatus,
  })
  //res.status(200).json(updatedStatus)
  
  
  
  
  // res.send({
  //   success:true,
  //   message:`This trip has been ${req.body.text}!`,
  // })
})
// @desc    Set goal
// @route   POST /api/goals
// @access  Private
const settrip = asyncHandler(async (req, res) => {
  const { email, text } = req.body
  if (!email || !text) {
    //setting the status before throwing the error
    res.status(400)
    //express way of handling error
    throw new Error('Please add all the fields')
  }
  const userInfo = await User.findOne({ email })
  console.log(userInfo)
  const goal = await Goal.create({
    text: req.body.text,
    user: userInfo.id,
  })

  res.status(200).json(goal)
})

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
const updatetrip = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user

  // if (goal.user.toString() !== req.user.id) {
  //   res.status(401)
  //   throw new Error('User not authorized')
  // }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedGoal)
})

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deletetrip = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res.status(400)
    throw new Error('Goal not found')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('User not found')
  }

  // Make sure the logged in user matches the goal user
  // if (goal.user.toString() !== req.user.id) {
  //   res.status(401)
  //   throw new Error('User not authorized')
  // }

  await goal.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  gettrips,
  settrip,
  updatetrip,
  deletetrip,
  startTrip,
  endTrip,
  uploads,
  podStatus,
  ledgers,
  paymentReq,
  getMsg,
  payments,
}