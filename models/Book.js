const mongoose = require('mongoose');

// Feature 4: Book Details
// Fields match the project spec: ISBN, name, description, price, author,
// genre, publisher, year published, copies sold.
const bookSchema = new mongoose.Schema(
  {
    isbn: { type: String, required: true, unique: true, trim: true }, // 13 digits, no dashes
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true }, // the Author's _id
    genre: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    yearPublished: { type: Number },
    copiesSold: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model('Book', bookSchema);
