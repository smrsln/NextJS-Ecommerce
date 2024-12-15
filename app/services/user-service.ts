import createHttpError from "http-errors";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/IUser";

export async function signInService(
  email: string,
  password?: string,
  googleId?: string
): Promise<IUser> {
  try {
    let user;

    // Google ile giriş
    if (googleId) {
      user = await User.findOne({
        $or: [
          { googleId },
          { email }, // Eğer email ile kayıtlı kullanıcı varsa, Google ID'sini ekleyeceğiz
        ],
      });

      if (!user) {
        // Yeni Google kullanıcısı oluştur
        user = new User({
          email,
          googleId,
        });
        await user.save();
      } else if (!user.googleId) {
        // Eğer email ile kayıtlı kullanıcı varsa, Google ID'sini ekle
        user.googleId = googleId;
        await user.save();
      }
      return user;
    }

    // Normal email/şifre ile giriş
    if (password) {
      user = await User.findOne({ email });

      if (!user) {
        throw new createHttpError.NotFound("Invalid email or password");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new createHttpError.Unauthorized("Invalid email or password");
      }

      return user;
    }

    throw new createHttpError.BadRequest("Invalid authentication method");
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
