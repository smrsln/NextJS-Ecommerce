import { IUser } from "./User";

export interface IUserCreate {
  createUser: (email: string, password: string) => Promise<IUser>;
}

export interface IUserSignIn {
  signIn: (email: string, password: string) => Promise<IUser>;
}
