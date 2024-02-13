import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const filename = "Trading-guide.pdf";
    const pdfPath = path.join(
      process.cwd(),
      "utils",
      "backend",
      "pdfs",
      "Trading-guide.pdf"
    );
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      }
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + filename + '"'
      );
      res.send(data);
    });

    // await closeDatabaseConnection();
  } catch (error) {
    console.error("download-trading-guide-pdf error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
