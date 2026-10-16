const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const Author = require('../models/Author'); // also registers the Author model so populate('author') works

const router = express.Router();

// Text fields a new book must include (price and authorId are checked too).
// Any extra fields in the request body are ignored.
const REQUIRED_TEXT_FIELDS = ['isbn', 'name', 'genre', 'publisher'];

// POST /api/books   (server.js mounts this router at /api/books)
// Sprint 3: an administrator creates a new book.
// Body example:
// {
//   "isbn": "978-1-7365-1404-7",
//   "name": "Testing APIs With Postman",
//   "description": "A hands-on guide to checking every status code.",
//   "price": 29.99,
//   "authorId": "<an Author _id>",
//   "genre": "Web Development",
//   "publisher": "Null Pointer Publishing",
//   "yearPublished": 2026,
//   "copiesSold": 0
// }
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};

    // 1. Required fields must be present
    const missing = [...REQUIRED_TEXT_FIELDS, 'price', 'authorId'].filter(
      (field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === ''
    );
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
    }

    // 2. ISBN must be 13 digits (dashes are allowed and removed, like the GET route)
    const isbn = String(body.isbn).replace(/-/g, '').trim();
    if (!/^\d{13}$/.test(isbn)) {
      return res.status(400).json({ message: 'ISBN must be 13 digits' });
    }

    // 3. Price must be a number that is 0 or more
    const price = Number(body.price);
    if (typeof body.price === 'boolean' || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: 'Price must be a number that is 0 or more' });
    }

    // 4. Optional numbers: year published and copies sold must be whole numbers if given
    let yearPublished;
    if (body.yearPublished !== undefined) {
      yearPublished = Number(body.yearPublished);
      if (!Number.isInteger(yearPublished) || yearPublished < 0) {
        return res.status(400).json({ message: 'yearPublished must be a whole number' });
      }
    }

    let copiesSold = 0;
    if (body.copiesSold !== undefined) {
      copiesSold = Number(body.copiesSold);
      if (!Number.isInteger(copiesSold) || copiesSold < 0) {
        return res.status(400).json({ message: 'copiesSold must be a whole number that is 0 or more' });
      }
    }

    // 5. The author must be a real Author in the database
    if (!mongoose.isValidObjectId(body.authorId)) {
      return res.status(400).json({ message: 'authorId is not a valid ID' });
    }
    const author = await Author.findById(body.authorId);
    if (!author) {
      return res.status(404).json({ message: `No author found with ID ${body.authorId}` });
    }

    // 6. The ISBN can't already be used by another book
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(409).json({ message: `A book with ISBN ${isbn} already exists` });
    }

    // 7. Save the book, then send it back with the author's name filled in
    const book = await Book.create({
      isbn,
      name: String(body.name).trim(),
      description: body.description ? String(body.description) : '',
      price,
      author: author._id,
      genre: String(body.genre).trim(),
      publisher: String(body.publisher).trim(),
      yearPublished,
      copiesSold,
    });

    await book.populate('author', 'firstName lastName');
    res.status(201).json(book);
  } catch (err) {
    // Two requests with the same ISBN at the same moment: the unique index catches it
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A book with that ISBN already exists' });
    }
    res.status(500).json({ message: 'Could not create book', error: err.message });
  }
});

// GET /api/books/author/:authorId
// Sprint 3: returns every book written by one author, sorted by name.
// Example: GET /api/books/author/6ac45fc85372421198df5509
router.get('/author/:authorId', async (req, res) => {
  try {
    const { authorId } = req.params;

    if (!mongoose.isValidObjectId(authorId)) {
      return res.status(400).json({ message: 'authorId is not a valid ID' });
    }

    const author = await Author.findById(authorId).select('firstName lastName');
    if (!author) {
      return res.status(404).json({ message: `No author found with ID ${authorId}` });
    }

    const books = await Book.find({ author: authorId })
      .populate('author', 'firstName lastName')
      .sort({ name: 1 });

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Could not get books by author', error: err.message });
  }
});

// GET /api/books/isbn/:isbn
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
