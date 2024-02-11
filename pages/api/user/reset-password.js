const bcrypt = require("bcryptjs");
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      await closeDatabaseConnection();
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("reset-password error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
