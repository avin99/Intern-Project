const mongoose = require('mongoose')

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    }, 
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Card',
    }
  },
  {
    //this will add updated at and created at field automatically
    timestamps: true,
  }
)

module.exports = mongoose.model('Goal', goalSchema)