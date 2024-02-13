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
      // await closeDatabaseConnection();
      return res.status(404).send({ error: "Analysis not found!" });
    }

    const analysis = await FreeSwingAnalysisResult.findByIdAndUpdate(
      freeSwingAnalysisId,
      req.body
    );
    await analysis.save();

    res.status(201).json({
      message: "Analysis Updated",
    });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("update-free-swing-analysis error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
