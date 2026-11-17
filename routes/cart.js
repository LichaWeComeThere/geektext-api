const express = require('express');
const User = require('../models/User');
const Book = require('../models/Book'); // Register the existing model before populating books.
const Cart = require('../models/Cart');

const router = express.Router();

// GET /api/cart/:username
// Sprint 2 demo: GET /api/cart/alice.reader
router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const user = await User.findOne({ username }).select('_id username').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cart = await Cart.findOne({ userId: user._id })
      .populate('items.bookId', 'isbn name price')
      .lean();

    // A deleted book cannot be priced. Report it instead of showing a false subtotal.
    if (cart && cart.items.some((item) => !item.bookId)) {
      return res.status(409).json({ message: 'A book in this cart no longer exists' });
    }

    let subtotalCents = 0;
    let totalQuantity = 0;
    const items = (cart ? cart.items : []).map((item) => {
      const book = item.bookId;
      // Calculate with cents to avoid results such as 69.97999999999999.
      const lineTotalCents = Math.round(book.price * 100) * item.quantity;
      subtotalCents += lineTotalCents;
      totalQuantity += item.quantity;

      return {
        bookId: book._id,
        isbn: book.isbn,
        name: book.name,
        price: book.price,
        quantity: item.quantity,
        lineTotal: lineTotalCents / 100
      };
    });

    res.json({
      userId: user._id,
      username: user.username,
      items,
      totalQuantity,
      subtotal: subtotalCents / 100
    });
  } catch (error) {
    console.error('Could not get shopping cart:', error.message);
    res.status(500).json({ message: 'Could not get shopping cart' });
  }
});

 // POST /api/cart/:username/items
 // Add a book to a user's shopping cart
router.post('/:username/items', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const { isbn, quantity = 1 } = req.body || {};

    if (!isbn || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: 'Valid ISBN and positive whole-number quantity are required'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const book = await Book.findOne({ isbn: String(isbn) });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.bookId.toString() === book._id.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        bookId: book._id,
        quantity
      });
    }

    await cart.save();

    return res.status(existingItem ? 200 : 201).json({
      message: existingItem ? 'Cart quantity updated' : 'Book added to cart',
      items: cart.items
    });

  } catch (error) {
    console.error('Could not add book to cart:', error);
    return res.status(500).json({
      message: 'Could not add book to cart'
    });
  }
});

 // DELETE /api/cart/:username/items/:isbn
// Remove a book from a user's shopping cart
router.delete('/:username/items/:isbn', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();
    const isbn = req.params.isbn;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const book = await Book.findOne({ isbn });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    const cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      return res.status(404).json({
        message: 'Shopping cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.bookId.toString() === book._id.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'Book is not in the cart'
      });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return res.status(200).json({
      message: 'Book removed from cart',
      items: cart.items
    });

  } catch (error) {
    console.error('Could not remove book from cart:', error);
    return res.status(500).json({
      message: 'Could not remove book from cart'
    });
  }
});
// PATCH /api/cart/:username/items/:isbn
// Set the quantity of a book already in the cart.
router.patch('/:username/items/:isbn', async (req, res) => {
  try {
    const { quantity } = req.body || {};
    const username = req.params.username.trim().toLowerCase();
    const isbn = req.params.isbn.trim();

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be a positive whole number'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const book = await Book.findOne({ isbn });

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        userId: user._id,
        'items.bookId': book._id
      },
      {
        $set: { 'items.$.quantity': quantity }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!cart) {
      return res.status(404).json({
        message: 'Book is not in the cart'
      });
    }

    return res.status(200).json({
      message: 'Cart quantity updated',
      items: cart.items
    });
  } catch (error) {
    console.error('Could not update cart quantity:', error.message);

    return res.status(500).json({
      message: 'Could not update cart quantity'
    });
  }
});
// DELETE /api/cart/:username/items
// Clear all books from this user's shopping cart.
router.delete('/:username/items', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    const user = await User.findOne({ username })
      .select('_id username')
      .lean();

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    await Cart.updateOne(
      { userId: user._id },
      { $set: { items: [] } },
      { runValidators: true }
    );

    return res.status(200).json({
      message: 'Shopping cart cleared',
      userId: user._id,
      username: user.username,
      items: [],
      totalQuantity: 0,
      subtotal: 0
    });
  } catch (error) {
    console.error('Could not clear shopping cart:', error.message);

    return res.status(500).json({
      message: 'Could not clear shopping cart'
    });
  }
});

module.exports = router;

