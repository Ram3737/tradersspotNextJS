const mongoose = require("mongoose");
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../utils/backend/mangodb";
import User from "../../../../utils/backend/model/userModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // await closeDatabaseConnection();
      return res.status(404).send({ error: "User not found!" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      // await closeDatabaseConnection();
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("delete-user error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
