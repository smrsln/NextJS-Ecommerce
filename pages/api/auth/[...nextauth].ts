import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbCheck from "@/db";
import {
  signInService,
  updateUserFromGoogleProfile,
} from "@/app/services/user-service";
import { logger } from "@/lib/logger";
import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";

interface GoogleProfile {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  sub: string;
}

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
            const user = await signInService(
              credentials.email,
              credentials.password
            );

            if (user) {
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
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code",
            scope: "openid email profile",
          },
        },
      }),
    ],
    session: {
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
      async signIn({ user, account, profile }) {
        if (account?.provider === "google") {
          const googleProfile = profile as GoogleProfile;

          if (!googleProfile.email_verified) {
            logger.error("Google email not verified", {
              email: googleProfile.email,
            });
            return false;
          }

          try {
            await dbCheck();
            const dbUser = await signInService(
              user.email!,
              undefined,
              account.providerAccountId
            );

            if (dbUser) {
              const updatedUser = await updateUserFromGoogleProfile(
                dbUser,
                googleProfile,
                account
              );

              if (updatedUser) {
                user.id = updatedUser.id;
                return true;
              }
            }
          } catch (error) {
            logger.error(`Failed to sign in with Google: ${error}`);
            return false;
          }
        }
        return true;
      },
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.image = user.image;
        }
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user = {
            ...session.user,
            id: token.id as string,
            email: token.email as string,
            name: token.name as string,
            image: token.image as string,
          };
        }
        return session;
      },
      async redirect({ url, baseUrl }) {
        // If URL is from the same origin, use it directly
        if (url.startsWith(baseUrl)) return url;
        // If URL is a relative path (starts with /), combine it with baseUrl
        if (url.startsWith("/")) return new URL(url, baseUrl).toString();
        // For all other cases, redirect to baseUrl
        return baseUrl;
      },
    },
  });
}
