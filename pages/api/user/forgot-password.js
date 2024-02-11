import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";
import { generateOTP } from "../../../utils/backend/common/commonHelpers";
import { transporter } from "../../../utils/backend/common/commonHelpers";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      await closeDatabaseConnection();
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = generateOTP();

    // Save OTP and timestamp in temporary storage
    user.resetPasswordOTP = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    await user.save();

    // Send OTP to user's email
    const mailOptions = {
      from: "tradersspot.in@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("forgot-password error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
