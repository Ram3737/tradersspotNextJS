import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // await closeDatabaseConnection();
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // await closeDatabaseConnection();
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        userType: user.userType,
      },
      "willbethebestsecretkeyintheworldnouniversenogalaxy",
      { expiresIn: "1h" } // Set the expiration time of the token
    );

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      userType: user.userType,
      courseType: user.courseType,
      paid: user.paid,
      token: token,
      triedToUpdate: user.triedToUpdate,
    });
  } catch (error) {
    console.error("signin-user error", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
