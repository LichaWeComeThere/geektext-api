const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ]
  },
  {
    timestamps: true
  }
);

// A user cannot have two wish lists with the same name.
// Different users can still both have a list called "Favorites".
wishlistSchema.index({ user: 1, name: 1 }, { unique: true });

// Each user can have at most 3 wish lists.
wishlistSchema.pre('save', async function () {
  if (!this.isNew) {
    return;
  }

  const existingLists = await this.constructor.countDocuments({
    user: this.user
  });

  if (existingLists >= 3) {
    throw new Error('A user can have at most 3 wish lists');
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
