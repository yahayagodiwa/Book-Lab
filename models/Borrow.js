const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  borrowNote: {
    type: String,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true
  },
  returned:{
    type: Boolean,
    default: false
  },
  borrowDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

const Borrow = mongoose.model('Borrow', borrowSchema);
module.exports = Borrow;
