const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    unique: true,
  },
  bookPrice: {
    type: Number,
  },
  isbnNumber: {
    type: Number,
  },
  authorName: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  imagePath: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
