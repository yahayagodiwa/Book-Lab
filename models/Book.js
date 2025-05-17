const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  bookCover: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "General",
      "Fiction",
      "Non-Fiction",
      "Biography",
      "Autobiography",
      "Science Fiction",
      "Fantasy",
      "Mystery",
      "Thriller",
      "Romance",
      "Historical Fiction",
      "Horror",
      "Self-Help",
      "Health & Wellness",
      "Travel",
      "Science",
      "Technology",
      "Philosophy",
      "Psychology",
      "Religion & Spirituality",
      "Business & Economics",
      "Politics",
      "Education",
      "Art & Photography",
      "Comics & Graphic Novels",
      "Poetry",
      "Young Adult",
      "Children's Books",
      "Cooking",
      "Law",
      "Sports & Outdoors",
      "Parenting",
      "Crafts & Hobbies",
      "True Crime",
      "Memoir",
    ],
    default: "General",
  },
  fineAmount: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  publishedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
