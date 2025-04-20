import BookRepository from "./book.repository.js";

class BookController {
  constructor() {
    this.bookRepository = new BookRepository();
  }
  async addBook(req, res) {
    res.send(req.body);
  }
}

export default BookController;
