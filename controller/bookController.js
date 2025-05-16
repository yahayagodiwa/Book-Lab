const Book = require('../models/Book');
const User = require('../models/User')
const Review = require('../models/Review')

const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const Borrow = require('../models/Borrow');

//////--------------------------------- Cloudinary -------------------------------//////////////////

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Book",
        width: 500,
        crop: "scale",
      },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary upload failed:", error);
          reject(error);
        } else {
          console.log("✅ Cloudinary upload success:", result.secure_url);
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

//////--------------------------------- Create book record -------------------------------//////////////////
//////--------------------------------- Create book record -------------------------------//////////////////

const recordBook = async (req, res) => {
  try {
    const { title, description, fineAmount } = req.body;

    // Validation
    if (!title || !description || !fineAmount) {
      return res.status(400).json({ error: "All fields required" });
    }
    if (title.length < 6) {
      return res.status(400).json({ error: "Title must be at least 6 characters long" });
    }

    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(400).json({ error: "Book already exists" });
    }

    const file = req.file;
    if (!file || !file.buffer) {
      return res.status(400).json({ error: "Book cover required" });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const fileSizeLimit = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Invalid image type" });
    }
    if (file.size > fileSizeLimit) {
      return res.status(400).json({ error: "Image size exceeds limit" });
    }

    // Upload to Cloudinary
    const result = await streamUpload(file.buffer);

    // Create and save book
    const newBook = new Book({
      title,
      description,
      bookCover: result.secure_url,
      fineAmount,
      category: req.body.category,
      author: req.user._id
    });

    await newBook.save();

    const user = await User.findById(req.user._id)
      user.books.push(newBook);
      await user.save();
      

    return res.status(201).json({
      message: "Book recorded successfully",
      book: newBook,
      user
    });

  } catch (error) {
    console.error("🔥 Error saving book:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

//////--------------------------------- Get All book -------------------------------//////////////////

const allBook = async (req, res)=>{
   try {
    const books = await Book.find()
    return res.status(200).json({message: "All book fetched", books})
   } catch (error) {
    console.error("🔥 Error saving book:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
   }
}

//////--------------------------------- Get singl book -------------------------------//////////////////
const singleBook = async (req, res)=>{
    try {
        const { id } = req.params;
        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid book ID" });
          }
      
          const book = await Book.findById(id).populate("reviews", "comment rating reviewAuthor");
      
          if (!book) {
            return res.status(404).json({ error: "Book not found" });
          }
      
          return res.status(200).json({ message: "Book fetched", book });
    } catch (error) {
        console.error("🔥 Error saving book:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message }); 
    }
}

//////--------------------------------- Borrow book -------------------------------//////////////////
const borrowBook = async (req, res)=>{
    try {
        const {id} = req.params
    const {borrowNote, returnDate} = req.body
    if (!id || id.length !== 24) {
        return res.status(400).json({ error: "Invalid book ID" });
      }

    if(!borrowNote || !returnDate){
        return res.status(400).json({error: "All fields required"})
    }  
      const book = await Book.findById(id)
      const borrowBook = await Borrow.findById(id)
      if(borrowBook) return res.status(400).json({error: "You have already borrowed this book"})
  
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }
    const borrowed = await Borrow.findOne({book})
    if(borrowed) return res.status(400).json({error: "you have already borrowed this book"})

    const newBorrow = new Borrow({
        book: id,
        borrowNote,
        returnDate
    })
    await newBorrow.save()

    const user = await User.findById(req.user._id)
    user.borrows.push(newBorrow._id)
    await user.save()

    return res.status(201).json({ message: "Book borrowed successfully", borrow: newBorrow });
    } catch (error) {
        console.error("🔥 Error saving book:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message }); 
    }
}

//////--------------------------------- Returnbook -------------------------------//////////////////

const returnBook = async (req, res)=>{
    const {borrowId} = req.params
    console.log(req.params);
    
    const borrow = await Borrow.findById(borrowId).populate('book')
    // console.log(borrow);
    
    if (!borrow) return res.status(404).json({ error: "Borrow record not found" });

    if (borrow.returned) {
      return res.status(400).json({ error: "Book already returned" });
    }

    const now = new Date();
    
    if(now > borrow.returnDate){
     const user = await User.findById(req.user._id)
      user.fine += borrow.book.fine
      await user.save()
    }
    borrow.returned = true
    await borrow.save()

}

//////--------------------------------- Review Book -------------------------------//////////////////

const reviewBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { comment, rating } = req.body;

    if (!comment || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (rating > 5 || rating < 1) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const book = await Book.findById(bookId)
   
    
      if (!book) {
          return res.status(403).json({ error: "Book not found" });
        }
       
        const hasReviewed = Review.findOne({book: bookId, reviewAuthor: req.user._id})
        
    if (hasReviewed){
      return res.status(400).json({error: "You have arleady review this book"})
    }

    const newReview = new Review({ comment, rating, reviewAuthor: req.user._id, book });
    await newReview.save();
    
    book.reviews.push(newReview._id);
    await book.save();

    return res.status(200).json({ message: "Review submitted successfully", newReview });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};



module.exports = {
  recordBook, allBook, singleBook, borrowBook, returnBook, reviewBook
};
