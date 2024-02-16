import { User } from "@/app/models/User"; // assuming User is the model
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

class UserController {
  static async createUser(email: string, password: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new createHttpError.Conflict("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const user = new User({ email, password });
    await user.save();
    return user;
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

    // const { password: _, ...userObject } = user.toObject();

    return user;
  }
}

export default UserController;
