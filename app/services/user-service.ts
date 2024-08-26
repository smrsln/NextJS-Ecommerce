import createHttpError from "http-errors";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/IUser";

export async function signInService(
  email: string,
  password?: string,
  googleId?: string
): Promise<IUser> {
  try {
    let user = await User.findOne({ email });

    if (!user) {
      if (googleId) {
        // Create a new user for Google sign-in
        user = new User({ email, googleId });
        await user.save();
      } else {
        throw new createHttpError.NotFound("Invalid email or password");
      }
    } else {
      if (googleId) {
        // Update existing user with Google ID if not present
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      } else if (password) {
        // Regular sign-in
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          throw new createHttpError.Unauthorized("Invalid email or password");
        }
      } else {
        throw new createHttpError.BadRequest("Invalid sign-in method");
      }
    }

    return omitPassword(user);
  } catch (error) {
    if (error instanceof createHttpError.HttpError) {
      throw error;
    }
    console.error("Unexpected error during sign-in process:", error);
    throw new createHttpError.InternalServerError("Failed to sign in");
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
