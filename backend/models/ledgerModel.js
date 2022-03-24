const mongoose = require('mongoose')

const ledgerSchema = mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      }, 
    Type: {
      type: String,
      enum : ['credit','debit'],
      default:'debit'
  },
  }, 
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Ledger', ledgerSchema)