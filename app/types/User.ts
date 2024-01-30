// types/User.ts
import { Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  image?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IUserCreate extends Model<IUser> {
  createUser: (email: string, password: string) => Promise<IUser>;
}
