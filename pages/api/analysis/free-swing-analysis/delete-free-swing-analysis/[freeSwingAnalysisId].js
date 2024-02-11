const mongoose = require("mongoose");
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../../utils/backend/mangodb";
import FreeSwingAnalysisResult from "../../../../../utils/backend/model/freeSwingAnalysisModel";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { freeSwingAnalysisId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(freeSwingAnalysisId)) {
      await closeDatabaseConnection();
      return res.status(404).json({ error: "Analysis not found!" });
    }

    const deletedAnalysis = await FreeSwingAnalysisResult.findByIdAndDelete(
      freeSwingAnalysisId
    );

    if (!deletedAnalysis) {
      await closeDatabaseConnection();
      return res.status(404).json({ error: "Analysis not found!" });
    }

    res.status(200).json({ message: "Analysis deleted successfully" });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("delete-free-swing-analysis error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
