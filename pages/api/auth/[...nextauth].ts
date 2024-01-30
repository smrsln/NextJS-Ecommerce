// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/User";

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
          placeholder: "mail@mailprovider.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        try {
          const user: IUser | null = await User.findOne({
            email: credentials.email,
          });

          if (user && (await user.comparePassword(credentials.password))) {
            return {
              id: user.id,
              name: user.name || user.email,
              email: user.email,
              image: user.image || null,
            };
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          throw new Error("Failed to authorize");
        }
      },
    }),
  ],
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
  },
});
