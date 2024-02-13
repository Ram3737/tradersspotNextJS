import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../utils/backend/mangodb";
import FreeSwingAnalysisResult from "../../../../utils/backend/model/freeSwingAnalysisModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const page = req.query.page;
    const searchedId = req.query.search || null;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const breakoutValue = req.query.breakout;
    const rewardValue = req.query.reward;
    const analysisLinkValue = req.query.analysisLink;
    const resultLinkValue = req.query.resultLink;

    let query = [];

    if (analysisLinkValue !== "null") {
      console.log("0");
      query.push({ "result.resultLink": null });
      query.push({ "result.breakout": "none" });
    }

    if (resultLinkValue !== "null") {
      console.log("1");
      query.push({ "result.resultLink": "none" });
    }

    if (
      analysisLinkValue == "null" &&
      breakoutValue &&
      breakoutValue !== "null"
    ) {
      console.log("2");
      query.push({ ["result.breakout"]: breakoutValue });
    }

    if (rewardValue && rewardValue !== "null" && rewardValue == 0) {
      console.log("3");
      query.push({ ["result.reward"]: rewardValue });
    }

    if (rewardValue && rewardValue == 1) {
      console.log("4");
      query.push({ ["result.reward"]: { $gt: 0 } });
    }

    if (searchedId) {
      const objectId = new mongoose.Types.ObjectId(searchedId);
      const allSwingAnalyses = await FreeSwingAnalysisResult.find({
        _id: objectId,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalSwingAnalysis = 1;

      res.status(200).json({ totalSwingAnalysis, allSwingAnalyses });
    } else {
      const allSwingAnalyses = await FreeSwingAnalysisResult.find(
        query.length === 0
          ? {}
          : query.length > 0 && analysisLinkValue == "null"
          ? { $or: query }
          : query.length > 0 && analysisLinkValue == 1
          ? { $and: query }
          : {}
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalSwingAnalysis = await FreeSwingAnalysisResult.countDocuments(
        query.length === 0
          ? {}
          : query.length > 0 && analysisLinkValue == "null"
          ? { $or: query }
          : query.length > 0 && analysisLinkValue == 1
          ? { $and: query }
          : {}
      );

      res.status(200).json({ totalSwingAnalysis, allSwingAnalyses });
    }

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("get-all-free-swing-analysis error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
