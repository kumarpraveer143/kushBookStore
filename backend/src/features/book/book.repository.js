import mongoose from "mongoose";
import bookSchema from "./book.schema.js";

const bookModel = mongoose.model("Book", bookSchema);

class BookRepository {
  async addBook(bookObj) {
    const newBook = new bookModel(bookObj);
    await newBook.save();
    return newBook;
  }
  async getAllBooks() {
    const books = await bookModel.find();
    return books;
  }
}

export default BookRepository;
