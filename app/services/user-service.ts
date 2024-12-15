import createHttpError from "http-errors";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/IUser";

export async function signInService(
  email: string,
  password?: string,
  googleId?: string
): Promise<IUser> {
  try {
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      if (googleId) {
        user = new User({
          email,
          googleId,
        });
        await user.save();
      } else if (password) {
        throw new createHttpError.NotFound("Invalid email or password");
      } else {
        throw new createHttpError.BadRequest("Invalid authentication method");
      }
    }

    // Google authentication için password check'i bypass ediyoruz
    if (!googleId && password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new createHttpError.Unauthorized("Invalid email or password");
      }
    }

    return user;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
}

export async function signUpService(
  email: string,
  password: string
): Promise<IUser> {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new createHttpError.Conflict("User already exists");
    }

    const user = new User({ email, password });
    await user.save();

    return omitPassword(user);
  } catch (error) {
    if (error instanceof createHttpError.HttpError) {
      throw error;
    }
    console.error("Unexpected error during sign-up process:", error);
    throw new createHttpError.InternalServerError("Failed to create user");
  }
}

function omitPassword(user: any) {
  const { password, ...userWithoutPassword } = user.toObject
    ? user.toObject()
    : user;
  return userWithoutPassword;
}
