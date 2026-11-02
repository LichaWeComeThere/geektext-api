// Fake ratings and comments for the books and users already in the database.
// Run after the book and user seeds: npm run seed:ratings
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');

// Fixed patterns so every run gives the same averages. Each user rates a book at most
// once (unique bookId + userId), so a pattern must not be longer than the user count.
const ratingPatterns = [
  [5, 5, 4],
  [4, 3, 4],
  [2, 3, 1],
  [5, 4],
  [3, 4, 2],
  [1, 2],
];

const commentTexts = [
  'Could not put it down. Finished it in two days.',
  'Great reference, I keep coming back to it.',
  'Slow start, but the second half is worth it.',
  'Not what I expected from the description.',
  'Clear explanations and good examples.',
  'Would recommend to anyone new to the topic.',
  'Too long for what it covers.',
  'My favorite book this year.',
];

async function seed() {
  await connectDB();
  const db = mongoose.connection.db;

  const books = await db.collection('books').find({}, { projection: { _id: 1 } }).limit(6).toArray();
  const users = await db.collection('users').find({}, { projection: { _id: 1 } }).toArray();
  if (books.length === 0 || users.length === 0) {
    throw new Error(`Need books and users first (found ${books.length} books, ${users.length} users).`);
  }

  await Rating.deleteMany({});
  await Comment.deleteMany({});
  // Build the one-rating-per-user-per-book index now that old duplicates are gone.
  await Rating.syncIndexes();

  const ratings = [];
  const comments = [];
  books.forEach((book, b) => {
    ratingPatterns[b % ratingPatterns.length].slice(0, users.length).forEach((rating, i) => {
      ratings.push({ bookId: book._id, userId: users[i % users.length]._id, rating });
    });
    for (let i = 0; i < 2; i++) {
      comments.push({
        bookId: book._id,
        userId: users[(b + i) % users.length]._id,
        text: commentTexts[(b * 2 + i) % commentTexts.length],
      });
    }
  });

  await Rating.insertMany(ratings);
  await Comment.insertMany(comments);
  console.log(`Seeded ${ratings.length} ratings and ${comments.length} comments for ${books.length} books.`);
}

seed()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
