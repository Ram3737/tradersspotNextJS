import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const filename = "Trading_in_the_zone.pdf";
    const pdfPath = path.join(
      __dirname,
      "utils",
      "backend",
      "pdfs",
      "Trading_in_the_zone.pdf"
    );
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: err });
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
    console.error("download-trading-in-the-zone-pdf error", error.message);
    res.status(500).json({ message: "Internal server error" });
    // await closeDatabaseConnection();
  }
}
