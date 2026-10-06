// Development sample wish lists.
// Run after the team's user and book seeds.

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');
const Wishlist = require('../models/Wishlist');

const samples = [
  {
    username: 'alice.reader',
    name: 'Favorites',
    isbns: [
      '9781736501016',
      '9781736504048'
    ]
  },
  {
    username: 'alice.reader',
    name: 'Want to Read',
    isbns: [
      '9781736508084',
      '9781736510001'
    ]
  },
  {
    username: 'bob.books',
    name: 'Favorites',
    isbns: [
      '9781736513033'
    ]
  }
];

async function seedWishlists() {
  const wishlists = [];

  for (const sample of samples) {
    const user = await User.findOne({
      username: sample.username
    });

    if (!user) {
      throw new Error(
        `Missing user ${sample.username}. Run npm run seed first.`
      );
    }

    const books = [];

    for (const isbn of sample.isbns) {
      const book = await Book.findOne({ isbn });

      if (!book) {
        throw new Error(
          `Missing book ${isbn}. Run node seed/seedBooks.js first.`
        );
      }

      books.push(book._id);
    }

    wishlists.push({
      user: user._id,
      name: sample.name,
      books
    });
  }

  // Make the development seed safe to run more than once.
  const userIds = [...new Set(
    wishlists.map((wishlist) => wishlist.user.toString())
  )];

  await Wishlist.deleteMany({
    user: { $in: userIds }
  });

  // Make sure the unique user + name index exists.
  await Wishlist.init();

  for (const wishlist of wishlists) {
    await Wishlist.create(wishlist);
  }

  console.log(
    'Seeded 3 sample wish lists: 2 for alice.reader and 1 for bob.books.'
  );
}

if (require.main === module) {
  connectDB()
    .then(seedWishlists)
    .catch((error) => {
      console.error('Wishlist seed failed:', error.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = seedWishlists;
