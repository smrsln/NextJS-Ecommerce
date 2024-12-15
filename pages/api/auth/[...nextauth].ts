import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbCheck from "@/db";
import { signInService } from "@/app/services/user-service";
import { logger } from "@/lib/logger";
import createHttpError from "http-errors";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/IUser";

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
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: "select_account",
            access_type: "offline",
            response_type: "code",
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
          logger.info("Google Sign In Data:", {
            service: "Auth",
            method: "POST",
            path: "/api/auth/signin",
            data: { user, account, profile },
          });

          try {
            await dbCheck();
            const dbUser = await signInService(
              user.email!,
              undefined,
              account.providerAccountId
            );

            if (dbUser) {
              // Google'dan gelen tüm relevant bilgileri güncelle
              const updates = {
                name: user.name || dbUser.name,
                image: user.image || dbUser.image,
                // Diğer Google'dan gelen bilgileri de ekleyebiliriz
                // locale: profile.locale,
                // givenName: profile.given_name,
                // familyName: profile.family_name,
              };

              // Sadece değişen alanları güncelle
              const updatedFields = Object.entries(updates).reduce<
                Partial<IUser>
              >((acc, [key, value]) => {
                if (value && value !== (dbUser as any)[key]) {
                  acc[key as keyof IUser] = value;
                }
                return acc;
              }, {});

              if (Object.keys(updatedFields).length > 0) {
                await User.findByIdAndUpdate(dbUser.id, updatedFields);
                logger.info(
                  `Updated user profile from Google data: ${dbUser.email}`,
                  {
                    service: "Auth",
                    method: "POST",
                    path: "/api/auth/signin",
                    updates: updatedFields,
                  }
                );
              }

              user.id = dbUser.id;
              return true;
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
          token.name = user.name || user.email;
          token.email = user.email;
        }
        if (account) {
          token.accessToken = account.access_token;
        }
        return token;
      },
      async session({ session, token }) {
        session.user = { ...token };
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
