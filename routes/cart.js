const express = require('express');
const User = require('../models/User');
require('../models/Book'); // Register the existing model before populating books.
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

module.exports = router;
