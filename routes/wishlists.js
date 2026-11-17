const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');

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

 // POST /api/wishlists/:username/:name/books
 // Add an existing book to a user's wishlist.
 router.post('/:username/:name/books', async (req, res) => {
   try {
     const username = req.params.username.trim().toLowerCase();
     const wishlistName = req.params.name.trim();
     const { isbn } = req.body || {};

     if (typeof isbn !== 'string' || !isbn.trim()) {
       return res.status(400).json({
         message: 'Book ISBN is required'
       });
     }

     const user = await User.findOne({ username });

     if (!user) {
       return res.status(404).json({
         message: 'User not found'
       });
     }

     const wishlist = await Wishlist.findOne({
       user: user._id,
       name: wishlistName
     });

     if (!wishlist) {
       return res.status(404).json({
         message: 'Wishlist not found'
       });
     }

     const book = await Book.findOne({
       isbn: isbn.trim()
     });

     if (!book) {
       return res.status(404).json({
         message: 'Book not found'
       });
     }

     const alreadyAdded = wishlist.books.some(
       (bookId) => bookId.toString() === book._id.toString()
     );

     if (alreadyAdded) {
       return res.status(409).json({
         message: 'Book is already in this wishlist'
       });
     }

     wishlist.books.push(book._id);
     await wishlist.save();

     await wishlist.populate('books', 'isbn name price genre');

     return res.status(200).json({
       message: 'Book added to wishlist successfully',
       username: user.username,
       name: wishlist.name,
       books: wishlist.books
     });
   } catch (error) {
     console.error('Could not add book:', error.message);

     return res.status(500).json({
       message: 'Could not add book to wishlist'
     });
   }
 });

 // DELETE /api/wishlists/:username/:name/books/:isbn
 // Remove an existing book from a user's wishlist.
 router.delete('/:username/:name/books/:isbn', async (req, res) => {
   try {
     const username = req.params.username.trim().toLowerCase();
     const wishlistName = req.params.name.trim();
     const isbn = req.params.isbn.trim();

     const user = await User.findOne({ username });

     if (!user) {
       return res.status(404).json({
         message: 'User not found'
       });
     }

     const wishlist = await Wishlist.findOne({
       user: user._id,
       name: wishlistName
     });

     if (!wishlist) {
       return res.status(404).json({
         message: 'Wishlist not found'
       });
     }

     const book = await Book.findOne({ isbn });

     if (!book) {
       return res.status(404).json({
         message: 'Book not found'
       });
     }

     const bookExists = wishlist.books.some(
       (bookId) => bookId.toString() === book._id.toString()
     );

     if (!bookExists) {
       return res.status(404).json({
         message: 'Book is not in this wishlist'
       });
     }

     wishlist.books = wishlist.books.filter(
       (bookId) => bookId.toString() !== book._id.toString()
     );

     await wishlist.save();
     await wishlist.populate('books', 'isbn name price genre');

     return res.status(200).json({
       message: 'Book removed from wishlist successfully',
       username: user.username,
       name: wishlist.name,
       books: wishlist.books
     });

   } catch (error) {
     console.error('Could not remove book:', error.message);

     return res.status(500).json({
       message: 'Could not remove book from wishlist'
     });
   }
 });

 // Sprint 5 - Move a book from a wishlist to the shopping cart
 // DELETE /api/wishlists/:username/:name/books/:isbn/move-to-cart

router.delete('/:username/:name/books/:isbn/move-to-cart', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const wishlistName = req.params.name.trim();
    const isbn = req.params.isbn.trim();

    // Find the user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Find the wishlist
    const wishlist = await Wishlist.findOne({
      user: user._id,
      name: wishlistName
    });

    if (!wishlist) {
      return res.status(404).json({
        message: 'Wishlist not found'
      });
    }

    // Find the book
    const book = await Book.findOne({ isbn });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    // Check if the book is in the wishlist
    const bookExists = wishlist.books.some(
      bookId => bookId.toString() === book._id.toString()
    );

    if (!bookExists) {
      return res.status(404).json({
        message: 'Book is not in this wishlist'
      });
    }

    // Find or create the user's shopping cart
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = new Cart({
        userId: user._id,
        items: []
      });
    }

    // Add the book or increase its quantity
    const existingItem = cart.items.find(
      item => item.bookId.toString() === book._id.toString()
    );

    const previousQuantity = existingItem
      ? existingItem.quantity
      : 0;

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        bookId: book._id,
        quantity: 1
      });
    }

    // Save the cart first
    await cart.save();

    // Remove the book from the wishlist
    wishlist.books = wishlist.books.filter(
      bookId => bookId.toString() !== book._id.toString()
    );

    try {
      await wishlist.save();
    } catch (saveError) {
      // Undo the cart change if saving the wishlist fails
      if (existingItem) {
        existingItem.quantity = previousQuantity;
      } else {
        cart.items = cart.items.filter(
          item => item.bookId.toString() !== book._id.toString()
        );
      }

      try {
        await cart.save();
      } catch (rollbackError) {
        console.error('Could not undo cart update:', rollbackError);
      }

      throw saveError;
    }

    return res.status(200).json({
      message: 'Book moved from wishlist to cart successfully',
      username: user.username,
      wishlist: wishlist.name,
      isbn: book.isbn,
      cartItems: cart.items
    });

  } catch (error) {
    console.error('Could not move book to cart:', error);

    return res.status(500).json({
      message: 'Could not move book from wishlist to cart'
    });
  }
});


module.exports = router;
