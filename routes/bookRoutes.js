const express = require('express')
const { recordBook, allBook, singleBook, borrowBook, returnBook, reviewBook, likeBook } = require('../controller/bookController')
const { authMiddleware, adminAuth, staffAuth } = require('../middleware/authentication')
const upload = require('../middleware/multer')

const router = express.Router()

router.post('/record', authMiddleware, adminAuth, upload.single('bookCover'), recordBook)
router.get('/all-book', allBook)
router.get('/single-book/:id', singleBook)
router.post('/borrow-book/:id', authMiddleware, borrowBook)
router.post('/return-book/:borrowId', authMiddleware, returnBook)
router.post('/review/:bookId', authMiddleware, reviewBook)
router.post('/like/:id', authMiddleware, likeBook)


module.exports = router