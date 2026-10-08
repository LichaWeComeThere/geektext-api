const express = require('express');
const Book = require('../models/Book');
const Rating = require('../models/Rating');
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

// GET /api/books/top-sellers — the 10 books with the most copies sold, best seller first.
// Books with the same copiesSold are sorted by name, so ties always come out in the same order.
router.get('/top-sellers', async (req, res) => {
  const books = await Book.find()
    .populate('author', 'firstName lastName')
    .sort({ copiesSold: -1, name: 1 }) // -1 = highest first; name breaks ties A to Z
    .limit(10);
  res.json(books);
});

// GET /api/books/rating/:rating — books whose average rating is :rating or higher, best rated first.
// The average comes from the Rating collection and is rounded like GET /api/books/:bookId/rating.
// Example: GET /api/books/rating/4. Books with no ratings are left out; a rating outside 1–5 gives 400.
router.get('/rating/:rating', async (req, res) => {
  const minRating = Number(req.params.rating);
  if (!Number.isFinite(minRating) || minRating < 1 || minRating > 5) {
    return res.status(400).json({ message: 'Rating must be a number from 1 to 5' });
  }

  // One result per rated book: its average rating and how many ratings it has.
  const stats = await Rating.aggregate([
    { $group: { _id: '$bookId', average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  // Keep only the books whose rounded average is high enough, looked up by book _id.
  const statsByBook = new Map();
  for (const s of stats) {
    const averageRating = Math.round(s.average * 100) / 100;
    if (averageRating >= minRating) {
      statsByBook.set(s._id.toString(), { averageRating, ratingCount: s.count });
    }
  }

  const books = await Book.find({ _id: { $in: [...statsByBook.keys()] } })
    .populate('author', 'firstName lastName')
    .lean(); // plain objects, so we can add averageRating and ratingCount

  const result = books.map((book) => ({ ...book, ...statsByBook.get(book._id.toString()) }));
  result.sort((a, b) => b.averageRating - a.averageRating || a.name.localeCompare(b.name));
  res.json(result);
});

module.exports = router;
