import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email, enteredOTP } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // await closeDatabaseConnection();
      return res.status(404).json({ message: "User not found" });
    }

    const { resetPasswordOTP } = user;

    if (!resetPasswordOTP || resetPasswordOTP.expiresAt < Date.now()) {
      // await closeDatabaseConnection();
      return res
        .status(400)
        .json({ message: "OTP expired, Try after sometime..." });
    }
    if (resetPasswordOTP.code !== enteredOTP) {
      // await closeDatabaseConnection();
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Clear the OTP after successful verification
    user.resetPasswordOTP = undefined;

    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("verify-otp error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
