const express = require('express');
const User = require('../models/User');

const router = express.Router();

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

module.exports = router;