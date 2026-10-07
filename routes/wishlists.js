const express = require('express');
const User = require('../models/User');
require('../models/Book');
const Wishlist = require('../models/Wishlist');

const router = express.Router();

// GET /api/wishlists/:username/:name
// Sprint 2 demo: GET /api/wishlists/alice.reader/Favorites
router.get('/:username/:name', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const wishlistName = req.params.name.trim();

    const user = await User.findOne({ username })
      .select('_id username')
      .lean();

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const wishlist = await Wishlist.findOne({
      user: user._id,
      name: wishlistName
    })
      .populate('books', 'isbn name price genre')
      .lean();

    if (!wishlist) {
      return res.status(404).json({
        message: 'Wishlist not found'
      });
    }

    return res.status(200).json({
      userId: user._id,
      username: user.username,
      name: wishlist.name,
      books: wishlist.books
    });
  } catch (error) {
    console.error('Could not get wishlist:', error.message);

    return res.status(500).json({
      message: 'Could not get wishlist'
    });
  }
});

module.exports = router;
