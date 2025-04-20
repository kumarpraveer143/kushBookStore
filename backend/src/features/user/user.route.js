import express from "express";
import UserController from "./user.controller.js";
const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/register", (req, res) => {
  userController.register(req, res);
});

userRouter.post("/login", (req, res) => {
  userController.login(req, res);
});

userRouter.post("/logout", (req, res) => {
  userController.logout(req, res);
});

export default userRouter;
