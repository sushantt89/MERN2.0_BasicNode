const express = require("express");
const app = express();
const fs = require("fs");

const connectToDatabase = require("./database");
const Book = require("./model/bookModel");
const { upload } = require("./middleware/multerConfig");
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

connectToDatabase();

// Get all books
app.get("/book", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      message: "All Books Fetched Successfully",
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Get a single book
app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleBook = await Book.findById(id);
    res.status(200).json({
      message: "Single Book Fetched Successfully",
      data: singleBook,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Create/add a book
app.post("/book", upload.single("imagePath"), async (req, res) => {
  const { bookPrice, bookName, isbnNumber, authorName, publishedAt } = req.body;
  const imagePath = req.file ? req.file.path : "uploads/no-mage.png";

  try {
    const book = await Book.create({
      bookName,
      bookPrice,
      isbnNumber,
      authorName,
      publishedAt,
      imagePath,
    });

    res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Delete a book
app.delete("/book/:id", async (req, res) => {
  const { id } = req.params;
  const oldData = await Book.findById(id);
  const oldPath = oldData.imagePath;
  fs.unlink(`${oldPath}`, (err) => {
    if (err) {
      console.log(err);
    }
  });
  console.log({ oldPath });
  try {
    await Book.findByIdAndDelete(id);
    res.status(200).json({
      message: "Book Successfully deleted",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update a book
app.patch("/book/:id", upload.single("imagePath"), async (req, res) => {
  try {
    const { id } = req.params;
    const oldData = await Book.findById(id);
    if (req.file) {
      imagePath = req.file.path;
    }
    const oldDataPath = oldData.imagePath;
    console.log({ oldDataPath });
    fs.unlink(oldDataPath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${oldDataPath} deleted successfully`);
      }
    });
    const {
      bookName,
      bookPrice,
      authorName,
      publishedAt,
      publication,
      isbnNumber,
    } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        bookName,
        bookPrice,
        authorName,
        publishedAt,
        publication,
        isbnNumber,
        imagePath,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Book Updated Successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Add image
app.post("/book/image", upload.single("avatar"), function (req, res, next) {
  console.log({ file: req.file });
  try {
    res.status(200).json({
      message: "Image Added Successfully",
      data: req.file.path,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use(express.static("./uploads/")); //by default node wont give access to view images eg localhost:4000/a.jpg hit garey didaina so yo dina lai yo line haley dinxa

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
