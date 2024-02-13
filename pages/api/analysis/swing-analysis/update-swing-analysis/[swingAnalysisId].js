const mongoose = require("mongoose");
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../../../utils/backend/mangodb";
import SwingAnalysisResult from "../../../../../utils/backend/model/swingAnalysisModel";

export default async function handler(req, res) {
  console.log("here");
  try {
    const { db } = await connectToDatabase();

    const { swingAnalysisId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(swingAnalysisId)) {
      // await closeDatabaseConnection();
      return res.status(404).send({ error: "Analysis not found!" });
    }

    const analysis = await SwingAnalysisResult.findByIdAndUpdate(
      swingAnalysisId,
      req.body
    );
    await analysis.save();

    res.status(201).json({
      message: "Analysis Updated",
    });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("update-swing-analysis error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
