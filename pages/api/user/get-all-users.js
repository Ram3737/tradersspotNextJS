import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const page = req.query.page;
    const limit = req.query.limit || 10;
    const search = req.query.search || null;

    const skip = (page - 1) * limit;

    const courseTypeValue = req.query.courseType;
    const ttuValue = req.query.ttu;
    const paidValue = req.query.paid;

    let query = [];

    if (courseTypeValue && courseTypeValue !== "null") {
      const courseTypeValues = courseTypeValue.split(",");
      query.push({ courseType: { $in: courseTypeValues } });
    }

    if (paidValue && paidValue !== "null") {
      query.push({ paid: paidValue });
    }

    if (ttuValue && ttuValue !== "null") {
      query.push({ triedToUpdate: ttuValue });
    }

    // console.log("ct", courseTypeValue);
    // console.log("pv", paidValue);

    // console.log("user", query);

    if (search) {
      const users = await User.find(
        { email: { $regex: new RegExp(search, "i") } },
        "_id email courseType paid userType triedToUpdate"
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments({
        email: { $regex: new RegExp(search, "i") },
      });

      res.status(200).json({ users, totalUsers });
    } else {
      const users = await User.find(
        query.length > 0 ? { $and: query } : {},
        "_id email courseType paid userType triedToUpdate"
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalUsers = await User.countDocuments(
        query.length > 0 ? { $and: query } : {}
      );
      res.status(200).json({ users, totalUsers });
    }
  } catch (error) {
    console.error("get-all-users", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
