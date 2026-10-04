const express = require('express');
const Book = require('../models/Book');
require('../models/Author'); // registers the Author model so populate('author') works

const router = express.Router();

// GET /api/books/isbn/:isbn   (server.js mounts this router at /api/books)
// Returns one book's details, with the author's name filled in.
// Example: GET /api/books/isbn/9781736504048
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn.replace(/-/g, ''); // accepts 978-1-... or 9781...

    const book = await Book.findOne({ isbn }).populate('author', 'firstName lastName');

    if (!book) {
      return res.status(404).json({ message: `No book found with ISBN ${isbn}` });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Could not get book details', error: err.message });
  }
});

module.exports = router;
