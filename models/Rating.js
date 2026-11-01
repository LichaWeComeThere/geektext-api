const mongoose = require('mongoose');

// A user's 1–5 star rating of a book. Each user has at most one rating per book;
// rating the same book again replaces the old rating (see POST /books/:bookId/rating).
const ratingSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: { validator: Number.isInteger, message: 'rating must be a whole number' },
    },
  },
  // createdAt = first rated, updatedAt = datestamp of the current rating value.
  { timestamps: true }
);

ratingSchema.index({ bookId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
