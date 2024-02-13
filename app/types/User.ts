import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  image?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUser> {}
