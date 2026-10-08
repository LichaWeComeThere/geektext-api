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

 // POST /api/wishlists
 // Creates a new wishlist for an existing user.
 router.post('/', async (req, res) => {
   try {
     const { username, name } = req.body || {};

     if (
       typeof username !== 'string' ||
       !username.trim() ||
       typeof name !== 'string' ||
       !name.trim()
     ) {
       return res.status(400).json({
         message: 'Username and wishlist name are required'
       });
     }

     const normalizedUsername = username.trim().toLowerCase();
     const wishlistName = name.trim();

     const user = await User.findOne({
       username: normalizedUsername
     });

     if (!user) {
       return res.status(404).json({
         message: 'User not found'
       });
     }

     const existingWishlist = await Wishlist.findOne({
       user: user._id,
       name: wishlistName
     });

     if (existingWishlist) {
       return res.status(409).json({
         message: 'A wishlist with this name already exists'
       });
     }

     const wishlistCount = await Wishlist.countDocuments({
       user: user._id
     });

     if (wishlistCount >= 3) {
       return res.status(400).json({
         message: 'A user can have at most 3 wishlists'
       });
     }

     const wishlist = await Wishlist.create({
       user: user._id,
       name: wishlistName,
       books: []
     });

     return res.status(201).json({
       message: 'Wishlist created successfully',
       username: user.username,
       name: wishlist.name,
       books: wishlist.books
     });
   } catch (error) {
     if (error.code === 11000) {
       return res.status(409).json({
         message: 'A wishlist with this name already exists'
       });
     }

     if (error.message === 'A user can have at most 3 wish lists') {
       return res.status(400).json({
         message: error.message
       });
     }

     console.error('Could not create wishlist:', error.message);

     return res.status(500).json({
       message: 'Could not create wishlist'
     });
   }
 });

module.exports = router;
