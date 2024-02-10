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
    console.log("ui", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      await closeDatabaseConnection();
      return res.status(404).send({ error: "User not found!" });
    }

    const user = await User.findByIdAndUpdate(userId, req.body);

    await user.save();

    res.status(201).json({
      message: "user Updated",
    });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("updateUser error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
