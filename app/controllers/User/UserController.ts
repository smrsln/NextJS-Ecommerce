import { User } from "@/app/models/User";
import createHttpError from "http-errors";

class UserController {
  private static omitPassword(user: any) {
    const { password, ...userWithoutPassword } = user.toObject
      ? user.toObject()
      : user;
    return userWithoutPassword;
  }

  static async createUser(email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new createHttpError.Conflict("User already exists");
    }

    const user = new User({ email, password });
    await user.save();

    return this.omitPassword(user);
  }

  static async signIn(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new createHttpError.NotFound("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new createHttpError.Unauthorized("Invalid email or password");
    }

    return this.omitPassword(user);
  }
}

export default UserController;
