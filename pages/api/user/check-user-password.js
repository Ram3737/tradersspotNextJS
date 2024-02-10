const bcrypt = require("bcryptjs");
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email, enteredPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      await closeDatabaseConnection();
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      enteredPassword,
      user.password
    );

    if (!isPasswordMatch) {
      await closeDatabaseConnection();
      return res
        .status(401)
        .json({ message: "Entered password does not match" });
    }

    res.status(200).json({ message: "Password is correct" });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("buyCourse error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
