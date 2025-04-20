import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectToDB from "./src/db/mongodb.js";
import userRouter from "./src/features/user/user.route.js";
import cors from "cors";
import bookRouter from "./src/features/book/book.route.js";

dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/user/", userRouter);
app.use("/api/book/", bookRouter);

app.listen(port, () => {
  connectToDB();
  console.log("Server is up at the port", port);
});
