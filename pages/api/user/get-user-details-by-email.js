import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { email } = session.user;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        userType: user.userType,
        courseType: user.courseType,
        paid: user.paid,
        triedToUpdate: user.triedToUpdate,
      });
  } catch (error) {
    console.error("get-user-details", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
