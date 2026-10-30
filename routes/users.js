const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      homeAddress
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({
      username: normalizedUsername
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Username already exists'
      });
    }

    await User.create({
      username: normalizedUsername,
      password,
      firstName,
      lastName,
      email,
      homeAddress
    });

    return res.status(201).send();
  } catch (error) {
    console.error('Failed to create user:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

router.post('/:username/credit-cards', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    const {
      cardholderName,
      cardNumber,
      expirationMonth,
      expirationYear,
      billingAddress
    } = req.body;

    if (
      !cardholderName ||
      !cardNumber ||
      expirationMonth === undefined ||
      expirationYear === undefined
    ) {
      return res.status(400).json({
        message:
          'Cardholder name, card number, expiration month, and expiration year are required'
      });
    }

    if (!/^\d{13,19}$/.test(String(cardNumber))) {
      return res.status(400).json({
        message: 'Card number must contain 13 to 19 digits'
      });
    }

    const month = Number(expirationMonth);
    const year = Number(expirationYear);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({
        message: 'Expiration month must be between 1 and 12'
      });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (
      !Number.isInteger(year) ||
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      return res.status(400).json({
        message: 'Credit card is expired'
      });
    }

    const user = await User.findOne({ username }).select('+creditCards');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    user.creditCards.push({
      cardholderName,
      cardNumber: String(cardNumber),
      expirationMonth: month,
      expirationYear: year,
      billingAddress
    });

    await user.save();

    return res.status(201).send();
  } catch (error) {
    console.error('Failed to create credit card:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Failed to retrieve user:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

router.patch('/:username', async (req, res) => {
  try {
    const username = req.params.username.trim().toLowerCase();

    if (
      Object.prototype.hasOwnProperty.call(req.body, 'email') ||
      Object.prototype.hasOwnProperty.call(req.body, 'username')
    ) {
      return res.status(400).json({
        message: 'Username and email cannot be updated'
      });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const allowedFields = [
      'password',
      'firstName',
      'lastName',
      'homeAddress'
    ];

    let updated = false;

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        user[field] = req.body[field];
        updated = true;
      }
    }

    if (!updated) {
      return res.status(400).json({
        message: 'No valid fields provided for update'
      });
    }

    await user.save();

    return res.status(200).send();
  } catch (error) {
    console.error('Failed to update user:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;