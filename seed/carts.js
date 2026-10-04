// Development sample carts. Run after the team's user and book seeds.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');
const Cart = require('../models/Cart');
const { books } = require('./bookData');

const samples = [
  {
    _id: 'c40100000000000000000001',
    username: 'alice.reader',
    items: [{ isbn: books[0].isbn, quantity: 2 }, { isbn: books[1].isbn, quantity: 1 }]
  },
  {
    _id: 'c40100000000000000000002',
    username: 'bob.books',
    items: [{ isbn: books[2].isbn, quantity: 1 }]
  },
  { _id: 'c40100000000000000000003', username: 'charlie.tech', items: [] }
];

async function seedCarts() {
  // Resolve everything before writing so a missing dependency fails clearly.
  const carts = [];
  for (const sample of samples) {
    const user = await User.findOne({ username: sample.username });
    if (!user) {
      throw new Error(`Missing user ${sample.username}. Run npm run seed first.`);
    }

    const items = [];
    for (const item of sample.items) {
      const book = await Book.findOne({ isbn: item.isbn });
      if (!book) {
        throw new Error(`Missing book ${item.isbn}. Run node seed/seedBooks.js first.`);
      }
      items.push({ bookId: book._id, quantity: item.quantity });
    }
    carts.push({ _id: sample._id, userId: user._id, items });
  }

  for (const { _id, ...cart } of carts) {
    // Fixed demo cart IDs also let a rerun repair references after users are re-seeded.
    await Cart.updateOne({ _id }, { $set: cart }, { upsert: true, runValidators: true });
  }
  console.log('Seeded 3 sample carts: alice.reader, bob.books, charlie.tech (empty).');
}

if (require.main === module) {
  connectDB()
    .then(seedCarts)
    .catch((error) => {
      console.error('Cart seed failed:', error.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = seedCarts;
