import express from "express";
import BookController from "./book.controller.js";

const bookRouter = express.Router();

const bookController = new BookController();

bookRouter.post("/addBook", (req, res) => {
  bookController.addBook(req, res);
});

bookRouter.get("/getAllBooks", (req, res) => {
  bookController.getAllBooks(req, res);
});

export default bookRouter;
