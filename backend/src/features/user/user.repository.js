import mongoose from "mongoose";
import UserSchema from "./user.schema.js";

const userModel = mongoose.model("User", UserSchema);

class UserRepository {
  async register(registerData) {
    const newUser = new userModel(registerData);
    await newUser.save();
    return newUser;
  }

  async findUserbyEmail(email) {
    const user = await userModel.findOne({ email });
    return user;
  }
}

export default UserRepository;
