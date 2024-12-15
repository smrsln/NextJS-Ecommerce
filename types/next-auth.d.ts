import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
      givenName?: string | null;
      familyName?: string | null;
      locale?: string | null;
    };
  }
}
