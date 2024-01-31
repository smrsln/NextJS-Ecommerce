// types/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUserCreate extends Model<IUser> {
  createUser: (email: string, password: string) => Promise<IUser>;
}

export interface IUserSignIn extends Model<IUser> {
  signIn: (email: string, password: string) => Promise<IUser>;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  image?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IUserModel
  extends mongoose.Model<IUser>,
    IUserSignIn,
    IUserCreate {}
