import UserRepository from "./user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(req, res) {
    const formData = req.body;
    console.log(formData);
    let { password } = formData;
    password = await bcrypt.hash(password, 12);
    formData.password = password;
    try {
      const savedData = await this.userRepository.register(formData);
      res
        .status(200)
        .json({ success: true, message: "Email Registered Successfully!" });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "This email already registered!" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.findUserbyEmail(email);
      const dataBasePassword = user.password;
      const isValid = await bcrypt.compare(password, dataBasePassword);
      if (!isValid) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Credentials" });
      }
      const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true, sucure: false });

      res.status(200).json({ success: true, message: user });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success: false, message: "Some internal server problem!" });
    }
  }

  async logout(req, res) {
    try {
      // Clear the auth token cookie (or any cookie you’ve set)
      res.clearCookie("token");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error during logout" });
    }
  }
}

export default UserController;
