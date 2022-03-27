const mongoose = require('mongoose')

const prSchema = mongoose.Schema(
  {
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Goal',
      }, 
    status: {
      type: String,
      enum : ['created','success','failed'],
      default : 'created'
  },
  amount: {
      type: Number,
  },
  }, 
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('PR', prSchema)