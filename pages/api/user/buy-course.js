import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email, courseType, triedToUpdate } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      await closeDatabaseConnection();
      return res.status(404).json({ message: "User not found" });
    }

    user.courseType = courseType;
    user.triedToUpdate = triedToUpdate;
    // user.paid = true;

    await user.save();

    res.status(201).json({
      courseType: courseType,
      triedToUpdate: triedToUpdate,
    });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("buyCourse error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
