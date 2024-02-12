import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  connectToDatabase,
  closeDatabaseConnection,
} from "../../../utils/backend/mangodb";
import User from "../../../utils/backend/model/userModel";
const bcrypt = require("bcryptjs");

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { db } = await connectToDatabase();

          const email = credentials.email;
          const password = credentials.password;

          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordMatch = await bcrypt.compare(password, user.password);

          if (!isPasswordMatch) {
            throw new Error("Invalid password");
          }

          return { email: user.email };
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
});
