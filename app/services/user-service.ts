import createHttpError from "http-errors";
import { User } from "@/app/models/User";
import { IUser } from "@/app/types/IUser";
import { logger } from "@/lib/logger";

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

export async function updateUserFromGoogleProfile(
  dbUser: IUser,
  googleProfile: any,
  account: any
): Promise<IUser | null> {
  try {
    const updates = {
      name: googleProfile.name || dbUser.name,
      image: googleProfile.picture || googleProfile.image || dbUser.image,
      emailVerified: googleProfile.email_verified ? new Date() : undefined,
      givenName: googleProfile.given_name,
      familyName: googleProfile.family_name,
      locale: googleProfile.locale,
      googleId: account.providerAccountId,
      provider: account.provider,
    };

    const updatedFields = Object.entries(updates).reduce<Partial<IUser>>(
      (acc, [key, value]) => {
        if (value && value !== (dbUser as any)[key]) {
          acc[key as keyof IUser] = value;
        }
        return acc;
      },
      {}
    );

    if (Object.keys(updatedFields).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        dbUser.id,
        updatedFields,
        { new: true }
      );

      logger.info(`Updated user profile from Google data: ${dbUser.email}`, {
        service: "Auth",
        method: "POST",
        path: "/api/auth/signin",
        updates: updatedFields,
      });

      return updatedUser;
    }

    return dbUser;
  } catch (error) {
    logger.error(`Failed to update user from Google profile: ${error}`);
    throw error;
  }
}
