const mongoose = require('mongoose')

const podSchema = mongoose.Schema(
  {
    trip_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Goal',
      }, 
    pod: {
      type: String,
      required: [true, 'Please add an image'],
    },
    status: {
      type: String,
      enum : ['created','approved','rejected'],
  },
  }, 
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('POD', podSchema)