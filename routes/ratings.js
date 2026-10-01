const express = require('express');
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

const router = express.Router();

function checkBookId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.bookId)) {
    return res.status(400).json({ error: 'Invalid bookId' });
  }
  next();
}

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
