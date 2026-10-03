const express = require('express');
const Book = require('../models/Book');
require('../models/Author'); // registers Author so populate('author') works

const router = express.Router();

// Feature 1: Book Browsing and Sorting
// GET /api/books/genre/:genre — every book in a genre, sorted by name.
// Example: GET /api/books/genre/Programming (case doesn't matter: "programming" works too).
// A genre with no books returns an empty list.
router.get('/genre/:genre', async (req, res) => {
  const books = await Book.find({ genre: req.params.genre.trim() })
    .collation({ locale: 'en', strength: 2 }) // strength 2 = ignore upper/lower case
    .populate('author', 'firstName lastName')
    .sort({ name: 1 });
  res.json(books);
});

module.exports = router;
