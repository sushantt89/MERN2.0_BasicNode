const express = require("express");
const app = express();

const connectToDatabase = require("./database");
const Book = require("./model/bookModel");
const port = 4000;

app.use(express.json()); //express le chai by default json bujdaina -> req.body ma jun json auxa tyo express le bujdaina so tyo bujne power deko ho express lai you pc of code le

connectToDatabase();

//get all books
app.get("/book", async (req, res) => {
  try {
    const books = await Book.find(); //returns array
    res.status(200).json({
      message: "All Books Fetched Successfully",
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log({ error: error.message });
  }
});

//get a single book
app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleBook = await Book.findById(id); //returns object
    res.status(200).json({
      message: "Single Book Fetchec Successfully",
      data: singleBook,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//create/add a book
app.post("/book", async (req, res) => {
  console.log(req.body);
  const { bookPrice, bookName, isbnNumber, authorName, publishedAt } = req.body;
  try {
    const book = await Book.create({
      // mapping gareko left side ma field and right side ma respective value
      // bookName:bookName,
      // bookPrice:bookPrice,
      // mathi mapping gareko ho, ya req.body ma jun field/key name haru airaxa that name chai hamro schema ko field name sanga match hunai parxa vanne xaina it can be anything but hamle ya same name haleko xam bcz js has this feature ki when schema ko field name ra req.body ma aune key name same xa vaye you can simply do the following:
      bookName,
      bookPrice,
      isbnNumber,
      authorName,
      publishedAt,
    });
    res.status(201).json({
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    console.log({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});

//api to delete a book
app.delete("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id); //returns null as del vaisakyo
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

//update a book
app.patch("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
