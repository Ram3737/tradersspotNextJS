import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";
import { transporter } from "../../../utils/backend/common/commonHelpers";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      await closeDatabaseConnection();
      return res.status(404).json({ message: "Email not found" });
    }

    const mailOptions = {
      from: "tradersspot.in@gmail.com",
      to: email,
      subject: "Purchase confirmation mail",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
      
        <div style="max-width:'100%'; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      

      
          <h2 style="color: #333333;">Trader's spot</h2>
      
          <p style="color: #666666;">Thank you for purchasing our course. You can now access our courses anywhere, anytime through our mobile and web app.</p>
      
          <p class="price" style="color: #0c969a; font-weight: bold;">Happy Trading</p>
      
        </div>
      
      </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mail sent" });

    await closeDatabaseConnection();
  } catch (error) {
    console.error("purchase-confirmation-email error", error.message);
    res.status(500).json({ message: "Internal server error" });
    await closeDatabaseConnection();
  }
}
