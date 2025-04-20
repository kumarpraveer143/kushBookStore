import mongoose from "mongoose";
import bookSchema from "./book.schema.js";

const bookModel = mongoose.model("Book", bookSchema);

class BookRepository {
  async addBook(bookOjb) {}
}

export default BookRepository;
