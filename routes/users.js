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