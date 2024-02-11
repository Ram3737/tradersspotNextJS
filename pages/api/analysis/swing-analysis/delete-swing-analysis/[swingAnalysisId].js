const mongoose = require("mongoose");
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../../utils/backend/mangodb";
import SwingAnalysisResult from "../../../../../utils/backend/model/swingAnalysisModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { swingAnalysisId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(swingAnalysisId)) {
      await closeDatabaseConnection();
      return res.status(404).json({ error: "Analysis not found!" });
    }

    const deletedAnalysis = await SwingAnalysisResult.findByIdAndDelete(
      swingAnalysisId
    );

    if (!deletedAnalysis) {
      await closeDatabaseConnection();
      return res.status(404).json({ error: "Analysis not found!" });
    }

    res.status(200).json({ message: "Analysis deleted successfully" });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("delete-swing-analysis error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
