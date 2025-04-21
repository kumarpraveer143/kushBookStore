import BookRepository from "./book.repository.js";

class BookController {
  constructor() {
    this.bookRepository = new BookRepository();
  }

  async addBook(req, res) {
    try {
      const book = await this.bookRepository.addBook(req.body);
      return res.status(200).json({ success: true, message: book });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server problem!" });
    }
  }

  async getAllBooks(req, res) {
    try {
      const books = await this.bookRepository.getAllBooks();
      return res.status(200).json({ success: true, message: books });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Internal server problem!" });
    }
  }
}

export default BookController;
