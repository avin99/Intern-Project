const mongoose = require('mongoose')

const cardSchema = mongoose.Schema(
  {
  price: {
      type: Number,
  },
  penalty: {
      type: Number,
  },
  incentive: {
      type: Number,
  },
}
)

module.exports = mongoose.model('Card', cardSchema)