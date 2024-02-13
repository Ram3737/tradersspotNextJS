import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../utils/backend/mangodb";
import FreeSwingAnalysisResult from "../../../../utils/backend/model/freeSwingAnalysisModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { analysis, result } = req.body;
    const newFreeSwingAnalysisResult = new FreeSwingAnalysisResult({
      analysis: {
        stockName: analysis.stockName,
        pattern: analysis.pattern,
        analysisLink: analysis.analysisLink,
      },
      result: {
        risk: result.risk,
        reward: result.reward,
        percentage: result.percentage,
        canSharetoAll: result.canSharetoAll,
        breakout: result.breakout,
        resultLink: result.resultLink,
      },
    });

    const savedFreeSwingAnalysisResult =
      await newFreeSwingAnalysisResult.save();

    res.status(201).json({ message: "analysis created" });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("create-free-swing-analysis error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
