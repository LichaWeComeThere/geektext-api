const mongoose = require('mongoose');

// Feature 4: Book Details
// Fields match the project spec: first name, last name, biography, publisher.
const authorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    biography: { type: String, default: '' },
    publisher: { type: String, trim: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Author', authorSchema);
