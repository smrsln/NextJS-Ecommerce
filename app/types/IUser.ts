import { Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  name?: string;
  image?: string;
  googleId?: string;
  emailVerified?: Date;
  givenName?: string;
  familyName?: string;
  locale?: string;
  provider?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}
export interface IUserModel extends Model<IUser> {}
