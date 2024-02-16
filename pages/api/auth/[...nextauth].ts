import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/db";
import UserController from "@/app/controllers/User/UserController";
import { logger } from "@/utils/logger";
import createHttpError from "http-errors";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        try {
          await dbConnect();
          const user = await UserController.signIn(
            credentials.email,
            credentials.password
          );

          logger.info(
            `Successful authentication for user: ${credentials.email}`,
            {
              service: "Auth",
              method: "POST",
              path: "/api/auth/signin",
            }
          );

          if (user) {
            //&& (await user.comparePassword(credentials.password))
            return {
              id: user.id,
              name: user.name || user.email,
              email: user.email,
              image: user.image || null,
            };
          } else {
            return null;
          }
        } catch (error) {
          logger.error(`Failed authentication for user: ${credentials.email}`, {
            service: "Auth",
            method: "POST",
            path: "/api/auth/signin",
            error: (error as Error).message,
            statusCode:
              error instanceof createHttpError.HttpError
                ? error.statusCode
                : undefined,
          });
          throw new Error((error as Error).message);
        }
      },
    }),
  ],
  session: {
    // Use JSON Web Tokens for session management because it is more lightweight and next middleware can use it
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name || user.email;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...token };
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
});
