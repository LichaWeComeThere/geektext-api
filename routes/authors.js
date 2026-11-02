const express = require('express');
const Author = require('../models/Author');

const router = express.Router();

// Turns user text into a safe exact-match pattern (so "O.Brien" doesn't act like a wildcard)
function exactNameMatch(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped}$`, 'i'); // 'i' = ignore upper/lower case
}

// POST /api/authors   (server.js mounts this router at /api/authors)
// Sprint 4: an administrator creates a new author.
// Body example:
// {
//   "firstName": "Grace",
//   "lastName": "Holloway",
//   "biography": "Cloud engineer who writes practical guides to deploying web apps.",
//   "publisher": "Lambda House"
// }
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};

    // 1. First and last name are required
    const missing = ['firstName', 'lastName'].filter(
      (field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === ''
    );
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required field(s): ${missing.join(', ')}` });
    }

    // 2. Every field must be text (biography and publisher are optional)
    for (const field of ['firstName', 'lastName', 'biography', 'publisher']) {
      if (body[field] !== undefined && typeof body[field] !== 'string') {
        return res.status(400).json({ message: `${field} must be text` });
      }
    }

    const firstName = body.firstName.trim();
    const lastName = body.lastName.trim();

    // 3. Don't allow the same author twice (same first and last name, any capitalization)
    const existing = await Author.findOne({
      firstName: exactNameMatch(firstName),
      lastName: exactNameMatch(lastName),
    });
    if (existing) {
      return res.status(409).json({
        message: `Author ${existing.firstName} ${existing.lastName} already exists`,
        authorId: existing._id,
      });
    }

    // 4. Save the author and send it back, including its new _id
    const author = await Author.create({
      firstName,
      lastName,
      biography: body.biography ? body.biography.trim() : '',
      publisher: body.publisher ? body.publisher.trim() : undefined,
    });

    res.status(201).json(author);
  } catch (err) {
    res.status(500).json({ message: 'Could not create author', error: err.message });
  }
});

module.exports = router;
