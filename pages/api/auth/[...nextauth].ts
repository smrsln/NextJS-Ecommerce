// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/User";

export default NextAuth({
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

        // Use the User model to find the user and verify their password
        const user: IUser | null = await User.findOne({
          email: credentials.email,
        });

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name || user.email, // Use email as name if name is not provided
            email: user.email,
            image: null,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name || user.email; // Use email as name if name is not provided
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
