import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";
const bcrypt = require("bcryptjs");

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { name, email, mobileNumber, password, courseType, triedToUpdate } =
      req.body;
    const userType = "learner";
    const paid = false;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
      userType,
      courseType,
      paid,
      triedToUpdate,
      // resetPasswordOTP: {
      //   code: null,
      //   expiresAt: null,
      // },
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("create-user error", error.message);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(400).json({ message: "Email already in use" });
    } else if (
      error.code === 11000 &&
      error.keyPattern &&
      error.keyPattern.mobileNumber
    ) {
      res.status(400).json({ message: "Mobile number already in use" });
    } else {
      // Other errors
      res.status(500).json({ message: "Internal server error" });
    }
    // await closeDatabaseConnection();
  }
}
