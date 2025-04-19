import mongoose, { connect } from "mongoose";

const connectToDB = async () => {
  try {
    const connect = await mongoose.connect(
      "mongodb://127.0.0.1:27017/bookstore"
    );
    console.log("DB is connected Successfully!");
  } catch (err) {
    console.log("Something went wront with DB");
  }
};

export default connectToDB;
