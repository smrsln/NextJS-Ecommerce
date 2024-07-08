import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbCheck from "@/db";
import UserController from "@/app/controllers/User/UserController";
import { logger } from "@/lib/logger";
import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const rememberMeCookie = req.cookies["rememberMe"];
  const maxAge = rememberMeCookie ? 180 * 24 * 60 * 60 : 30 * 24 * 60 * 60; // 30 days expiration

  return await NextAuth(req, res, {
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
            await dbCheck();
            const user = await UserController.signIn(
              credentials.email,
              credentials.password
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
            logger.error(
              `Failed authentication for user: ${credentials.email}`,
              {
                service: "Auth",
                method: "POST",
                path: "/api/auth/signin",
                error: (error as Error).message,
                statusCode:
                  error instanceof createHttpError.HttpError
                    ? error.statusCode
                    : undefined,
              }
            );
            throw new Error((error as Error).message);
          }
        },
      }),
    ],
    session: {
      // Use JSON Web Tokens for session management because it is more lightweight and next middleware can use it
      strategy: "jwt",
      maxAge: maxAge,
    },
    events: {
      async signIn(user) {
        logger.info(`Successful authentication for user: ${user.user.email}`, {
          service: "Auth",
          method: "POST",
          path: "/api/auth/signin",
        });
      },
      async signOut(user) {
        res.setHeader(
          "Set-Cookie",
          "rememberMe=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict"
        );
        logger.info(`User signed out:  ${user.token.email}`, {
          service: "Auth",
          method: "POST",
          path: "/api/auth/signout",
        });
      },
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
}
