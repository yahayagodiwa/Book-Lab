const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    reviewAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    }
})


const Review = mongoose.model("Review", reviewSchema)

module.exports = Review