const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    type: Number,
    default: 0,
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }
})

const Like = mongoose.model("Like", likeSchema)

module.exports = Like