import express from "express";
import dotenv from "dotenv";
import connectToDB from "./src/db/mongodb.js";

dotenv.config();
const app = express();

const port = process.env.PORT;



app.listen(port, () => {
  connectToDB();
  console.log("Server is up at the port", port);
});
