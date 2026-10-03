// Loads the fake authors and books for Feature 4 (Book Details).
//
// Run it from the project folder:   node seed/seedBooks.js
//
// Safe to run more than once. It updates books by ISBN instead of deleting
// and re-inserting them, so each book keeps the same _id and teammates'
// ratings, carts, and wishlists that point to those _ids keep working.
require('dotenv').config();
const mongoose = require('mongoose');
const Author = require('../models/Author');
const Book = require('../models/Book');
const { authors, books } = require('./bookData');

async function seedBooks() {
  // 1. Authors: add each one, or update it if it's already there (matched by name)
  for (const author of authors) {
    await Author.updateOne(
      { firstName: author.firstName, lastName: author.lastName },
      { $set: author },
      { upsert: true }
    );
  }

  // 2. Get every author's _id so each book can point to its author
  const savedAuthors = await Author.find();
  const authorIdByName = {};
  for (const a of savedAuthors) {
    authorIdByName[`${a.firstName} ${a.lastName}`] = a._id;
  }

  // 3. Books: add each one, or update it if it's already there (matched by ISBN)
  for (const { authorName, ...book } of books) {
    const authorId = authorIdByName[authorName];
    if (!authorId) {
      throw new Error(`Book ${book.isbn} lists author "${authorName}", who isn't in bookData.js`);
    }

    await Book.updateOne(
      { isbn: book.isbn },
      { $set: { ...book, author: authorId } },
      { upsert: true, runValidators: true }
    );
  }

  console.log(`Seeded ${authors.length} authors and ${books.length} books.`);
}

// Only connect and disconnect when this file is run directly,
// so another script (like a team-wide seed script) can call seedBooks() too.
if (require.main === module) {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error('No database connection string. Add MONGO_URI to your .env (the same one server.js uses).');
    process.exit(1);
  }

  mongoose
    .connect(uri)
    .then(seedBooks)
    .catch((err) => {
      console.error('Seeding failed:', err.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = seedBooks;
