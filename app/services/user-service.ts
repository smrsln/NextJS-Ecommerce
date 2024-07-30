import createHttpError from "http-errors";
import { User } from "@/app/models/User";

export async function signInService(email: string, password: string) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new createHttpError.NotFound("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new createHttpError.Unauthorized("Invalid email or password");
    }

    return omitPassword(user);
  } catch (error) {
    if (error instanceof createHttpError.HttpError) {
      // Rethrow known HTTP errors
      throw error;
    }
    // Log the unexpected error if needed
    console.error("Unexpected error during sign-in process:", error);
    throw new createHttpError.InternalServerError("Failed to sign in");
  }
}

export async function signUpService(email: string, password: string) {
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
      // Rethrow known HTTP errors
      throw error;
    }
    // Log the unexpected error if needed
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
