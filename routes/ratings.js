const express = require('express');
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');
const Book = require('../models/Book');
const User = require('../models/User');

const router = express.Router();

function checkBookId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.bookId)) {
    return res.status(400).json({ error: 'Invalid bookId' });
  }
  next();
}

// Confirms the userId in the body and the book in the URL both exist.
// Sends the error response and returns false if either check fails.
async function checkUserAndBook(req, res) {
  const { userId } = req.body || {};
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).json({ error: 'Valid userId is required' });
    return false;
  }
  const [user, book] = await Promise.all([
    User.exists({ _id: userId }),
    Book.exists({ _id: req.params.bookId }),
  ]);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return false;
  }
  if (!book) {
    res.status(404).json({ error: 'Book not found' });
    return false;
  }
  return true;
}

// POST /books/:bookId/rating — a user rates a book 1–5 stars.
router.post('/:bookId/rating', checkBookId, async (req, res) => {
  const { userId, rating } = req.body || {};
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be a whole number from 1 to 5' });
  }
  if (!(await checkUserAndBook(req, res))) return;

  const created = await Rating.create({ bookId: req.params.bookId, userId, rating });
  res.status(201).json(created);
});

// POST /books/:bookId/comments — a user comments on a book.
router.post('/:bookId/comments', checkBookId, async (req, res) => {
  const { userId } = req.body || {};
  const text = typeof req.body?.comment === 'string' ? req.body.comment.trim() : '';
  if (!text || text.length > 1000) {
    return res.status(400).json({ error: 'comment must be 1–1000 characters' });
  }
  if (!(await checkUserAndBook(req, res))) return;

  const created = await Comment.create({ bookId: req.params.bookId, userId, text });
  res.status(201).json(created);
});

// GET /books/:bookId/comments — all comments for a book, newest first.
router.get('/:bookId/comments', checkBookId, async (req, res) => {
  const comments = await Comment.find({ bookId: req.params.bookId })
    .sort({ createdAt: -1 })
    .select('userId text createdAt');
  res.json(comments);
});

// GET /books/:bookId/rating — average rating for a book.
router.get('/:bookId/rating', checkBookId, async (req, res) => {
  const [result] = await Rating.aggregate([
    { $match: { bookId: new mongoose.Types.ObjectId(req.params.bookId) } },
    { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  res.json({
    bookId: req.params.bookId,
    averageRating: result ? Math.round(result.average * 100) / 100 : null,
    ratingCount: result ? result.count : 0,
  });
});

module.exports = router;
